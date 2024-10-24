import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import "./index.css";
const muiTheme = createTheme({
  // Your MUI theme settings
  shadows: [
    "none",
    "0px 1px 3px rgba(0,0,0,0.2), 0px 1px 1px rgba(0,0,0,0.14), 0px 2px 1px rgba(0,0,0,0.12)",
    // Add additional shadow levels as necessary
  ],
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MuiThemeProvider theme={muiTheme}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </MuiThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
