import React, { useState, useEffect } from "react";
import {
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
} from "@mui/material";
import {
  Box,
  Heading,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
} from "@chakra-ui/react";
import service from "../../services/controller";
import utils from "../../services/utils";
import { MdAdd } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { HiViewList } from "react-icons/hi";
import { TiArrowBack } from "react-icons/ti";
import { IoMdSearch } from "react-icons/io";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import RiseLoader from "react-spinners/RiseLoader";
import TemplateModal from "../common/TemplateModal";
function Salary() {
  const details = {
    ctc: 0.0,
    basic: 0.0,
    hra: 0.0,
    medical: 0.0,
    bonus: 0.0,
    convinenceAllowance: 0.0,
    communicationAllowance: 0.0,
    epf: 0.0,
    pf: 0.0,
    incomeTax: 0.0,
    netSalary: 0.0,
    grossSalary: 0.0,
    totalDeductions: 0.0,
    employeeName: "",
    salaryStatus: "UnPaid",
  };
  const toast = useToast();
  const [salaryDetails, setSalaryDetails] = useState(details);
  const [allemployees, setAllEmployees] = useState([]);
  const [allsalaries, setAllSalaries] = useState([]);
  const [activeEmployee, setActiveEmployee] = useState([]);
  const [customFieldName, setCustomFieldName] = useState("");
  const [isDeduction, setIsDeduction] = useState(false);
  const [customFields, setCustomFields] = useState([]);
  const [isDisable, setIsDisable] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const rowsPerPage = 5; // Rows to display per page

  useEffect(() => {
    setIsLoading(true);
    service.GetAllEmployees().then((data) => {
      if (data.status === "success") {
        var result = data.data;
        setAllEmployees(result);
        setIsLoading(false);
      } else {
        console.error("err", data);
      }
    });
    service.getEmployeesSalaryDetails().then((data) => {
      if (data.status === "success") {
        var result = data.data;
        setAllSalaries(result);
        setIsLoading(false);
      } else {
        console.error("err", data);
      }
    });
  }, []);

  useEffect(() => {
    const {
      basic,
      hra,
      medical,
      bonus,
      convinenceAllowance,
      communicationAllowance,
      epf,
      pf,
      incomeTax,
    } = salaryDetails;

    // Calculate gross salary
    let grossSalary =
      (parseFloat(basic) || 0) +
      (parseFloat(hra) || 0) +
      (parseFloat(medical) || 0) +
      (parseFloat(convinenceAllowance) || 0) +
      (parseFloat(communicationAllowance) || 0);

    // Add non-deduction custom fields to grossSalary
    customFields.forEach((field) => {
      if (!field.isDeduction) {
        grossSalary += parseFloat(salaryDetails[field.id]) || 0;
      }
    });

    // Calculate net salary
    let netSalary =
      grossSalary -
      (parseFloat(epf) || 0) -
      (parseFloat(pf) || 0) -
      (parseFloat(incomeTax) || 0);

    // Subtract deduction custom fields from netSalary
    customFields.forEach((field) => {
      if (field.isDeduction) {
        netSalary -= parseFloat(salaryDetails[field.id]) || 0;
      }
    });
    //calculating total deductions
    var totalDeductions =
      (parseFloat(epf) || 0) +
      (parseFloat(pf) || 0) +
      (parseFloat(incomeTax) || 0);
    // add deduction custom fields from totalDeductions
    customFields.forEach((field) => {
      if (field.isDeduction) {
        totalDeductions += parseFloat(salaryDetails[field.id]) || 0;
      }
    });
    // Only update salary details if grossSalary or netSalary has changed
    if (
      salaryDetails.grossSalary !== grossSalary ||
      salaryDetails.netSalary !== netSalary
    ) {
      setSalaryDetails((prevDetails) => ({
        ...prevDetails,
        grossSalary,
        netSalary,
        totalDeductions,
      }));
    }
  }, [
    salaryDetails.basic,
    salaryDetails.hra,
    salaryDetails.medical,
    salaryDetails.bonus,
    salaryDetails.convinenceAllowance,
    salaryDetails.communicationAllowance,
    salaryDetails.epf,
    salaryDetails.pf,
    salaryDetails.incomeTax,
    salaryDetails,
    ...customFields.map((field) => salaryDetails[field.id]), // Track changes in custom fields
    JSON.stringify(customFields), // Track deep changes in customFields array
  ]);

  // Pagination logic
  const indexOfLastSalary = currentPage * rowsPerPage;
  const indexOfFirstSalary = indexOfLastSalary - rowsPerPage;

  // Search Logic: Filter employees based on search input
  const filteredEmployees = allemployees.filter(
    (employee) =>
      employee.employeeId
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      `${employee.firstName} ${employee.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const currentEmployees = filteredEmployees.slice(
    indexOfFirstSalary,
    indexOfLastSalary
  );

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

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
  const handleInputChange = (field, value) => {
    const rawValue = value.replace(/,/g, "").trim();
    const numericValue =
      rawValue === "" || isNaN(rawValue) ? 0 : parseFloat(rawValue);

    setSalaryDetails((prevData) => ({
      ...prevData,
      [field]: numericValue,
    }));
  };

  const getFormattedValue = (field) => {
    const salaryValue = salaryDetails[field];

    // Otherwise, show formatted salary value if it's not 0
    if (salaryValue === 0 || salaryValue === undefined) return "0";
    return utils.formatNumber(salaryValue);
  };

  const toCamelCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word, index) => {
        if (index === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join("");
  };
  const OnUpdateEmpSalaryDetails = (data) => {
    setAllSalaries(data);
  };
  const handleAddCustomField = () => {
    const camelCaseId = toCamelCase(customFieldName);

    const newField = {
      id: camelCaseId,
      label: customFieldName,
      isDeduction: isDeduction,
    };
    const fieldExists = customFields.some((field) => field.id === camelCaseId);
    if (!fieldExists) {
      // Add the new custom field to the state
      const updatedCustomFields = [...customFields, newField];
      setCustomFields(updatedCustomFields);

      // Save custom fields to localStorage
      localStorage.setItem(
        `customFields_${activeEmployee[0].employeeId}`,
        JSON.stringify(updatedCustomFields)
      );
    }

    // Add the new field to salaryDetails to keep track of its value
    setSalaryDetails((prevData) => ({
      ...prevData,
      [camelCaseId]: 0,
    }));

    setIsDeduction(false);
    onClose();
  };
  const handleSalaryDetails = async (empId) => {
    setIsDisable(true);
    setShowTemplateModal(false);

    var activeField = await allemployees.find(
      (employee) => employee.employeeId === empId
    );
    service.getSalaryDetailsByEmpId({ employeeId: empId }).then((data) => {
      if (data.status === "success") {
        const salaryData = data.data;

        if (Object.keys(salaryData).length === 0) {
          setSalaryDetails(details);
        } else {
          const filteredSalaryDetails = Object.fromEntries(
            Object.entries(salaryData).filter(
              ([key]) =>
                ![
                  "_id",
                  "__v",
                  "id",
                  "employeeId",
                  "createdDate",
                  "modifiedDate",
                  "employeeName",
                ].includes(key)
            )
          );
          setSalaryDetails(filteredSalaryDetails);
        }
      }
    });

    // Load custom fields for the selected employee from localStorage
    const savedFields =
      JSON.parse(localStorage.getItem(`customFields_${empId}`)) || [];
    setCustomFields(savedFields);

    setActiveEmployee([activeField]);
  };

  const OnUpload = async () => {
    setIsLoading(true);
    const { firstName, lastName, employeeId } = activeEmployee[0];
    salaryDetails.employeeId = employeeId;
    salaryDetails.employeeName = firstName + " " + lastName;

    await service.postSalaryDetails(salaryDetails).then((data) => {
      try {
        if (data.status === "success") {
          // Update allsalaries state with new salary details
          const updatedSalaries = allsalaries.map((item) =>
            item.employeeId === employeeId
              ? { ...item, ctc: salaryDetails.ctc } // Update CTC for the uploaded employee
              : item
          );
          toast(utils.getToastNotification("success", data.message));
          setAllSalaries(updatedSalaries);
          setIsDisable(false); // Return to table view after upload
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error", error);
        toast(utils.getToastNotification("error", data.message));
      }
    });
  };

  const getButtonLabel = (empId) => {
    const salary = allsalaries.find((salary) => salary.employeeId === empId);
    return salary && salary.ctc !== 0 ? "View Salary" : "Add Salary";
  };
  return (
    <>
      {!isDisable ? (
        <Box className="mt-5">
          <Box className="flex flex-row justify-between mr-10">
            <Box className="w-[23vw] flex flex-row">
              <InputGroup size="md" className="mx-5">
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
            <Button
              startIcon={<MdAdd />}
              variant="contained"
              size="small"
              onClick={() => {
                setShowTemplateModal(true);
                onOpen();
              }}
            >
              Import from Excel
            </Button>
          </Box>
          <TableContainer className="mt-8">
            <Table
              variant="simple"
              sx={{ borderCollapse: "separate", borderSpacing: "0" }}
            >
              <Thead>
                <Tr>
                  <Th>Employee Id</Th>
                  <Th>Employee Name</Th>
                  <Th>E-Mail</Th>
                  <Th>Designation</Th>
                  <Th>Add / View</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentEmployees.map((item, index) => {
                  const label = getButtonLabel(item.employeeId); // Get the button label
                  return (
                    <Tr key={index} _hover={{ backgroundColor: "gray.100" }}>
                      <Td>{item.employeeId}</Td>
                      <Td>
                        {item.firstName} {item.lastName}
                      </Td>
                      <Td>{item.email}</Td>
                      <Td>{item.designation}</Td>
                      <Td>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            handleSalaryDetails(item.employeeId);
                          }}
                          startIcon={
                            label === "Add Salary" ? <MdAdd /> : <HiViewList />
                          }
                        >
                          {label}
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
            {/* Pagination Buttons */}
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
          </TableContainer>
          {isLoading ? (
            <Box className="flex flex-row justify-center top-[13vh] relative">
              <RiseLoader loading={isLoading} size={12} color="blue" />
            </Box>
          ) : null}
        </Box>
      ) : (
        <Box>
          <Box className="mx-7 my-[80px]">
            <Heading size="md" className="mb-8 text-gray-500">
              {activeEmployee[0]?.firstName} {activeEmployee[0]?.lastName}{" "}
              Salary Structure
            </Heading>
            <Box className="grid grid-cols-3 gap-5">
              <TextField
                id="ctc"
                label="CTC"
                variant="outlined"
                size="small"
                placeholder="Type...."
                onChange={(e) => handleInputChange("ctc", e.target.value)}
                value={getFormattedValue("ctc")}
              />
              {Object.keys(salaryDetails)
                .filter(
                  (key) =>
                    ![
                      "netSalary",
                      "grossSalary",
                      "ctc",
                      "totalDeductions",
                      "employeeName",
                      "salaryStatus",
                      "employeeId",
                    ].includes(key)
                ) // Exclude netSalary and grossSalary
                .map((key) => (
                  <TextField
                    key={key}
                    id={key}
                    variant="outlined"
                    label={utils.camelCaseToUpperCaseText(key)}
                    size="small"
                    placeholder="Type...."
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    value={getFormattedValue(key)}
                    disabled={["netSalary", "grossSalary"].includes(key)} // This check is now unnecessary, but you can keep it
                  />
                ))}
            </Box>
            <Box className="grid grid-cols-3 gap-4 mt-7">
              <TextField
                id="netSalary"
                label="NET SALARY"
                variant="outlined"
                size="small"
                placeholder="Type...."
                value={getFormattedValue("netSalary")}
                disabled
              />
              <TextField
                id="grossSalary"
                label="GROSS SALARY"
                variant="outlined"
                size="small"
                placeholder="Type...."
                value={getFormattedValue("grossSalary")}
                disabled
              />
              <Button
                variant="outlined"
                className="float-right"
                onClick={() => {
                  onOpen();
                }}
                startIcon={<MdAdd />}
              >
                Add new
              </Button>
            </Box>
            <footer>
              <Box>
                <Button
                  variant="contained"
                  className="float-right"
                  style={{ margin: "20px 0px" }}
                  startIcon={<FiUpload />}
                  onClick={OnUpload}
                >
                  Upload
                </Button>
                <Button
                  variant="contained"
                  className="float-right"
                  style={{ margin: "20px 10px" }}
                  startIcon={<TiArrowBack />}
                  onClick={() => {
                    setIsDisable(!isDisable);
                  }}
                >
                  Back
                </Button>
              </Box>
            </footer>
          </Box>
        </Box>
      )}
      {showTemplateModal ? (
        <Box>
          <TemplateModal
            message="Salary"
            isOpen={isOpen}
            onClose={onClose}
            OnUpdateEmpSalaryDetails={OnUpdateEmpSalaryDetails}
          />
        </Box>
      ) : (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add new field</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <TextField
                size="small"
                placeholder="Enter New Label"
                onChange={(e) => setCustomFieldName(e.target.value)}
                className="w-full"
              />

              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isDeduction}
                      onChange={(e) => setIsDeduction(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Is Deduction"
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant="ghost" onClick={handleAddCustomField}>
                Add
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default Salary;
