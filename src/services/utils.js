import moment from "moment";
function formatDate(date) {
  if (date === null || date === "") return "-";
  var mt = new moment(date);
  return mt.format("DD/MM/yyyy");
}
function getEndPoint(contentType) {
  if (contentType) {
    return {
      header_name: "Authorization",
      secret_key: "Bearer %token%",
    };
  }
}
function getUserName() {
  var data = localStorage.getItem("auth");
  if (data == null) {
    return "";
  }
  const obj = JSON.parse(data);
  return { userName: obj.userName, role: obj.role };
}
function getAccessToken() {
  var data = localStorage.getItem("auth");
  if (data == null) {
    return null;
  }
  const obj = JSON.parse(data);
  return obj.accessToken;
}
function getToastNotification(status, message, duration) {
  return {
    description: message,
    status: status,
    duration: duration || 2000,
    isClosable: true,
    position: "top-right",
  };
}
const formatNumber = (value) => {
  // Use Intl.NumberFormat for proper number formatting with commas
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
    value
  );
};
function camelCaseToUpperCaseText(camelCaseStr) {
  // Use a regular expression to find uppercase letters and insert a space before them
  const normalText = camelCaseStr.replace(/([A-Z])/g, " $1");

  // Capitalize the first letter of the resulting string and trim any leading spaces
  return (
    normalText.charAt(0).toUpperCase() + normalText.slice(1).trim()
  ).toUpperCase();
}
function camelCaseToNormalText(camelCaseStr) {
  // Use a regular expression to find uppercase letters and insert a space before them
  const normalText = camelCaseStr.replace(/([A-Z])/g, " $1");

  // Capitalize the first letter of the resulting string and trim any leading spaces
  return normalText.charAt(0).toUpperCase() + normalText.slice(1).trim();
}
const getImageDimensions = (base64String) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64String;
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = (error) => reject(error);
  });
};

export default {
  formatDate,
  getEndPoint,
  getAccessToken,
  getUserName,
  getToastNotification,
  formatNumber,
  camelCaseToUpperCaseText,
  camelCaseToNormalText,
  getImageDimensions,
};
