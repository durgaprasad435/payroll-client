import React, { useState, useContext, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  Stack,
  InputGroup,
  InputLeftElement,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import service from "../../services/controller";
import "./Employee.css";
import utils from "../../services/utils";
import TemplateModal from "../common/TemplateModal";
import { AuthContext } from "../routes/Routes";
import { IoMdSearch } from "react-icons/io";
const Employee = (props) => {
  const toast = useToast();
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [allemployees, setAllEmployees] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  useLayoutEffect(() => {
    console.log("render");
    service.GetAllEmployees().then((data) => {
      if (data.status === "success") {
        setAllEmployees(data.data);
        console.log(data.data);
      } else {
        console.log("err", data);
      }
    });
  }, []);
  const OnDeleteEmployee = (id) => {
    service.DeleteEmployee({ id: id }).then((data) => {
      if (data.status === "success") {
        setAllEmployees(data.data);
        toast(utils.getToastNotification("success", data.message));
      } else {
        toast(
          utils.getToastNotification(
            "error",
            "You are an unauthorized user to access it"
          )
        );
      }
    });
  };
  const OnUpdateEmployeeDetails = (data) => {
    setAllEmployees(data);
  };
  const OnDeleteAllEmployees = async () => {
    await service.DeleteAllEmployees().then((data) => {
      if (data.status === "success") {
        setAllEmployees(data.data);
        onClose();
      } else {
        console.log("err", data);
        toast(
          utils.getToastNotification(
            "error",
            "You are an unauthorized user to access it"
          )
        );
        onClose();
      }
    });
  };
  const FilterAllEmployees = (employees, term) => {
    var items = employees;
    if (term === null && term !== null) {
      term = searchItem;
    }
    if (term !== null && term !== "") {
      items = employees.filter((x) =>
        x.firstName.toLowerCase().includes(term.toLowerCase())
      );
    }
    return items;
  };
  const addNewEmployeeDetails = () => {
    if (role !== "employee") {
      navigate("/addemployee");
    } else {
      toast(
        utils.getToastNotification(
          "error",
          "You are an unauthorized user to add new employee"
        )
      );
    }
  };
  const OnEdit = (employee) => {
    if (role !== "employee") {
      props.EmployeeDetails(employee);
      navigate("/edit/" + `${employee.id}`);
    } else {
      toast(
        utils.getToastNotification(
          "error",
          "You are an unauthorized user to access it"
        )
      );
    }
  };
  return (
    <Box className="emp-page">
      <Box>
        <Box className="flex justify-between items-center mx-5">
          {/* Left-aligned search tab */}
          <div className="flex-1 mr-5">
            {allemployees.length >= 1 ? (
              <Stack>
                <Box className="w-[21vw]">
                  <InputGroup size="md">
                    <InputLeftElement pointerEvents="none">
                      <IoMdSearch color="gray.300" size="25px" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search by Employee Name"
                      value={searchItem}
                      onChange={(e) => setSearchItem(e.target.value)}
                    />
                  </InputGroup>
                </Box>
              </Stack>
            ) : null}
          </div>

          {/* Right-aligned buttons */}
          <div className="flex items-center space-x-3">
            {allemployees.length >= 1 && (
              <Button
                variant="contained"
                onClick={onOpen}
                className={allemployees.length < 1 ? "hide-block" : ""}
              >
                Delete All
              </Button>
            )}
            <Button variant="contained" onClick={addNewEmployeeDetails}>
              Add New
            </Button>
            <Button
              variant="contained"
              colorScheme="purple"
              className="ml-5"
              onClick={() => {
                setShowTemplateModal(true);
                onOpen();
              }}
            >
              Import From Excel
            </Button>
          </div>
        </Box>

        <Box className="employees-cont">
          <Box className={allemployees.length < 1 ? "hide-block" : ""}>
            {FilterAllEmployees(allemployees, searchItem).map(
              (employee, index) => {
                return (
                  <Accordion allowMultiple>
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            <FormControl>
                              <FormHelperText>
                                Employee Name :{" "}
                                {employee.firstName + " " + employee.lastName}
                              </FormHelperText>
                              <FormHelperText>
                                Designation : {employee.designation}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                          <Box as="span" flex="1" textAlign="right">
                            <IconButton
                              variant="transprent"
                              icon={<DeleteIcon color="#d22828" />}
                              onClick={() => {
                                OnDeleteEmployee(employee.id);
                              }}
                            ></IconButton>
                            <IconButton
                              onClick={() => {
                                OnEdit(employee);
                              }}
                              variant="transprent"
                              icon={<EditIcon />}
                            ></IconButton>
                            <Box>
                              {/* <FormControl>
                                  {employee.modifiedDate != undefined ? (
                                    <FormHelperText>
                                      Modified Date :{" "}
                                      {utils.formatDate(employee.modifiedDate)}
                                    </FormHelperText>
                                  ) : (
                                    <></>
                                  )}
                                </FormControl> */}
                            </Box>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4} textAlign="left">
                        <FormControl className="emp-details">
                          <FormHelperText>
                            Gender : {employee.gender}
                          </FormHelperText>
                          <FormHelperText>
                            DOB : {utils.formatDate(employee.dateOfBirth)}
                          </FormHelperText>
                          <FormHelperText>
                            Joining Date : {utils.formatDate(employee.joinDate)}
                          </FormHelperText>
                          <FormHelperText>PAN : {employee.pan}</FormHelperText>
                          <FormHelperText>
                            Aadhar : {employee.aadhar}
                          </FormHelperText>
                          <FormHelperText>UAN : {employee.uan}</FormHelperText>
                          <FormHelperText>
                            PF No : {employee.pfNo}
                          </FormHelperText>
                        </FormControl>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                );
              }
            )}
          </Box>
        </Box>
      </Box>
      {showTemplateModal ? (
        <Box>
          <TemplateModal
            message="Employees"
            isOpen={isOpen}
            onClose={onClose}
            OnUpdateEmployeeDetails={OnUpdateEmployeeDetails}
          />
        </Box>
      ) : (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Alert !</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure want to delete all the employees details ?
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant="ghost" onClick={OnDeleteAllEmployees}>
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default Employee;
