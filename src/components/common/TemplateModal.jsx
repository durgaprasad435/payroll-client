import React, { useState } from "react";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";
import service from "../../services/controller";
import utilities from "../../services/utils";
import { MdCloudUpload } from "react-icons/md";
import { FaFileDownload} from "react-icons/fa";
function TemplateModal({
  isOpen,
  onClose,
  message,
  OnUpdateEmployeeDetails,
  OnUpdateEmpSalaryDetails,
  OnUpdateAddressDetails,
}) {
  //const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();
  // Utility function to convert Excel date to dd/mm/yyyy
  const excelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400; // seconds in a day
    const date_info = new Date(utc_value * 1000); // milliseconds in a second
    const date = new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate()
    );
    return date.toLocaleDateString("en-GB"); // Format: dd/mm/yyyy
  };

  // Utility function to convert headers to camelCase
  const toCamelCase = (str) => {
    return str
      .toLowerCase()
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
        index === 0 ? match.toLowerCase() : match.toUpperCase()
      )
      .replace(/\s+/g, "");
  };

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.name.endsWith(".xlsx")) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Convert headers to camelCase and map rows to JSON
        const headers = json[0].map((header) => toCamelCase(header));
        json = json.slice(1).map((row) => {
          const rowData = {};
          row.forEach((cell, index) => {
            const key = headers[index];

            // If column is Date of Birth or Join Date, convert to dd/mm/yyyy
            if (key === "dateOfBirth" || key === "joinDate") {
              rowData[key] = excelDateToJSDate(cell);
            } else {
              rowData[key] = cell;
            }
          });
          return rowData;
        });

        setJsonData(json); // Store the converted JSON data
      };
      reader.readAsArrayBuffer(uploadedFile);
    } else {
      alert("Please upload a valid Excel file");
    }
  };

  const handleDownloadTemplate = () => {
    // Headers for Employee Details
    const employeeheaders = [
      {
        firstName: "First Name",
        lastName: "Last Name",
        gender: "Gender",
        dateOfBirth: "Date of Birth", // Date will be converted in the JSON
        mobileNumber: "Mobile Number",
        email: "Email",
        employeeId: "Employee Id",
        designation: "Designation",
        employeeCode: "Employee Code",
        joinDate: "Join Date", // Date will be converted in the JSON
        PAN: "PAN",
        aadhar: "Aadhar",
        accountNumber: "Account Number",
        bankName: "Bank Name",
        IFSCCode: "IFSC Code",
        UAN: "UAN",
        PFNo: "PF No",
      },
    ];

    // Headers for Salary Details
    const salaryheaders = [
      {
        employeeId: "Employee Id",
        employeeName: "Employee Name",
        basic: "Basic",
        hra: "HRA",
        medical: "Medical",
        bonus: "Bonus",
        convinenceAllowance: "Convinence Allowance",
        communicationAllowance: "Communication Allowance",
        epf: "EPF",
        pf: "PF",
        incomeTax: "Income Tax",
        netSalary: "Net Salary",
        grossSalary: "Gross Salary",
        totalDeductions: "Total Deductions",
        ctc: "CTC",
        salaryStatus: "Salary Status",
      },
    ];
    const addressheaders = [
      {
        employeeId: "Employee Id",
        addessType: "Address Type",
        addressLine1: "Address Line 1",
        addressLine2: "Address Line 2",
        addressLine3: "Address Line 3",
        city: "City",
        state: "State",
        country: "Country",
        zipCode: "ZIP Code",
      },
    ];

    // Function to return headers based on the message
    const getHeadersBasedOnMessage = (message) => {
      if (message === "Employees") {
        return employeeheaders;
      } else if (message === "Salary") {
        return salaryheaders;
      } else {
        return addressheaders;
      }
    };

    const headers = getHeadersBasedOnMessage(message);

    // Convert headers to a worksheet
    const ws = XLSX.utils.json_to_sheet(headers, { skipHeader: true });

    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    // Write the Excel file and prompt user to download
    XLSX.writeFile(wb, `${message}_template.xlsx`);
  };

  // Function to upload JSON data to MongoDB
  const handleUploadToDB = async () => {
    if (jsonData) {
      setIsUploading(true);
      try {
        var response;
        if (message === "Employees") {
          response = await service.uploadEmployeesDataToDatabase({
            jsonData,
          });
        } else if (message === "Salary") {
          response = await service.uploadEmpSalaryDetailsToDatabase({
            jsonData,
          });
        } else {
          response = await service.uploadAddressesDetailsToDatabase({
            jsonData,
          });
        } // Service to handle upload
        if (response.status === "success") {
          if (message === "Employees") {
            OnUpdateEmployeeDetails(response.data);
          } else if (message === "Salary") {
            OnUpdateEmpSalaryDetails(response.data);
          } else {
            OnUpdateAddressDetails(response.data);
          }
          toast(utilities.getToastNotification("success", response.message));
        }
      } catch (error) {
        console.error("Error uploading data", error);
      } finally {
        setIsUploading(false);
        onClose();
        setJsonData(null);
        setFile(null);
      }
    } else {
      alert("No data to upload. Please upload an Excel file.");
    }
  };
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Download & Upload Excel File</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
              maxWidth: "500px",
              margin: "0 auto",
              mt: 4,
            }}
          >
            {/* Download Template Button */}
            <Button
              mb={4}
              onClick={handleDownloadTemplate}
              startIcon={<FaFileDownload />}
            >
              Download Excel Template
            </Button>

            {/* Upload File Input */}
            <Button
              variant="contained"
              component="label"
              startIcon={<MdCloudUpload />}
            >
              Upload File
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileUpload}
                hidden
              />
            </Button>
            {file && (
              <Text mb={4}>
                File uploaded: {file.name} (
                {jsonData ? "Data parsed" : "Parsing data..."})
              </Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleUploadToDB}
              isLoading={isUploading}
              isDisabled={!jsonData}
            >
              Upload
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onClose();
                setJsonData(null);
                setFile(null);
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default TemplateModal;
