import api from "./api";

const authApi = {
  signup: (signupData) => api.post("/users/signup", signupData),
  login: (loginData) => api.post("/users/login", loginData),
};

export default authApi;
