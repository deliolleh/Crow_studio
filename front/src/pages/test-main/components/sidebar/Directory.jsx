import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import Tree, { useTreeState, treeHandlers } from "react-hyper-tree";

// import svg
import { ReactComponent as IcNewFile } from "../../../../assets/icons/ic_new_file.svg";
import { ReactComponent as IcNewDir } from "../../../../assets/icons/ic_new_dir.svg";
// import { ReactComponent as IcToggle } from "../../../../assets/icons/ic_toggle.svg";

// import * as iconsi from "react-icons/io5";

import { getDirectoryList, getAllFiles } from "../../../../redux/projectSlice";
import {
  createFile,
  deleteFile,
  renameFile,
  getFileContent,
  saveFileContent,
} from "../../../../redux/fileSlice";

import DirectoryList from "./directory/DirectoryList";

const data = {
  id: 1,
  name: "Parent 1",
  children: [
    {
      id: 2,
      name: "Child 1",
      children: [
        {
          id: 5,
          name: "Child 1__1",
        },
        {
          id: 6,
          name: "Child 1__2",
        },
        {
          id: 7,
          name: "Child 1__3",
        },
      ],
    },
  ],
};

const Directory = ({ showFileContent }) => {
  const dispatch = useDispatch();
  const { teamSeq } = useParams();
  const [curItems, setCurItems] = useState([]);
  // const [newFileName, setNewFileName] = useState("");
  // const [newDirectoryName, setNewDirectoryName] = useState("");

  const [testData, setTestData] = useState({});

  // const TEAM_SEQ = 3;
  const TYPE_DIRECTORY = 1;
  const TYPE_FILE = 2;
  const DIRECTORY_DATA = {
    // rootPath: `/home/ubuntu/crow_data/${TEAM_SEQ}`,
    rootPath: `${teamSeq}`,
    rootName: `root`,
  };

  const dispatchGetDirectoryList = () => {
    dispatch(getDirectoryList(DIRECTORY_DATA))
      .unwrap()
      .then((res) => {
        console.log("directoryList res:", res);
        setCurItems(
          res.fileDirectory.map((el) => {
            const element = {
              ...el,
              isOpened: false,
              depth: 0,
              children: [],
            };
            return element;
          })
        );
      })
      .catch(console.error);
  };

  useEffect(() => {
    // dispatchGetDirectoryList();
    dispatch(getAllFiles(teamSeq))
      .unwrap()
      .then((res) => {
        console.log("res:", res);
        setTestData(res);
      })
      .catch(console.error);
  }, []);

  // 디렉터리 생성 핸들러
  const createDirectoryHandler = () => {
    const newDirectoryName = prompt("생성할 폴더 이름 입력");
    if (newDirectoryName.trim().length === 0) {
      return;
    }
    const fileData = {
      fileTitle: newDirectoryName,
      filePath: `/home/ubuntu/crow_data/${teamSeq}/thisIsProjectName`,
    };
    dispatch(createFile({ teamSeq, type: TYPE_DIRECTORY, fileData }))
      .unwrap()
      .then(() => {
        console.log(`/${newDirectoryName} 생성 완료`);
        dispatchGetDirectoryList();
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
      filePath: `/home/ubuntu/crow_data/${teamSeq}`,
    };
    dispatch(createFile({ teamSeq, type: TYPE_FILE, fileData }))
      .unwrap()
      .then(() => {
        console.log(`${newFileName} 생성 완료`);
        dispatchGetDirectoryList();
      })
      .catch(console.error);
  };

  // 파일 클릭
  const openFileHandler = (path, type) => {
    console.log("path, type:", path, type);
    showFileContent(type, path);
  };

  // 폴더 클릭
  const openFolderHandler = (name) => {
    console.log("folder name:", name);
    console.log("curItems:", curItems);
    const directoryData = {
      rootPath: `${teamSeq}/${name}`,
      rootName: `root`,
    };
    dispatch(getDirectoryList(directoryData))
      .unwrap()
      .then((res) => {
        console.log("name's:", res);
      })
      .catch(console.error);
  };

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
        dispatchGetDirectoryList();
      })
      .catch(console.error);
  };

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
        dispatchGetDirectoryList();
      })
      .catch(console.error);
  };

  // const { required, handlers } = useTreeState({ data, id: "your_tree_id" });
  const { required, handlers, instance } = useTreeState({
    data: testData,
    id: "your_tree_id",
  });

  //
  //
  //
  //
  const CustomNode = ({ node, onSelect, onToggle, onClick, setOpen }) => {
    // const handleClick = useCallback(() => {
    //   onSelect();
    //   onClick(node);
    //   console.log("node:", node);
    // }, [node, onSelect, onClick]);
    console.log("setOpen:", setOpen);

    const handleClick = useCallback(
      (e) => {
        e.stopPropagation();
        if (setOpen) {
          setOpen(node);
        }
        onSelect(setOpen);
        onClick(node);
        console.log("node:", node);
      },
      [node, onSelect, onClick, setOpen]
    );

    return <div onClick={handleClick}>{node.data.name}</div>;
  };
  //
  //
  //
  //

  useEffect(() => {
    console.log(
      `treeHandlers.trees["your_tree_id"].instance:`,
      treeHandlers.trees["your_tree_id"].instance
    );
    console.log(treeHandlers.trees["your_tree_id"].handlers);
  }, []);

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
          {/* <DirectoryList
            curItems={curItems}
            onOpenFile={openFileHandler}
            onOpenFolder={openFolderHandler}
            onRename={renameItemHandler}
            onDelete={deleteItemHandler}
          /> */}
          <Tree
            {...required}
            {...handlers}
            renderNode={(defaultProps) => (
              <CustomNode
                {...defaultProps}
                onClick={() => console.log("defaultProps:", defaultProps)}
              />
            )}
          />
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
