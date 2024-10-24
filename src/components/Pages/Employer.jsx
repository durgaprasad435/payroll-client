import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import service from "../../services/controller";
import "./Employer.css";
function EmployerDetails() {
  const initialFormState = {
    employerName: "",
    companyName: "",
    officeAddress: "",
    numberOfEmployees: "",
    companyUrl: "",
    companyLogo: "", // This will hold the base64 string of the image
    employerEmail: "",
  };

  const [formValues, setFormValues] = useState(initialFormState);
  const navigate = useNavigate();
  const [imageError, setImageError] = useState("");
  const [imageSuccess, setImageSuccess] = useState("");

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle image upload and convert to base64 string
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
      ];

      // Check for valid image type
      if (!validImageTypes.includes(file.type)) {
        setImageError("Please upload a valid image file (jpg, png, gif).");
        setImageSuccess("");
        return;
      }
      setImageError("");

      // Convert to base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormValues((prevValues) => ({
          ...prevValues,
          companyLogo: reader.result, // base64 string
        }));
        setImageSuccess("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create the object with form values
    const formData = {
      employerName: formValues.employerName,
      companyName: formValues.companyName,
      officeAddress: formValues.officeAddress,
      numberOfEmployees: formValues.numberOfEmployees,
      companyUrl: formValues.companyUrl,
      companyLogo: formValues.companyLogo, // base64 image string
      employeerEmail: formValues.employerEmail,
    };
    console.log("Form Data:", formData);
    service.AddEmployeerDetails(formData).then((data) => {
      if (data.status === "success") {
        console.log(data);
        navigate("/login");
        // Clear the form after submission
        setFormValues(initialFormState);
        setImageSuccess(""); // Clear the success message after submission
        setImageError(""); // Clear any error messages after submission
      } else {
        console.error("Logo size is too large");
        setImageError("Logo size is too large");
      }
    });
  };

  return (
    <Box className="flex justify-center items-center card-container">
      <Card>
        <CardContent>
          <Box
            className="flex flex-col gap-2 w-[500px]"
            component="form"
            onSubmit={handleSubmit}
          >
            <TextField
              label="Employer Name"
              name="employerName"
              value={formValues.employerName}
              onChange={handleInputChange}
              size="small"
              required
            />
            <TextField
              label="Employer Email"
              name="employerEmail"
              value={formValues.employerEmail}
              onChange={handleInputChange}
              size="small"
              required
            />
            <TextField
              label="Company Name"
              name="companyName"
              value={formValues.companyName}
              onChange={handleInputChange}
              size="small"
              required
            />
            <TextField
              label="Office Address"
              name="officeAddress"
              value={formValues.officeAddress}
              onChange={handleInputChange}
              size="small"
              required
            />
            <TextField
              label="Number of Employees"
              name="numberOfEmployees"
              type="number"
              value={formValues.numberOfEmployees}
              onChange={handleInputChange}
              size="small"
              required
            />
            <TextField
              label="Company URL"
              name="companyUrl"
              value={formValues.companyUrl}
              onChange={handleInputChange}
              type="url"
              size="small"
              required
            />
            <Button variant="contained" component="label">
              Upload Company Logo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </Button>
            {imageError && <Typography color="error">{imageError}</Typography>}
            {imageSuccess && (
              <Typography color="primary">{imageSuccess}</Typography>
            )}{" "}
            {/* Show success message */}
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default EmployerDetails;
