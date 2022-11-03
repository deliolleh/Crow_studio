import api from "./api";

const userApi = {
  signup: (signupData) => api.post("/users/signup", signupData),
  login: (loginData) => api.post("/users/login", loginData),
  getUser: () => api.get("/users/info"),
  getMypage: (userSeq) => api.get(`/users/mypage/${userSeq}`),
  putNickname: (nicknameData) => api.put("users/edit/nickname", nicknameData),
};

export default userApi;
