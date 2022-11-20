import api from "./api";

const compileApi = {
  getCompileResult: (compileData) => api.post("/compile/py", compileData),
  stopCompile: (teamData) => api.post("/compile/py/stop", teamData),
};

export default compileApi;
