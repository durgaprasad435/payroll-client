import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import {
  Box,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { HiViewList } from "react-icons/hi";
import { TiArrowBack } from "react-icons/ti";
import { IoMdSearch } from "react-icons/io";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import service from "../../services/controller";
import utils from "../../services/utils";
import RiseLoader from "react-spinners/RiseLoader";
import TemplateModal from "../common/TemplateModal";
const Addresses = () => {
  const addressFields = {
    addressType: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  };
  // Define the state for the form fields
  const [address, setAddress] = useState(addressFields);
  const [activeEmployee, setActiveEmployee] = useState([]);
  const [allemployees, setAllEmployees] = useState([]);
  const [allAddresses, setAllAddress] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [isDisable, setIsDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const rowsPerPage = 5; // Rows to display per page
  const toast = useToast();
  useEffect(() => {
    setIsLoading(true);
    service.getAllEmpAddresses().then((data) => {
      if (data.status === "success") {

        setAllAddress(data.data);
      }
    });
    service.GetAllEmployees().then((data) => {
      if (data.status === "success") {
        var result = data.data;
        setAllEmployees(result);
        setIsLoading(false);
      } else {
        console.error("err", data);
      }
    });
  }, []);
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
  const OnUpdateAddressDetails = (data) => {
    setAllAddress(data);
  };
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value,
    });
  };
  const handleEmployeeAddress = async (empId) => {
    var activeField = await allemployees.find(
      (employee) => employee.employeeId === empId
    );
    var activeAddress = await allAddresses.find(
      (add) => add.employeeId === empId
    );
    if (activeAddress === undefined) {
      setAddress(addressFields);
    } else {
      setAddress(activeAddress);
    }
    setIsDisable(true);
    setActiveEmployee([activeField]);
  };
  const handleUploadAddresses = async () => {
    setIsLoading(true);
    const { employeeId } = activeEmployee[0];
    address.employeeId = employeeId;
    await service.addAddresses(address).then((data) => {
      if (data.status === "success") {
        toast(utils.getToastNotification("success", data.message));
        setIsLoading(false);
        setAllAddress(data.data);
        setIsDisable(!isDisable);
        setAddress(addressFields);
      }
    });
  };
  const getButtonLabel = (empId) => {
    const empAddress = allAddresses.find((add) => add.employeeId === empId);
    return empAddress && empAddress.addressType !== ""
      ? "View Address"
      : "Add Address";
  };
  return (
    <Box>
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
                onOpen();
                setShowTemplateModal(true);
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
                            handleEmployeeAddress(item.employeeId);
                          }}
                          startIcon={
                            label === "Add Address" ? <MdAdd /> : <HiViewList />
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
          {showTemplateModal ? (
            <Box>
              <TemplateModal
                message="Addresses"
                isOpen={isOpen}
                onClose={onClose}
                OnUpdateAddressDetails={OnUpdateAddressDetails}
              />
            </Box>
          ) : null}
        </Box>
      ) : (
        <Box className="mx-7 my-[80px]">
          {/* <Heading size="md" className="mb-8 text-gray-500">
              {activeEmployee[0]?.firstname} {activeEmployee[0]?.lastname}{" "}
              Salary Structure
            </Heading> */}
          <form className="grid grid-cols-3 gap-4 p-4">
            <TextField
              label="Address Type"
              name="addressType"
              value={address.addressType}
              onChange={handleChange}
              size="small"
            />
            <TextField
              label="Address Line 1"
              name="addressLine1"
              value={address.addressLine1}
              onChange={handleChange}
              size="small"
            />
            <TextField
              label="Address Line 2"
              name="addressLine2"
              value={address.addressLine2}
              onChange={handleChange}
              size="small"
            />
            <TextField
              label="Address Line 3"
              name="addressLine3"
              value={address.addressLine3}
              onChange={handleChange}
              size="small"
            />
            <TextField
              label="City"
              name="city"
              value={address.city}
              onChange={handleChange}
              size="small"
            />
            <TextField
              label="State"
              name="state"
              value={address.state}
              onChange={handleChange}
              size="small"
            />
            <TextField
              label="Country"
              name="country"
              value={address.country}
              onChange={handleChange}
              size="small"
            />
            <TextField
              label="ZIP Code"
              name="zipCode"
              type="number"
              value={address.zipCode}
              onChange={handleChange}
              size="small"
            />
          </form>
          <Box className="float-right">
            <Button
              variant="contained"
              style={{ margin: "20px 0px" }}
              startIcon={<TiArrowBack />}
              onClick={() => {
                setIsDisable(!isDisable);
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              style={{ margin: "20px 17px" }}
              startIcon={<FiUpload />}
              onClick={handleUploadAddresses}
            >
              Upload
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Addresses;
