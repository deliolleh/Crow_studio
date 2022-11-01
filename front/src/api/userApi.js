import api from "./api";

const userApi = {
  signup: (signupData) => api.post("/users/signup", signupData),
  login: (loginData) => api.post("/users/login", loginData),
};

export default userApi;
