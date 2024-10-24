import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import "./pages.css";
import {
  Card,
  CardBody,
  Stack,
  Text,
  Button,
  Box,
  Flex,
} from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  useToast,
} from "@chakra-ui/react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import services from "../../services/controller";
import utils from "../../services/utils";
function Login(props) {
  const toast = useToast();
  let errorsObject = {
    UserNameMessage: "",
    PasswordMessage: "",
  };
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(errorsObject);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isUNameError, setIsUNameError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleUserName = (e) => {
    setUserName(e.target.value);
    if (userName !== "") {
      setIsUNameError(false);
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
      Password: password,
    };
    if (userName === "") {
      setErrorMessage((prev) => {
        return { ...prev, UserNameMessage: "User Name is required" };
      });

      setIsUNameError(true);
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
    if (password.length >= 8 && userName !== "") {
      await services.loginService(userDetails).then((data) => {
        if (data.status === "success") {
          localStorage.setItem(
            "auth",
            JSON.stringify({
              isAuth: true,
              userName: data.UserName,
              accessToken: data.accessToken,
              role: data.role,
            })
          );
          props.getUsername(data.UserName, data.role);
          toast(utils.getToastNotification("success", data.message));
          navigate("/");
        } else {
          console.log(data);
          toast(
            utils.getToastNotification(
              "error",
              "Username and password are incorrect"
            )
          );
        }
      });
    }
  };
  return (
    <Box className="card-container">
      <Card>
        <Stack className="card-body">
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
            <FormControl variant="floating" isInvalid={isPasswordError}>
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

            <Flex direction="column" className="mt-5">
              <Button
                className="register-btn"
                variant="solid"
                width="30%"
                colorScheme="purple"
                onClick={OnSubmit}
              >
                Login
              </Button>
              <Text marginTop="5px">
                If you are not yet registred ? Please click on{" "}
                <span>
                  <a className="login-link" href="/register">
                    register
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

export default Login;
