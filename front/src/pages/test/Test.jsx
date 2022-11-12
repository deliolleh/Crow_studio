import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import fileApi from "../../api/fileApi";

import { createFile, deleteFile, renameFile } from "../../redux/fileSlice";
import { getDirectoryList } from "../../redux/projectSlice";

import Header from "../../components/Header";

const TEAM_SEQ = 3;
const TYPE_DIRECTORY = 1;
const TYPE_FILE = 2;

const directoryData = {
  rootPath: `/home/ubuntu/crow_data/${TEAM_SEQ}`,
  rootName: ``,
};

const Test = () => {
  const dispatch = useDispatch();
  const [newFileName, setNewFileName] = useState("");
  const [newDirectoryName, setNewDirectoryName] = useState("");
  const [curItems, setCurItems] = useState([]);
  const [curFileContent, setCurFileContent] = useState("");

  const dispatchGetDirectoryList = () => {
    dispatch(getDirectoryList(directoryData))
      .unwrap()
      .then((res) => {
        console.log("directoryList res:", res);
        setCurItems(res.fileDirectory);
      })
      .catch(console.error);
  };

  useEffect(() => {
    dispatchGetDirectoryList();
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
    dispatch(createFile({ teamSeq: TEAM_SEQ, type: TYPE_DIRECTORY, fileData }))
      .unwrap()
      .then(() => {
        console.log(`/${newDirectoryName} 생성 완료`);
        setNewDirectoryName("");
        dispatchGetDirectoryList();
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
    dispatch(createFile({ teamSeq: TEAM_SEQ, type: TYPE_FILE, fileData }))
      .unwrap()
      .then(() => {
        console.log(`${newFileName} 생성 완료`);
        setNewFileName("");
        dispatchGetDirectoryList();
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
    dispatch(
      deleteFile({ teamSeq: TEAM_SEQ, type: targetType, fileData: targetData })
    )
      .unwrap()
      .then((res) => {
        console.log("삭제 성공 res:", res);
        dispatchGetDirectoryList();
      })
      .catch(console.error);
  };

  // 파일, 폴더 이름 수정 핸들러
  const renameItemHandler = (targetPath, targetName) => {
    const newName = prompt("변경할 이름 입력", targetName);
    const renameData = {
      filePath: targetPath,
      oldFileName: targetName,
      fileTitle: newName,
    };
    dispatch(renameFile(renameData))
      .unwrap()
      .then((res) => {
        console.log(`${targetName} -> ${newName} 변경 성공`);
        dispatchGetDirectoryList();
      })
      .catch(console.error);
  };

  // 파일 클릭하면 내용 보여주기
  const showFileContentHandler = () => {};

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

      {/* 현재 프로젝트 아이템들 */}
      {curItems &&
        curItems?.map((item) => (
          <div className="mb-4 text-sm" key={item.path}>
            <div>path: {item.path}</div>
            <div onClick={() => showFileContentHandler(item.path)}>
              name: {item.name}
            </div>
            <div>type: {item.type}</div>
            <div>
              <button
                className="mr-2"
                onClick={() => renameItemHandler(item.path, item.name)}
              >
                ✏
              </button>
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

      {/* 파일 조회 */}
      <textarea
        value={curFileContent}
        onChange={(e) => setCurFileContent(e.target.value)}
      ></textarea>
    </React.Fragment>
  );
};

export default Test;
