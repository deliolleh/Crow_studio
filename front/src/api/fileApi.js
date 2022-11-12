import api from "./api";

const fileApi = {
  fileCreate: (teamSeq, type, fileData) =>
    api.post(`/files/${teamSeq}?type=${type}`, fileData),
  fileDelete: (teamSeq, type, fileData) =>
    api.delete(`/files/${teamSeq}?type=${type}`, { data: fileData }),
  fileSave: (teamSeq, ContentData) => api.put(`/files/${teamSeq}`, ContentData),
  fileNameChange: (fileTitle, fileData) =>
    api.put(`/files/${fileTitle}`, fileData),
  fileCall: (fileData) => api.post("/files/files", fileData),
};

export default fileApi;
