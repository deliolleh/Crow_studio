import api from "./api";

const compileApi = {
  compilePython: (compileData) => api.post("/compile/py", compileData),
  compilePythonStop: (projectData) => api.post("/compile/py/stop", projectData),
};

export default compileApi;
