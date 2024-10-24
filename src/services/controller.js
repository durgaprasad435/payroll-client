import proxy from "./proxy";
const server_uri = "http://localhost:9000/api/payroll";
function GetAllEmployees() {
  return proxy.get(server_uri, "/allemployes");
}
function DeleteEmployee(reqbody) {
  return proxy.post(server_uri, "/deleteemployee", reqbody);
}
function DeleteAllEmployees(reqbody) {
  return proxy.get(server_uri, "/delallemployees");
}
function AddEmployee(reqbody) {
  return proxy.post(server_uri, "/addemployee", reqbody);
}
function AddEmployeerDetails(reqbody) {
  return proxy.post(server_uri, "/addemployeer", reqbody);
}
function GetEmployeerDetails() {
  return proxy.get(server_uri, "/employeerdata");
}
function registerService(reqbody) {
  return proxy.post(server_uri, "/register", reqbody);
}
function loginService(reqbody) {
  return proxy.post(server_uri, "/login", reqbody);
}
function postSalaryDetails(reqbody) {
  return proxy.post(server_uri, "/addsalary", reqbody);
}
function getSalaryDetailsByEmpId(reqbody) {
  return proxy.post(server_uri, "/getemployeesalarybyid", reqbody);
}
function getEmployeesSalaryDetails() {
  return proxy.get(server_uri, "/allempsalaries");
}
function addAddresses(reqbody) {
  return proxy.post(server_uri, "/addaddress", reqbody);
}
function getAllEmpAddresses() {
  return proxy.get(server_uri, "/allempaddresses");
}
function uploadEmployeesDataToDatabase(reqbody) {
  return proxy.post(server_uri, "/bulkempdata", reqbody);
}
function uploadEmpSalaryDetailsToDatabase(reqbody) {
  return proxy.post(server_uri, "/bulksalariesdata", reqbody);
}
function uploadAddressesDetailsToDatabase(reqbody) {
  return proxy.post(server_uri, "/bulkaddressesdata", reqbody);
}
function updateSalaryStatusForAll(reqbody) {
  return proxy.post(server_uri, "/updateStatusForAll", reqbody);
}
export default {
  GetAllEmployees,
  DeleteEmployee,
  DeleteAllEmployees,
  AddEmployee,
  AddEmployeerDetails,
  GetEmployeerDetails,
  registerService,
  loginService,
  postSalaryDetails,
  getSalaryDetailsByEmpId,
  getEmployeesSalaryDetails,
  addAddresses,
  getAllEmpAddresses,
  uploadEmployeesDataToDatabase,
  uploadEmpSalaryDetailsToDatabase,
  uploadAddressesDetailsToDatabase,
  updateSalaryStatusForAll
};
