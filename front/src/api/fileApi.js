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
  fileNameChange: (teamSeq, fileData) =>
    api.put(`/files/${teamSeq}/file-title`, fileData),
  fileCall: (fileData) => api.post("/files/files", fileData),
  getFileContent: (filePathData) => api.post("/files/files", filePathData),
  saveFileContent: (teamSeq, fileContentData) =>
    api.put(`/files/${teamSeq}/files`, fileContentData),
  createFile: (teamSeq, fileType, fileInfoData) =>
    api.post(`/files/${teamSeq}?type=${fileType}`, fileInfoData),
};

export default fileApi;
