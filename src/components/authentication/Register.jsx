import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./pages.css";
import {
  Card,
  CardBody,
  Stack,
  Text,
  Button,
  Box,
  Flex,
  HStack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import services from "../../services/controller";
function Register() {
  let errorsObject = {
    UserNameMessage: "",
    EmailMessage: "",
    PasswordMessage: "",
  };
  const [userName, setUserName] = useState("");
  const [eMail, setEMail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [errorMessage, setErrorMessage] = useState(errorsObject);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isUNameError, setIsUNameError] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleUserName = (e) => {
    setUserName(e.target.value);
    if (userName !== "") {
      setIsUNameError(false);
    }
  };
  const handleEMail = (e) => {
    setEMail(e.target.value);
    if (eMail !== "") {
      setIsEmailError(false);
    }
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    if (password.length > 7) {
      setIsPasswordError(false);
    }
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const OnSubmit = async () => {
    var userDetails = {
      UserName: userName,
      EMail: eMail,
      Password: password,
      Role: role, // Add role to user details
    };

    if (userName === "") {
      setErrorMessage((prev) => {
        return { ...prev, UserNameMessage: "User Name is required" };
      });
      setIsUNameError(true);
    }

    if (eMail === "") {
      setErrorMessage((prev) => {
        return { ...prev, EmailMessage: "E-Mail is required" };
      });
      setIsEmailError(true);
    }

    if (password.length < 8) {
      setErrorMessage((prev) => {
        return {
          ...prev,
          PasswordMessage: "Password should be more than 8 characters",
        };
      });
      setIsPasswordError(true);
    }

    if (userName && eMail !== "" && password.length >= 8) {
      await services.registerService(userDetails).then((data) => {
        if (data.status === "success") {
          if (data.role === "admin") {
            navigate("/addemployer");
          } else {
            navigate("/login");
          }
        }
      });
    }
  };
  return (
    <Box className="card-container">
      <Card className="card-body">
        <Stack>
          <CardBody>
            <FormControl variant="floating" isInvalid={isUNameError}>
              <TextField
                fullWidth
                label="User Name"
                variant="standard"
                margin="normal"
                type="text"
                size="small"
                onChange={handleUserName}
                required
              />
              {!isUNameError ? (
                <FormHelperText />
              ) : (
                <FormErrorMessage>
                  {errorMessage.UserNameMessage}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={isEmailError}>
              <TextField
                fullWidth
                label="Email"
                variant="standard"
                margin="normal"
                type="email"
                size="small"
                onChange={handleEMail}
                required
              />
              {!isEmailError ? (
                <FormHelperText />
              ) : (
                <FormErrorMessage>{errorMessage.EmailMessage}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={isPasswordError}>
              <TextField
                fullWidth
                label="Password"
                variant="standard"
                margin="normal"
                type={showPassword ? "text" : "password"}
                required
                onChange={handlePassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {!isPasswordError ? (
                <FormHelperText />
              ) : (
                <FormErrorMessage>
                  {errorMessage.PasswordMessage}
                </FormErrorMessage>
              )}
            </FormControl>
            {/* Add Radio Button Group for role selection */}
            <FormControl>
              <RadioGroup onChange={setRole} value={role}>
                <HStack spacing="24px">
                  <Radio value="admin">Admin</Radio>
                  <Radio value="employee">Employee</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
            <Flex direction="column" className="mt-5">
              <Button
                className="register-btn"
                variant="solid"
                width="30%"
                colorScheme="green"
                onClick={OnSubmit}
              >
                Register
              </Button>

              <Text marginTop="5px">
                If you already registred.Please click on{" "}
                <span>
                  <a className="login-link" href="/login">
                    login
                  </a>
                </span>
              </Text>
            </Flex>
          </CardBody>
        </Stack>
      </Card>
    </Box>
  );
}

export default Register;
