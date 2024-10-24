import React, { useState, useEffect } from "react";
import { Image, Box, FormControl } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import proxy from "../../services/proxy";
import services from "../../services/controller";
import utils from "../../services/utils";
import { Avatar } from "@chakra-ui/react";
function Header({ UName }) {
  const navigate = useNavigate();
  const [employeerData, setEmployeerData] = useState([]);
  const [imageDimensions, setImageDimensions] = useState({
    width: 60,
    height: 60,
  });
  useEffect(() => {
    services.GetEmployeerDetails().then((data) => {
      if (data.status === "success") {
        const employeerDetails = data.data[0];
        setEmployeerData(employeerDetails);
        // Store the logo dimensions in localStorage
        localStorage.setItem("logoUrl", JSON.stringify(employeerDetails.logo));
      }
    });
  }, []);
  useEffect(() => {
    // Get dimensions dynamically
    const fetchImageDimensions = async () => {
      try {
        const dimensions = await utils.getImageDimensions(employeerData.logo);
        // Adjust width and height proportionally, if needed
        const maxWidth = 400; // Example max width
        const maxHeight = 70; // Example max height

        let width = dimensions.width;
        let height = dimensions.height;

        // Scaling the image proportionally
        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const ratio = Math.min(widthRatio, heightRatio);

          width = width * ratio;
          height = height * ratio;
        }

        setImageDimensions({ width, height });
      } catch (error) {
        console.error("Error loading image dimensions:", error);
      }
    };

    fetchImageDimensions();
  }, [employeerData.logo]);
  const Logout = async (state) => {
    proxy.clearLocalstorage();
    proxy.deleteCookies();
    navigate("/login");
  };
  return (
    <Box className="navbar" bg="gray.100">
      <Image
        style={{
          width: imageDimensions.width,
          height: imageDimensions.height,
          margin: 5,
        }}
        src={employeerData.logo}
      />
      <FormControl padding="10px"></FormControl>
      {UName !== "" ? (
        <Box className="home-tabs">
          <Menu>
            <MenuButton>
              <Avatar
                className="profile-photo"
                name={UName}
                bg="red.500"
                boxSize="1.9em"
              />
            </MenuButton>

            <MenuList className="profile-list">
              <MenuItem
                className="profile-names"
                variant="outline"
                onClick={() => {
                  Logout(true);
                }}
              >
                LOG OUT
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      ) : (
        <Box className="links">
          <Link to="/register">REGISTER</Link>
          <Link to="/login">LOGIN</Link>
        </Box>
      )}
    </Box>
  );
}

export default Header;
