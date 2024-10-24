import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import utils from "../../services/utils";
const styles = StyleSheet.create({
  page: {
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 60,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  section: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row", // Ensures that Income and Deductions are side by side
  },
  EmployeesSection: {
    display: "flex",
    flexDirection: "row", // Ensures that Income and Deductions are side by side
  },
  tableIncomeHeader: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#b2c5d6",
    padding: 5,
    borderLeft: 1,
    borderTop: 1,
    borderRight: 1,
  },
  tableIncomeHeaderColor: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#d9e8f5",
    padding: 5,
    borderLeft: 1,
    borderTop: 1,
    borderRight: 1,
  },
  tableIncomeHeaderMonth: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#b2c5d6",
    padding: 5,
    borderTop: 1,
  },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#b2c5d6",
    padding: 5,
    borderRight: 1,
    borderTop: 1,
  },
  tableHeaderColor: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#d9e8f5",
    padding: 5,
    borderRight: 1,
    borderTop: 1,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 5,
    borderTop: 1,
    borderRight: 1,
    borderLeft: 1,
  },
  tableNetSalaryRow: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#b2c5d6",
    paddingVertical: 5,
    padding: 5,
    borderLeft: 1,
    borderRight: 1,
    borderBottom: 1,
  },
  tableGrossSalaryRow: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 5,
    border: 1,
  },
  tableDeductionsRow: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 5,
    borderTop: 1,
    borderRight: 1,
  },
  tableCellHeader: {
    width: "50%",
    textAlign: "center",
  },
  tableCellRow: {
    width: "25%",
  },
  tableCell: {
    width: "25%",
    marginLeft: 5,
  },
  tableCellRight: {
    width: "36%",
    textAlign: "right",
  },
  tableCellRightRow: {
    width: "35%",
    textAlign: "right",
  },
  tableCellRightDeductions: {
    width: "35%",
    textAlign: "right",
  },
  EmployeeTable: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  EmployeeTableMonth: {
    width: "20%",
    display: "flex",
    flexDirection: "row",
  },
  EmployeeTableHeader: {
    width: "80%",
    textAlign: "center",
  },
  EmployeeTableHeaderNames: {
    width: "80%",
    textAlign: "left",
  },
  EmployeeTableHeader2: {
    width: "30%",
    textAlign: "center",
  },
  ViewEmployeeTableHeader2: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 5,
    borderTop: 1,
    borderRight: 1,
  },
  companyHeading: {
    paddingBottom: 5,
    paddingTop: 5,
    borderLeft: 1,
    borderTop: 1,
    borderRight: 1,
    backgroundColor: "#d9e8f5",
  },
});

const classifyFields = (data) => {
  const incomeKeywords = [
    "basic",
    "allowance",
    "hra",
    "communication",
    "medical",
    "special",
  ];
  const deductionKeywords = [
    "tax",
    "provident",
    "fund",
    "deductions",
    "epf",
    "pf",
  ];

  const incomeItems = [];
  const deductionItems = [];
  let grossSalary, netSalary, totalDeductions;

  Object.entries(data).forEach(([key, value]) => {
    const keyLower = key.toLowerCase();

    // Separate out grossSalary and netSalary
    if (keyLower === "grosssalary") {
      grossSalary = { name: key, value };
    } else if (keyLower === "netsalary") {
      netSalary = { name: key, value };
    } else if (keyLower === "totaldeductions") {
      totalDeductions = { name: key, value };
    }
    // Check if the key matches any income-related keyword
    else if (incomeKeywords.some((keyword) => keyLower.includes(keyword))) {
      incomeItems.push({ name: key, value });
    }
    // Check if the key matches any deduction-related keyword
    else if (deductionKeywords.some((keyword) => keyLower.includes(keyword))) {
      deductionItems.push({ name: key, value });
    }
  });

  return {
    incomeItems,
    deductionItems,
    grossSalary,
    netSalary,
    totalDeductions,
  };
};

const SalarySlip = ({
  EmpDetails,
  EmpSalary,
  CompanyDetails,
  Month,
  Year,
  Dimensions,
}) => {
  // Dynamically classify fields into income and deductions
  const { incomeItems, deductionItems, grossSalary, totalDeductions } =
    classifyFields(EmpSalary);

  // Calculate how many empty rows to add to Deductions to match the Income section
  const emptyIncomeRows = 2;
  const emptyDeductionRows = incomeItems.length + 2 - deductionItems.length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.companyHeading}>
          {/* Use dynamically set image dimensions */}
          <Image
            style={{
              width: Dimensions.width,
              height: Dimensions.height,
              margin: 3,
            }}
            src={CompanyDetails.logo}
          />
          <Text style={[{ marginLeft: 35 }]}>{CompanyDetails.address}</Text>
        </View>
        <View>
          <View style={styles.EmployeeTable}>
            <View style={styles.tableIncomeHeader}>
              <Text style={styles.EmployeeTableHeader}>Salary Slip</Text>
            </View>
            <View style={styles.EmployeeTableMonth}>
              <View style={styles.tableIncomeHeaderMonth}>
                <Text style={styles.EmployeeTableHeaderNames}>Month</Text>
              </View>
              <View style={styles.tableIncomeHeader}>
                <Text style={styles.EmployeeTableHeaderNames}>
                  {Month}-{Year}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.EmployeesSection}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Employee Name</Text>
                <Text style={styles.tableCellRightRow}>
                  {EmpDetails.firstName} {EmpDetails.lastName}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Employee Code</Text>
                <Text style={styles.tableCellRightRow}>
                  {EmpDetails.employeeCode}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Designation</Text>
                <Text style={styles.tableCellRightRow}>
                  {EmpDetails.designation}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>PAN</Text>
                <Text style={styles.tableCellRightRow}>{EmpDetails.pan}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Bank Account Number</Text>
                <Text style={styles.tableCellRightRow}>
                  {EmpDetails.accountNumber}
                </Text>
              </View>
              <View style={styles.tableGrossSalaryRow}>
                <Text style={styles.tableCell}>Bank Name</Text>
                <Text style={styles.tableCellRightRow}>
                  {EmpDetails.bankName.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.table}>
              <View style={styles.tableDeductionsRow}>
                <Text style={styles.tableCell}>Date of Joining</Text>
                <Text style={styles.tableCellRightRow}>
                  {utils.formatDate(EmpDetails.joinDate)}
                </Text>
              </View>
              <View style={styles.tableDeductionsRow}>
                <Text style={styles.tableCell}>Total Working Days</Text>
                <Text style={styles.tableCellRightRow}></Text>
              </View>
              <View style={styles.tableDeductionsRow}>
                <Text style={styles.tableCell}>
                  No of Working Days Attended
                </Text>
                <Text style={styles.tableCellRightRow}></Text>
              </View>
              <View style={styles.tableDeductionsRow}>
                <Text style={styles.tableCell}>Leaves</Text>
                <Text style={styles.tableCellRightRow}></Text>
              </View>
              <View style={styles.tableDeductionsRow}>
                <Text style={styles.tableCell}>Leaves Taken</Text>
                <Text style={styles.tableCellRightRow}></Text>
              </View>
              <View
                style={[
                  styles.tableDeductionsRow,
                  { borderRight: 1, borderBottom: 1 },
                ]}
              >
                <Text style={styles.tableCell}>Balance Leaves</Text>
                <Text style={styles.tableCellRightRow}></Text>
              </View>
            </View>
          </View>
        </View>
        {/* Income and Deductions Section (Side by Side) */}
        <View style={styles.section}>
          {/* Income Section */}
          <View style={styles.table}>
            <View style={styles.tableIncomeHeader}>
              <Text style={styles.tableCellHeader}>Income</Text>
            </View>
            <View style={styles.tableIncomeHeaderColor}>
              <Text style={styles.tableCellRow}>Particulars</Text>
              <Text style={styles.tableCellRight}>Amount</Text>
            </View>
            {incomeItems
              .filter(
                (item) =>
                  item.name !== "grossSalary" && item.name !== "netSalary"
              )
              .map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>
                    {item.name.length <= 3
                      ? item.name.toUpperCase()
                      : utils.camelCaseToNormalText(item.name)}
                  </Text>
                  <Text style={styles.tableCellRightRow}>
                    {utils.formatNumber(item.value) + ".00"}
                  </Text>
                </View>
              ))}
            {Array.from({ length: emptyIncomeRows }).map((_, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={[styles.tableCell, { opacity: 0 }]}>
                  {"someValue"}
                </Text>
                <Text style={[styles.tableCellRight, { opacity: 0 }]}>
                  {"someValue"}
                </Text>
              </View>
            ))}
            <View style={styles.tableGrossSalaryRow}>
              <Text style={styles.tableCell}>Total</Text>
              <Text style={styles.tableCellRightRow}>
                {utils.formatNumber(grossSalary.value) + ".00"}
              </Text>
            </View>
          </View>

          {/* Deductions Section */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCellHeader}>Deductions</Text>
            </View>
            <View style={styles.tableHeaderColor}>
              <Text style={styles.tableCellRow}>Particulars</Text>
              <Text style={styles.tableCellRight}>Amount</Text>
            </View>
            {deductionItems.map((item, index) => (
              <View style={styles.tableDeductionsRow} key={index}>
                <Text style={styles.tableCell}>
                  {item.name.length <= 3
                    ? item.name.toUpperCase()
                    : utils.camelCaseToNormalText(item.name)}
                </Text>
                <Text style={styles.tableCellRightRow}>
                  {utils.formatNumber(item.value) + ".00"}
                </Text>
              </View>
            ))}
            {/* Add empty rows if Deductions are fewer than Income */}
            {Array.from({ length: emptyDeductionRows }).map((_, index) => (
              <View style={styles.tableDeductionsRow} key={index}>
                <Text style={[styles.tableCell, { opacity: 0 }]}>
                  {"someValue"}
                </Text>
                <Text style={[styles.tableCellRightDeductions, { opacity: 0 }]}>
                  {"someValue"}
                </Text>
              </View>
            ))}
            <View
              style={[
                styles.tableDeductionsRow,
                { borderRight: 1, borderBottom: 1 },
              ]}
            >
              <Text style={styles.tableCell}>Total</Text>
              <Text style={styles.tableCellRightRow}>
                {utils.formatNumber(totalDeductions.value) + ".00"}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.tableNetSalaryRow,
            { justifyContent: "space-between" },
          ]}
        >
          <Text style={styles.tableNetSalary}>Net Salary</Text>
          <Text style={styles.tableCellRightRow}>
            {utils.formatNumber(EmpSalary.netSalary) + ".00"}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default SalarySlip;
