import axios from "axios";

const baseURL = "http://k7d207.p.ssafy.io:8080/api";

const headers = {
  "Content-Type": "application/json;charset=UTF-8",
  Accept: "*/*",
  "Access-Control-Allow-Origin": "*",
  crossDomain: true,
  credentials: "include",
  withCredentials: true,
};

const api = axios.create({
  baseURL,
  headers: headers,
});

api.interceptors.request.use((config) => {
  if (!config.headers.jwt) {
    const accessToken = localStorage.getItem("access-token");
    if (accessToken) {
      // config.headers.Authorization = accessToken;
      config.headers.jwt = accessToken.slice(4);
    } else {
      // config.headers.jwt = "";
    }
  }
  return config;
});

export default api;
