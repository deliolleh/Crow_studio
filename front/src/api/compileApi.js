import api from "./api";

const compileApi = {
  compilePython: (compileData) => api.post("/compile/py", compileData),
  compilePythonStop: (projectData) => api.post("/compile/py/stop", projectData),
  getCompileResult: (compileData) => api.post("/compile/py", compileData),
  stopCompile: (teamData) => api.post("/compile/py/stop", teamData),
};

export default compileApi;
