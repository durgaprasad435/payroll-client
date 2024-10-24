import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Text,
  Box,
  Card,
  CardBody,
} from "@chakra-ui/react";
import service from "../../services/controller";
import utils from "../../services/utils";
// Helper function to get the last day of the month
const getLastDayOfMonth = () => {
  const date = new Date();
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return lastDay.toLocaleDateString("en-GB"); // 'en-GB' formats as dd/mm/yyyy
};

function Dashboard() {
  const navigate = useNavigate();

  const [activeMonth, setActiveMonth] = useState("");
  const [activeYear, setActiveYear] = useState("");
  const [employees, setEmployees] = useState([]); // Example number of employees
  const [paymentDate, setPaymentDate] = useState(getLastDayOfMonth());
  const [salaryDetails, setSalaryDetails] = useState([]);
  const [totalGrossSalaries, setTotalGrossSalaries] = useState(0);

  useEffect(() => {
    const currentDate = new Date();
    setActiveMonth(currentDate.toLocaleString("default", { month: "long" }));
    setActiveYear(currentDate.getFullYear());

    // Fetch employee data
    service.GetAllEmployees().then((data) => {
      if (data.status === "success") {
        setEmployees(data.data);
      }
    });
    const isAuth =
      JSON.parse(localStorage.getItem("auth"))?.isAuth || undefined;
    if (!isAuth) {
      navigate("/login");
    }
    // Fetch salary details
    service.getEmployeesSalaryDetails().then((data) => {
      if (data.status === "success") {
        const salariesOfEmployees = data.data;

        // Construct the salary structure from the fetched data
        const updatedSalaryStructure = salariesOfEmployees.map((item) => {
          return {
            employeeId: item.employeeId,
            Net_Salary: item.netSalary,
            Total_Deductions: item.totalDeductions,
          };
        });
        // Using reduce to calculate the total gross salaries
        const totalGrossSalaries = salariesOfEmployees.reduce((acc, item) => {
          return acc + item.grossSalary;
        }, 0);

        setTotalGrossSalaries(utils.formatNumber(totalGrossSalaries));

        setSalaryDetails(updatedSalaryStructure);
      }
    });
  }, []);

  return (
    <Box>
      {/* Top Section */}
      <Box className="grid grid-cols-4 gap-6 px-8 pt-[50px]">
        <Card>
          <CardBody className="text-center">
            <Text
              fontSize="lg"
              fontWeight="bold"
              className="text-center mb-5 text-gray-600"
            >
              Active Employees
            </Text>
            <Text>{employees.length}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <Text
              fontSize="lg"
              fontWeight="bold"
              className="text-center mb-5 text-gray-600"
            >
              Total Gross Salaries
            </Text>
            <Text>₹ {totalGrossSalaries}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <Text
              fontSize="lg"
              fontWeight="bold"
              className="text-center mb-5  text-gray-600"
            >
              Active Month & Year
            </Text>
            <Text>{`${activeMonth}, ${activeYear}`}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <Text
              fontSize="lg"
              fontWeight="bold"
              className="text-center mb-5  text-gray-600"
            >
              Payment Date
            </Text>
            <Text>{paymentDate}</Text>
          </CardBody>
        </Card>
      </Box>

      {/* Pie Charts Section */}
      <Box className="grid grid-cols-1 gap-6 px-7 pt-[40px]">
        {/* <Card>
          <CardBody>
            <Text
              fontSize="lg"
              fontWeight="bold"
              className="text-center mb-3 text-gray-600"
            >
              Total Deductions
            </Text>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={totalDeductionsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  fill="#8884d8"
                >
                  {totalDeductionsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card> */}

        <Card>
          <CardBody>
            <Text
              fontSize="lg"
              fontWeight="bold"
              className="text-center mb-3 text-gray-600"
            >
              Gross Salaries of Employees
            </Text>

            <BarChart
              width={1200}
              height={300}
              data={salaryDetails}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="employeeId" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Net_Salary" stackId="a" fill="#8884d8" />
              <Bar dataKey="Total_Deductions" stackId="a" fill="#82ca9d" />
            </BarChart>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default Dashboard;
