import utils from "./utils";

function constructEndPoint(source, method) {
  const url = source + method;
  return url;
}
function _authToken(accessToken) {
  if (accessToken != null && accessToken.indexOf("%token%") > 0) {
    var token = utils.getAccessToken();
    if (token != null) {
      accessToken = accessToken.replace("%token%", token);
    } else {
      return null;
    }
  }
  return accessToken;
}
function constructHeaders(contentType) {
  var headers = {};
  if (contentType) {
    headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    var api = utils.getEndPoint(contentType);
    var header = _authToken(api.secret_key);
    if (header != null) {
      headers[api.header_name] = header;
    }
  } else {
    headers = null;
  }

  return headers;
}
function post(source, method, request) {
  return fetch(constructEndPoint(source, method), {
    method: "POST",
    mode: "cors",
    headers: constructHeaders(true),
    credentials: "include",
    body: JSON.stringify(request),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return { isError: true, error: response.message };
    }
  });
}
function get(source, method, request) {
  return fetch(constructEndPoint(source, method), {
    method: "GET",
    mode: "cors",
    headers: constructHeaders(true),
    credentials: "include",
  })
    .then((response) => {
      // Check if response status is 403 or any other error status
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        });
      }
      return response.json(); // Return the JSON data if the response is successful
    })
    .catch((error) => {
      console.error("Error in fetch:", error.message); // Log the error message
      return { isError: true, error: error.message }; // Return error object with details
    });
}

const getCookie = (uName) => {
  var cookieName = uName + "=";
  var ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(cookieName) === 0) {
      return c.substring(cookieName.length, c.length);
    }
  }
  return "";
};
const clearLocalstorage = () => {
  return localStorage.clear();
};
const deleteCookies = () => {
  document.cookie = "accesstoken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  document.cookie = "refreshtoken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

export default {
  post,
  get,
  getCookie,
  clearLocalstorage,
  deleteCookies,
};
