import api from "./api";

const fileApi = {
  fileCreate: (teamSeq, type, fileData) =>
    api.post(`/files/${teamSeq}?type=${type}`, fileData),
  fileDelete: (teamSeq, type, fileData) =>
    api.delete(`/files/${teamSeq}?type=${type}`, { data: fileData }),
  fileSave: (teamSeq, contentData) =>
    api.put(`/files/${teamSeq}/files`, contentData),
  // fileNameChange: (fileTitle, fileData) =>
  //   api.put(`/files/${fileTitle}`, fileData),
  fileNameChange: (fileData) => api.put(`/files/file-title`, fileData),
  fileCall: (fileData) => api.post("/files/files", fileData),
};

export default fileApi;