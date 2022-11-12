import React, { useState, useEffect } from "react";

import fileApi from "../../api/fileApi";
import projectApi from "../../api/projectApi";

import Header from "../../components/Header";

const TEAM_SEQ = 3;

const Test = () => {
  const [newFileName, setNewFileName] = useState("");
  const [newDirectoryName, setNewDirectoryName] = useState("");
  const [curItems, setCurItems] = useState([]);

  useEffect(() => {
    const directoryData = {
      rootPath: `/home/ubuntu/crow_data/${TEAM_SEQ}`,
      rootName: ``,
    };
    projectApi
      .directoryList(directoryData)
      .then((res) => {
        console.log("directoryList res:", res);
        setCurItems(res.data.fileDirectory);
      })
      .catch(console.error);
  }, []);

  // 디렉터리 생성 핸들러
  const createDirectoryHandler = (e) => {
    e.preventDefault();
    if (newDirectoryName.trim().length === 0) {
      return;
    }
    const fileData = {
      fileTitle: newDirectoryName,
      filePath: `/home/ubuntu/crow_data/${TEAM_SEQ}`,
    };
    fileApi
      .fileCreate(TEAM_SEQ, 1, fileData)
      .then((res) => {
        console.log(`/${newDirectoryName} 생성 완료`);
        alert(`/${newDirectoryName} 생성 완료`);
        setNewDirectoryName("");
      })
      .catch(console.error);
  };

  // 파일 생성 핸들러
  const createFileHandler = (e) => {
    e.preventDefault();
    if (newFileName.trim().length === 0) {
      return;
    }
    const fileData = {
      fileTitle: newFileName,
      filePath: `/home/ubuntu/crow_data/${TEAM_SEQ}`,
    };
    fileApi
      .fileCreate(TEAM_SEQ, 2, fileData)
      .then((res) => {
        console.log(`${newFileName} 생성 완료`);
        alert(`${newFileName} 생성 완료`);
        setNewFileName("");
      })
      .catch(console.error);
  };

  // 파일, 폴더 삭제 핸들러
  const deleteItemHandler = (targetPath, targetTypeName, targetName) => {
    if (!window.confirm(`${targetName} 삭제할거임?`)) {
      return;
    }
    const targetType = targetTypeName === "directory" ? "1" : "2";
    const targetData = {
      filePath: targetPath,
    };
    fileApi
      .fileDelete(TEAM_SEQ, targetType, targetData)
      .then(console.log)
      .catch(console.error);
  };

  return (
    <React.Fragment>
      <Header />

      {/* 디렉터리 생성 */}
      <form method="post" onSubmit={createDirectoryHandler} className="mb-5">
        <label htmlFor="newDirectory">폴더 생성</label>
        <input
          type="text"
          name="newDirectory"
          id="newDirectory"
          placeholder="생성할 디렉터리 이름 입력"
          value={newDirectoryName}
          onChange={(e) => setNewDirectoryName(e.target.value)}
        />
      </form>

      {/* 파일 생성 */}
      <form method="post" onSubmit={createFileHandler} className="mb-5">
        <label htmlFor="newFile">파일 생성</label>
        <input
          type="text"
          name="newFile"
          id="newFile"
          placeholder="생성할 파일 이름 입력"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
        />
      </form>

      {/* 현재 프로젝트 구조 */}
      {curItems &&
        curItems?.map((item) => (
          <div className="mb-4 text-sm" key={item.path}>
            <div>path: {item.path}</div>
            <div>name: {item.name}</div>
            <div>type: {item.type}</div>
            <div>
              <button className="mr-2">✏</button>
              <button
                onClick={() =>
                  deleteItemHandler(item.path, item.type, item.name)
                }
              >
                ❌
              </button>
            </div>
          </div>
        ))}
    </React.Fragment>
  );
};

export default Test;
