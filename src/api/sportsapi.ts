const axios = require("axios");

const BACKEND_BASE_URL = "https://opentdb.com/api.php?amount=10&category=21&difficulty=medium&type=multiple";
const API_TIMEOUT = 5000;

const apiCall = async (type, url, param, withToken = false, options = {}) => {
  let opt = {
    timeout: API_TIMEOUT,
    ...options,
  };
  const token = await localStorage.getItem("userToken");
  console.log(`API calling: [${type}]`, url);
  if (withToken) {
    opt["headers"] = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }
  if (type === "get" || type === "delete") {
    return axios[type](`${BACKEND_BASE_URL}${url}`, opt);
  } else {
    return axios[type](`${BACKEND_BASE_URL}${url}`, param, opt);
  }
};

const getQuestions = (phone) => apiCall("get", "", {}, false);

export const API = {
  getQuestions,
};
