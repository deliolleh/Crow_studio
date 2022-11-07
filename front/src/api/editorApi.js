import api from "./api";

const editorApi = {
  apiRequest: (requestData) => api.post("/api-test", requestData),
  lint: (language, codeData) => api.post(`/editors/lint/${language}`, codeData),
  formatPut: (language, codeData) =>
    api.post(`/editors/format/${language}`, codeData),
  formatGet: (fileNum) => api.post(`/editors/format`, fileNum),
  variableRecommend: (letter) => api.post("/variable", letter),
};

export default editorApi;
