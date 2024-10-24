import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Select,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  IconButton,
  useToast,
  Switch,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import axios from "axios";
import { IoMdArrowDropdown, IoMdSearch } from "react-icons/io";
import service from "../../services/controller";
import utils from "../../services/utils";
import SalarySlip from "./SalarySlip";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer"; // Import PDFDownloadLink
import { FaFileDownload, FaAngleLeft, FaAngleRight } from "react-icons/fa"; // Import icons
import RiseLoader from "react-spinners/RiseLoader";
// Array for months and years
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const years = Array.from(new Array(15), (val, index) => index + 2015); // Years from 2015 to 2030

function Payroll() {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showSlip, setShowSlip] = useState(false);
  const [empDetails, setEmpDetails] = useState([]);
  const [empSalary, setEmpSalary] = useState([]);
  const [employeerData, setEmployeerData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [imageDimensions, setImageDimensions] = useState({
    width: 40,
    height: 40,
  });
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");
  const [isDimensionsLoaded, setIsDimensionsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSalarySwitchOn, setIsSalarySwitchOn] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const toast = useToast();
  const rowsPerPage = 5; // Rows to display per page
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api";
  // Function to update image dimensions
  const updateImageDimensions = async (logourl) => {
    try {
      const dimensions = await utils.getImageDimensions(logourl);

      // Perform proportional scaling
      const maxWidth = 300;
      const maxHeight = 40;
      let width = dimensions.width;
      let height = dimensions.height;

      if (width > maxWidth || height > maxHeight) {
        const widthRatio = maxWidth / width;
        const heightRatio = maxHeight / height;
        const ratio = Math.min(widthRatio, heightRatio);
        width *= ratio;
        height *= ratio;
      }

      setImageDimensions({ width, height });
      setIsDimensionsLoaded(true); // Set as loaded when dimensions are updated
    } catch (error) {
      console.error("Error fetching image dimensions:", error);
    }
  };
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    });
    setSelectedMonth(currentMonth.slice(0, 3));
    setSelectedYear(currentDate.getFullYear());
    const savedLogoUrl = localStorage.getItem("logoUrl");
    if (savedLogoUrl) {
      const LogoUrl = JSON.parse(savedLogoUrl);
      setCompanyLogoUrl(LogoUrl);
      updateImageDimensions(LogoUrl);
    }
    service.getEmployeesSalaryDetails().then((data) => {
      if (data.status === "success") {
        setSalaries(data.data);
      }
    });
    service.GetAllEmployees().then((data) => {
      if (data.status === "success") {
        setEmployees(data.data);
      }
    });
    service.GetEmployeerDetails().then((data) => {
      if (data.status === "success") {
        setEmployeerData(data.data[4]);
        updateImageDimensions();
      }
    });
    // Check localStorage for switch state
    const savedSwitchState = localStorage.getItem("isSalarySwitchOn");
    if (savedSwitchState) {
      setIsSalarySwitchOn(JSON.parse(savedSwitchState));
    }
  }, []);

  // Handlers for month and year selection
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const generatePayslip = async (item) => {
    setIsLoading(true);
    //await fetchImageDimensions();
    setShowSlip(!showSlip);
    setEmpSalary(item);
    const activeEmployee = employees.find(
      (employee) => employee.employeeId === item.employeeId
    );
    setEmpDetails(activeEmployee);
    setIsLoading(false);
  };

  // Handler for changing the salary status
  const handleStatusChange = (employeeId, status) => {
    if (!isSalarySwitchOn) {
      const updatingSalaryDetails = salaries.find(
        (salary) => salary.employeeId === employeeId
      );
      if (updatingSalaryDetails) {
        updatingSalaryDetails.salaryStatus = status;
      }
      // Call the API with employeeId and status
      service.postSalaryDetails(updatingSalaryDetails).then((response) => {
        if (response.status === "success") {
          setSalaries(response.data);
        }
      });
    } else {
      toast(
        utils.getToastNotification(
          "warning",
          "You can't change the status. Because, Change all Status to Paid switch is active.",
          4000
        )
      );
    }
  };
  const handleChangeAllStatus = async (event) => {
    const status = event.target.checked ? "Paid" : "UnPaid"; // Change based on switch value

    try {
      const response = await service.updateSalaryStatusForAll({ status });
      if (response.status === "success") {
        setSalaries(response.data); // Update UI with the updated salaries
        localStorage.setItem("isSalarySwitchOn", !isSalarySwitchOn); // Save switch state
        toast(utils.getToastNotification("success", response.message));
        setIsSalarySwitchOn(!isSalarySwitchOn);
      }
    } catch (error) {
      toast(
        utils.getToastNotification(
          "error",
          "Failed to update salary status for all employees."
        )
      );
    }
  };
  const handleSendAllEmails = async (event) => {
    const statusCheck = event.target.checked;
    // Fetch all employees (assuming employees are already in the state)
    try {
      if (statusCheck) {
        toast(
          utils.getToastNotification(
            "info",
            "Sending Emails will run in background"
          )
        );
        for (const salary of salaries) {
          // Send email to each employee
          await sendEmailWithPDF(salary);
        }
        setIsEmailSent(true); // Mark emails as sent
        toast(
          utils.getToastNotification("success", "Emails sent successfully")
        );
      } else {
        setIsEmailSent(false);
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      toast(utils.getToastNotification("error", "Error sending emails"));
    }
  };
  // Pagination logic
  const indexOfLastSalary = currentPage * rowsPerPage;
  const indexOfFirstSalary = indexOfLastSalary - rowsPerPage;

  // Search Logic: Filter employees based on search input
  const filteredSalaries = salaries.filter(
    (salary) =>
      salary.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salary.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentSalaries = filteredSalaries.slice(
    indexOfFirstSalary,
    indexOfLastSalary
  );

  const totalPages = Math.ceil(filteredSalaries.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // Modified function to generate PDF and send email
  const sendEmailWithPDF = async (item) => {
    if (!isSalarySwitchOn) {
      setIsLoading(true);
    }

    try {
      // Now that the dimensions are set, continue with the PDF generation and email
      const activeEmployee = employees.find(
        (employee) => employee.employeeId === item.employeeId
      );

      if (!activeEmployee) {
        console.error("Employee not found");
        setIsLoading(false);
        return;
      }

      // Generate PDF Blob after dimensions are set
      const blob = await pdf(
        <SalarySlip
          EmpDetails={activeEmployee}
          EmpSalary={item}
          CompanyDetails={employeerData}
          Month={selectedMonth}
          Year={selectedYear}
          Dimensions={imageDimensions} // Now use the updated image dimensions
        />
      ).toBlob();

      const formData = new FormData();
      formData.append(
        "pdf",
        blob,
        `Payslip_${item.employeeName}_${selectedMonth}-${selectedYear}.pdf`
      );
      formData.append("email", activeEmployee.email);
      formData.append(
        "subject",
        `Payslip for ${selectedMonth} ${selectedYear}`
      );
      formData.append(
        "message",
        `Please find your payslip for ${selectedMonth} ${selectedYear} attached.`
      );
      formData.append("fromEmail", employeerData.employerEmail);

      // Send request to backend
      const response = await axios.post(
        `${apiUrl}/payroll/payslipemail`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        if (!isSalarySwitchOn) {
          toast(utils.getToastNotification("success", response.data.message));
        }
      } else {
        console.error("Failed to send email", response);
        toast(utils.getToastNotification("error", "Failed to send email"));
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast(utils.getToastNotification("error", "Error sending email"));
    } finally {
      if (!isSalarySwitchOn) {
        setIsLoading(false);
      }
    }
  };
  if (!isDimensionsLoaded) {
    return <div>Loading...</div>; // or a loading spinner
  }
  return (
    <div>
      {!showSlip ? (
        <Box className="px-5 py-5 flex flex-row justify-between">
          <Box className="w-[21vw]">
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none">
                <IoMdSearch color="gray.300" size="25px" />
              </InputLeftElement>
              <Input
                placeholder="Search by ID or Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Box>
          <Box className="w-[25vw] flex flex-row mr-5">
            <Select
              onChange={handleMonthChange}
              value={selectedMonth}
              size="md"
              className="mr-3"
              icon={<IoMdArrowDropdown />}
            >
              <option value="" disabled>
                Select Month
              </option>
              {months.map((item, ind) => {
                return <option key={ind}>{item}</option>;
              })}
            </Select>
            <Select
              onChange={handleYearChange}
              value={selectedYear}
              size="md"
              className="ml-3"
              icon={<IoMdArrowDropdown />}
            >
              <option value="" disabled>
                Select Year
              </option>
              {years.map((item, ind) => {
                return <option key={ind}>{item}</option>;
              })}
            </Select>
          </Box>
        </Box>
      ) : null}
      <Box>
        {isLoading ? (
          <Box className="flex flex-row justify-center top-[20vh] relative">
            <RiseLoader loading={isLoading} size={12} color="blue" />
          </Box>
        ) : null}
      </Box>
      {/* Salary Table */}
      {!showSlip ? (
        <Box>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Employee Id</Th>
                  <Th>Employee Name</Th>
                  <Th>Net Salary</Th>
                  <Th>Total Deductions</Th>
                  <Th>Status</Th>
                  <Th>Generate</Th>
                  <Th>Send to Email</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentSalaries.map((item, index) => {
                  return (
                    <Tr key={index} _hover={{ backgroundColor: "gray.100" }}>
                      <Td>{item.employeeId}</Td>
                      <Td>{item.employeeName}</Td>
                      <Td>{utils.formatNumber(item.netSalary)}</Td>
                      <Td>{utils.formatNumber(item.totalDeductions ?? 0)}</Td>
                      <Td>
                        <Select
                          size="md"
                          value={item.salaryStatus}
                          onChange={(e) =>
                            handleStatusChange(item.employeeId, e.target.value)
                          }
                        >
                          <option value="UnPaid">UnPaid</option>
                          <option value="Paid">Paid</option>
                        </Select>
                      </Td>
                      <Td>
                        <Button
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => generatePayslip(item)}
                          isDisabled={item.salaryStatus !== "Paid"}
                        >
                          Generate Payslip
                        </Button>
                      </Td>
                      <Td>
                        <Button
                          colorScheme="blue"
                          variant="link"
                          onClick={() => sendEmailWithPDF(item)} // Send email on click
                          isDisabled={item.salaryStatus !== "Paid"}
                        >
                          Send to Email
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>

            {/* Pagination Buttons */}
            <Box className="flex flex-row justify-end m-5">
              <Box
                position="fixed"
                bottom="0"
                left="15%"
                width="85%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                py={4}
              >
                <IconButton
                  onClick={handlePrevPage}
                  isDisabled={currentPage === 1}
                  colorScheme="blue"
                  mr={2}
                  icon={<FaAngleLeft />}
                />
                {/* Page number display */}
                <Box mx={4}>
                  {currentPage} / {totalPages}
                </Box>
                <IconButton
                  onClick={handleNextPage}
                  isDisabled={currentPage === totalPages}
                  colorScheme="blue"
                  ml={2}
                  icon={<FaAngleRight />}
                />
              </Box>
              {currentPage === 1 && (
                <Box className="flex flex-row justify-end">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="status-switch" mb="0">
                      Change all Status to Paid
                    </FormLabel>
                    <Switch
                      id="status-switch"
                      isChecked={isSalarySwitchOn}
                      onChange={handleChangeAllStatus} // Trigger bulk update on switch change
                    />
                  </FormControl>

                  <Box className="ml-5">
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="status-switch" mb="0" size="sm">
                        Send Emails to All Employees
                      </FormLabel>
                      <Switch
                        id="status-switch"
                        isChecked={isEmailSent}
                        isDisabled={!isSalarySwitchOn}
                        onChange={handleSendAllEmails}
                      />
                    </FormControl>
                  </Box>
                </Box>
              )}
            </Box>
          </TableContainer>
        </Box>
      ) : (
        <Box className="relative flex flex-row">
          {/* PDF Viewer */}
          <PDFViewer width="100%" height="615">
            <SalarySlip
              EmpDetails={empDetails}
              EmpSalary={empSalary}
              CompanyDetails={employeerData}
              Month={selectedMonth}
              Year={selectedYear}
              Dimensions={imageDimensions}
            />
          </PDFViewer>

          {/* Back Button */}
          <Box className="absolute bottom-5 right-7">
            <PDFDownloadLink
              document={
                <SalarySlip
                  EmpDetails={empDetails}
                  EmpSalary={empSalary}
                  CompanyDetails={employeerData}
                  Month={selectedMonth}
                  Year={selectedYear}
                  Dimensions={imageDimensions}
                />
              }
              fileName={`Payslip_${empSalary.employeeName}_${selectedMonth}-${selectedYear}.pdf`}
            >
              {({ loading }) => (
                <Button mr={3} colorScheme="blue" isDisabled={loading}>
                  <FaFileDownload /> {loading ? "Generating..." : "Download"}
                </Button>
              )}
            </PDFDownloadLink>

            <Button
              colorScheme="blue"
              onClick={() => {
                setShowSlip(false);
              }}
            >
              Back
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
}

export default Payroll;
