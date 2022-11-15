import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";

import { ReactComponent as IcNewFile } from "../../../../assets/icons/ic_new_file.svg";
import { ReactComponent as IcNewDir } from "../../../../assets/icons/ic_new_dir.svg";
// import { ReactComponent as IcToggle } from "../../../../assets/icons/ic_toggle.svg";

// import * as iconsi from "react-icons/io5";

import { getAllFiles } from "../../../../redux/projectSlice";
import {
  createFile,
  deleteFile,
  renameFile,
  getFileContent,
  saveFileContent,
} from "../../../../redux/fileSlice";

// const TEAM_SEQ = 3;
const TYPE_DIRECTORY = 1;
const TYPE_FILE = 2;
const DIRECTORY_DATA = {
  // rootPath: `/home/ubuntu/crow_data/${TEAM_SEQ}`,
  // rootPath: `${TEAM_SEQ}`,
  rootName: `root`,
};

const Directory = ({ showFileContent }) => {
  const dispatch = useDispatch();
  const { teamSeq } = useParams();
  const [curPath, setCurPath] = useState("");

  const [testData, setTestData] = useState({});

  useEffect(() => {
    dispatch(getAllFiles(teamSeq))
      .unwrap()
      .then((res) => {
        console.log("res:", res);
        setTestData(res);
      })
      .catch(console.error);
  }, [dispatch, teamSeq]);

  // 디렉터리 생성 핸들러
  const createDirectoryHandler = () => {
    const newDirectoryName = prompt("생성할 폴더 이름 입력");
    if (newDirectoryName.trim().length === 0) {
      return;
    }
    const fileData = {
      fileTitle: newDirectoryName,
      filePath: curPath,
    };
    dispatch(createFile({ teamSeq, type: TYPE_DIRECTORY, fileData }))
      .unwrap()
      .then(() => {
        console.log(`/${newDirectoryName} 생성 완료`);
        dispatch(getAllFiles(teamSeq))
          .unwrap()
          .then(setTestData)
          .catch(console.error);
      })
      .catch(console.error);
  };

  // 파일 생성 핸들러
  const createFileHandler = () => {
    const newFileName = prompt("생성할 파일 이름 입력");
    if (newFileName.trim().length === 0) {
      return;
    }
    const fileData = {
      fileTitle: newFileName,
      filePath: curPath,
    };
    dispatch(createFile({ teamSeq, type: TYPE_FILE, fileData }))
      .unwrap()
      .then(() => {
        console.log(`${newFileName} 생성 완료`);
        dispatch(getAllFiles(teamSeq))
          .unwrap()
          .then(setTestData)
          .catch(console.error);
      })
      .catch(console.error);
  };

  // 파일 클릭
  const openFileHandler = (path, type) => {
    console.log("path, type:", path, type);
    showFileContent(type, path);
  };

  // 이름 변경
  const renameItemHandler = (path, name) => {
    const newName = prompt("변경할 이름 입력", name);
    const renameData = {
      filePath: path,
      oldFileName: name,
      fileTitle: newName,
    };
    dispatch(renameFile(renameData))
      .unwrap()
      .then(() => {
        console.log(`${name} -> ${newName} 변경 성공`);
      })
      .catch(console.error);
  };

  // 삭제
  const deleteItemHandler = (path, typeName, name) => {
    if (!window.confirm(`${name} 삭제할거임?`)) {
      return;
    }
    const targetType = typeName === "directory" ? "1" : "2";
    const targetData = {
      filePath: path,
    };
    dispatch(deleteFile({ teamSeq, type: targetType, fileData: targetData }))
      .unwrap()
      .then((res) => {
        console.log("삭제 성공 res:", res);
      })
      .catch(console.error);
  };

  // 트리 생성
  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  // 노드 선택
  const nodeSelectHandler = (e, nodeIds) => {
    console.log(e.target.innerText);
    if (e.target.innerText && !e.target.innerText.includes(".")) {
      setCurPath(nodeIds);
    } else if (e.target.innerText && e.target.innerText.includes(".")) {
      openFileHandler(nodeIds, TYPE_FILE);
    }
  };

  useEffect(() => {
    console.log("curPath:", curPath);
  }, [curPath]);

  return (
    <React.Fragment>
      <DirectoryContainer className="mb-3 bg-component_item_bg_dark flex flex-col">
        <div
          className="flex justify-between items-center"
          style={{ padding: 15 }}
        >
          <div className="text-xl font-bold text-white">Directory</div>
          <div className="mt-1 flex items-center">
            <IcSpan>
              <IcNewFile alt="IcNewFile" onClick={createFileHandler} />
            </IcSpan>
            <IcSpan>
              <IcNewDir alt="IcNewDir" onClick={createDirectoryHandler} />
            </IcSpan>
          </div>
        </div>

        <div className="text-xs" style={{ padding: 15 }}>
          <hr
            className="bg-component_dark border-0 m-0 absolute min-h-[3px]"
            style={{ height: 3, width: 292, top: 140, left: 88 }}
          />

          {/* 디렉터리 파일, 폴더 모음 */}
          <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={["root"]}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ flexGrow: 1, overflowY: "auto" }}
            onNodeSelect={nodeSelectHandler}
          >
            {renderTree(testData)}
          </TreeView>
        </div>
      </DirectoryContainer>
    </React.Fragment>
  );
};

export default Directory;

const DirectoryContainer = styled.div`
  border-radius: 0 10px 10px 0;
  height: 100vh;
`;

const IcSpan = styled.span`
  padding: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #d9d9d9;
    border-radius: 5px;

    & svg {
      & path {
        fill: #2b2c2b;
      }
    }
  }
`;
