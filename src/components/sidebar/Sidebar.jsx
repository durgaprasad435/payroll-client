import React, { useState, useContext } from "react";
import { AuthContext } from "../routes/Routes";
import { Box, List, ListItem, Flex, Icon, Text } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillAlt,
  FaRupeeSign,
} from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
  const [activeTab, setActiveTab] = useState(0);
  const location = useLocation();
  const { role } = useContext(AuthContext); // Assuming role comes from AuthContext

  // Menu items with associated roles
  const menuItems = [
    {
      id: 0,
      label: "Dashboard",
      path: "/",
      icon: FaHome,
      roles: ["admin", "employee", "manager"],
    },
    {
      id: 1,
      label: "Employees",
      path: "/employees",
      icon: FaUser,
      roles: ["admin","employee", "manager"],
    },
    {
      id: 2,
      label: "Addresses",
      path: "/addresses",
      icon: FaMapMarkerAlt,
      roles: ["admin", "employee", "manager"],
    },
    {
      id: 3,
      label: "Leaves",
      path: "/leaves",
      icon: FaCalendarAlt,
      roles: ["admin", "employee", "manager"],
    },
    {
      id: 4,
      label: "Salaries",
      path: "/salaries",
      icon: FaMoneyBillAlt,
      roles: ["admin", "manager"],
    },
    {
      id: 5,
      label: "Payroll",
      path: "/payroll",
      icon: FaRupeeSign,
      roles: ["admin"],
    },
  ];

  const OnTab = (id) => {
    setActiveTab(id);
  };

  // Filter menu items based on the user's role
  const visibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <Box p="4" bg="gray.100" minH="88.5vh" w="100%">
      <List spacing={4} mt={5}>
        {visibleMenuItems.map((item) => (
          <ListItem key={item.id}>
            <Link to={item.path} onClick={() => OnTab(item.id)}>
              <Flex
                align="center"
                p="2"
                borderRadius="md"
                bg={
                  location.pathname === item.path ? "blue.600" : "transparent"
                }
                color={location.pathname === item.path ? "white" : "gray.600"}
                _hover={{
                  bg: "blue.500",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <Icon as={item.icon} boxSize={4} mr="4" />
                <Text fontSize="md" className="font-semibold">
                  {item.label}
                </Text>
              </Flex>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Sidebar;
