import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import {
  Box,
  Input,
  Button,
  Select,
  useToast,
  Heading,
} from "@chakra-ui/react";
import "./AddEmployee.css";
import services from "../../services/controller";
import utils from "../../services/utils";
function AddEmployee(props) {
  var employeeDetails = null;
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [gender, setGender] = useState("");
  const [exitingDetails, setExistingDetails] = useState({});
  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    mobileNumber: 0,
    email: "",
    employeeId: "",
    designation: "",
    employeeCode: "",
    joinDate: "",
    pan: "",
    aadhar: 0,
    accountNumber: 0,
    bankName: "",
    ifscCode: "",
    uan: 0,
    pfNo: "",
  });
  const toast = useToast();
  const handleChange = (e) => {
    if (isEdit) {
      //console.log("render");
      setExistingDetails({
        ...exitingDetails,
        [e.target.name]: e.target.value,
      });
    } else {
      setDetails({ ...details, [e.target.name]: e.target.value });
    }
  };
  const handleSelect = (e) => {
    setGender(e.target.value);
    details.gender = e.target.value;
  };
  const OnSubmit = () => {
    if (isEdit) {
      employeeDetails = exitingDetails;
      employeeDetails.gender = gender;
      employeeDetails.dateOfBirth =
        details.dateOfBirth || employeeDetails.dateOfBirth;
      employeeDetails.joinDate = details.joinDate || employeeDetails.joinDate;
    } else {
      employeeDetails = details;
    }
    console.log("employeeDetails", employeeDetails);
    services.AddEmployee(employeeDetails).then((data) => {
      if (data.status === "success") {
        console.log("Employee details added successfully");
        toast(
          utils.getToastNotification(
            "success",
            isEdit
              ? "Employee details updated successfully"
              : "Employee details added successfully"
          )
        );
        navigate("/employees");
      } else {
        toast(
          utils.getToastNotification(
            "error",
            "Failed while adding employee details"
          )
        );
      }
    });
  };
  useEffect(() => {
    if (props.Details !== null) {
      setIsEdit(true);
      setExistingDetails(props.Details);
      console.log(props.Details);
    }
  }, []);
  return (
    <Box className="mx-5 my-5">
      <Heading as="h4" size="md">
        Basic Details
      </Heading>
      <FormControl className="add-employee mt-5" isRequired>
        <Box>
          <FormLabel>First Name :</FormLabel>
          <Input
            name="firstName"
            onChange={handleChange}
            autocomplete="off"
            value={
              details.firstName !== ""
                ? details.firstName
                : exitingDetails.firstName
            }
            aria-required={true}
          />
        </Box>
        <Box>
          <FormLabel>Last Name :</FormLabel>
          <Input
            name="lastName"
            onChange={handleChange}
            autocomplete="off"
            value={
              details.lastName !== ""
                ? details.lastName
                : exitingDetails.lastName
            }
            aria-required={true}
          />
        </Box>
        <Box>
          <FormLabel>Gender :</FormLabel>
          <Select
            placeholder="Select gender"
            onChange={handleSelect}
            value={
              details.gender !== "" ? details.gender : exitingDetails.gender
            }
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
        </Box>
        <Box>
          <FormLabel>Date of Birth :</FormLabel>
          <DatePicker
            showIcon
            className="date-picker"
            selected={
              details.dateOfBirth !== ""
                ? details.dateOfBirth
                : exitingDetails.dateOfBirth
            }
            dateFormat="dd/MM/yyyy"
            onChange={(date) =>
              setDetails({
                ...details,
                ["dateOfBirth"]: utils.formatDate(date),
              })
            }
          />
        </Box>
        <Box>
          <FormLabel>Mobile Number :</FormLabel>
          <Input
            name="mobileNumber"
            onChange={handleChange}
            autocomplete="off"
            value={
              details.mobileNumber !== ""
                ? details.mobileNumber
                : exitingDetails.mobileNumber
            }
            aria-required={true}
          />
        </Box>
        <Box>
          <FormLabel>E-Mail :</FormLabel>
          <Input
            name="email"
            onChange={handleChange}
            autocomplete="off"
            value={details.email !== "" ? details.email : exitingDetails.email}
            aria-required={true}
          />
        </Box>
        <Box>
          <FormLabel>Employee Id :</FormLabel>
          <Input
            name="employeeId"
            onChange={handleChange}
            autocomplete="off"
            value={
              details.employeeId !== ""
                ? details.employeeId
                : exitingDetails.employeeId
            }
            aria-required={true}
          />
        </Box>
        <Box>
          <FormLabel>Designation :</FormLabel>
          <Input
            name="designation"
            onChange={handleChange}
            autocomplete="off"
            value={
              details.designation !== ""
                ? details.designation
                : exitingDetails.designation
            }
            aria-required={true}
          />
        </Box>
        <Box>
          <FormLabel>Employee Code :</FormLabel>
          <Input
            name="employeeCode"
            onChange={handleChange}
            autocomplete="off"
            value={
              details.employeeCode !== ""
                ? details.employeeCode
                : exitingDetails.employeeCode
            }
            aria-required={true}
          />
        </Box>
        <Box>
          <FormLabel>Join Date :</FormLabel>
          <DatePicker
            showIcon
            className="date-picker"
            selected={
              details.joinDate !== ""
                ? details.joinDate
                : exitingDetails.joinDate
            }
            placeholder="DD/MM/YYYY"
            dateFormat="dd/MM/yyyy"
            onChange={(date) => setDetails({ ...details, ["joinDate"]: date })}
          />
        </Box>

        {/* <Box>
          <FormLabel>Exit Date :</FormLabel>
          <DatePicker
            showIcon
            className="date-picker"
            selected={
              details.exitDate !== ""
                ? details.exitDate
                : exitingDetails.exitDate
            }
            placeholder="DD/MM/YYYY"
            onChange={(date) => setDetails({ ...details, ["exitDate"]: date })}
          />
        </Box> */}
        <Box>
          <FormLabel>PAN :</FormLabel>
          <Input
            name="pan"
            onChange={handleChange}
            autocomplete="off"
            value={details.pan !== "" ? details.pan : exitingDetails.pan}
            aria-required={true}
          />
        </Box>

        <Box>
          <FormLabel>Aadhar :</FormLabel>
          <Input
            name="aadhar"
            onChange={handleChange}
            autocomplete="off"
            value={
              details.aadhar !== "" ? details.aadhar : exitingDetails.aadhar
            }
            aria-required={true}
          />
        </Box>
      </FormControl>
      <Heading as="h4" size="md" className="mt-5">
        Bank Details
      </Heading>
      <FormControl className="add-employee mt-5" isRequired>
        <Box>
          <FormLabel>Account Number :</FormLabel>
          <Input
            name="accountNumber"
            onChange={handleChange}
            autocomplete="off"
            value={
              details.accountNumber !== ""
                ? details.accountNumber
                : exitingDetails.accountNumber
            }
            aria-required={true}
          />
        </Box>
        <Box>
          <FormLabel>Bank Name :</FormLabel>
          <Input
            name="bankName"
            onChange={handleChange}
            autocomplete="off"
            value={
              details.bankName !== ""
                ? details.bankName
                : exitingDetails.bankName
            }
            aria-required={true}
          />
        </Box>
        <Box>
          <FormLabel>IFSC Code :</FormLabel>
          <Input
            name="ifscCode"
            onChange={handleChange}
            autocomplete="off"
            value={
              details.ifscCode !== ""
                ? details.ifscCode
                : exitingDetails.ifscCode
            }
            aria-required={true}
          />
        </Box>
      </FormControl>
      <Heading as="h4" size="md" className="mt-5">
        PF Details
      </Heading>
      <FormControl className="grid-cols-3 grid gap-4 mt-5" isRequired>
        <Box>
          <FormLabel>UAN :</FormLabel>
          <Input
            name="uan"
            onChange={handleChange}
            autocomplete="off"
            value={details.uan !== "" ? details.uan : exitingDetails.uan}
            aria-required={true}
          />
        </Box>
        <Box>
          <FormLabel>PF No :</FormLabel>
          <Input
            name="pfNo"
            onChange={handleChange}
            autocomplete="off"
            value={details.pfNo !== "" ? details.pfNo : exitingDetails.pfNo}
            aria-required={true}
          />
        </Box>
        <Box className="mx-2 mt-8 flex justify-end">
          <Button
            variant="contained"
            onClick={() => {
              navigate("/employees");
            }}
          >
            Back
          </Button>
          <Button colorScheme="blue" marginLeft="15px" onClick={OnSubmit}>
            {isEdit ? "Update" : "Submit"}
          </Button>
        </Box>
      </FormControl>
    </Box>
  );
}

export default AddEmployee;
