import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled as muiStyled } from "@mui/material/styles";
import PropTypes from "prop-types";

// icons
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DescriptionIcon from "@mui/icons-material/Description";

import { ReactComponent as IcNewFile } from "../../../../assets/icons/ic_new_file.svg";
import { ReactComponent as IcNewDir } from "../../../../assets/icons/ic_new_dir.svg";
// import { ReactComponent as IcToggle } from "../../../../assets/icons/ic_toggle.svg";

// import * as iconsi from "react-icons/io5";

import { getAllFiles } from "../../../../redux/projectSlice";
import {
  createFile,
  deleteFile,
  renameFile,
  // getFileContent,
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

const Directory = (props) => {
  const dispatch = useDispatch();
  const { teamSeq } = useParams();

  const {
    curPath,
    setCurPath,
    curName,
    setCurName,
    showFileContent,
    saveFileContent,
  } = props;

  // const [curPath, setCurPath] = useState("");
  // const [curName, setCurName] = useState("");

  const [filesDirectories, setFilesDirectories] = useState({});

  useEffect(() => {
    dispatch(getAllFiles(teamSeq))
      .unwrap()
      .then(setFilesDirectories)
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
          .then(setFilesDirectories)
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
          .then(setFilesDirectories)
          .catch(console.error);
      })
      .catch(console.error);
  };

  // 파일 클릭
  const openFileHandler = (path, type) => showFileContent(type, path);

  // 이름 변경
  const renameHandler = () => {
    const newName = prompt("변경할 이름 입력", curName);
    if (newName === curName) {
      return;
    } else if (!newName) {
      return;
    }
    const renameData = {
      filePath: curPath,
      oldFileName: curName,
      fileTitle: newName,
    };
    dispatch(renameFile({ teamSeq, fileData: renameData }))
      .unwrap()
      .then(() => {
        console.log(`${curName} -> ${newName} 변경 성공`);
        dispatch(getAllFiles(teamSeq))
          .unwrap()
          .then(setFilesDirectories)
          .catch(console.error);
      })
      .catch(console.error);
  };

  // 삭제
  const deleteHandler = () => {
    if (!window.confirm(`${curName} 삭제할거임?`)) {
      return;
    }
    const targetType = curName.includes(".") ? "2" : "1";
    const targetData = {
      filePath: curPath,
    };
    dispatch(deleteFile({ teamSeq, type: targetType, fileData: targetData }))
      .unwrap()
      .then((res) => {
        console.log("삭제 성공 res:", res);
        dispatch(getAllFiles(teamSeq))
          .unwrap()
          .then(setFilesDirectories)
          .catch(console.error);
      })
      .catch(console.error);
  };

  // 저장
  const saveHandler = () => saveFileContent(curName, curPath);

  // // 트리 생성
  // const renderTree = (nodes) => (
  //   <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
  //     {Array.isArray(nodes.children)
  //       ? nodes.children.map((node) => renderTree(node))
  //       : null}
  //   </TreeItem>
  // );

  // 노드 선택
  const nodeSelectHandler = (e, nodeIds) => {
    setCurName(e.target.innerText);
    setCurPath(nodeIds);
    if (e.target.innerText && e.target.innerText.includes(".")) {
      openFileHandler(nodeIds, TYPE_FILE);
    }
  };

  useEffect(() => {
    // console.log("curPath re-rendering");
  }, [curPath]);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  const StyledTreeItemRoot = muiStyled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
      color: theme.palette.text.secondary,
      borderTopRightRadius: theme.spacing(2),
      borderBottomRightRadius: theme.spacing(2),
      paddingRight: theme.spacing(1),
      fontWeight: theme.typography.fontWeightMedium,
      "&.Mui-expanded": {
        fontWeight: theme.typography.fontWeightRegular,
      },
      // "&:hover": {
      //   backgroundColor: theme.palette.action.hover,
      // },
      "&:hover": {
        backgroundColor: "#786f7b",
        color: "white",
      },
      // "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      //   backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      //   color: "var(--tree-view-color)",
      // },
      "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
        backgroundColor: "#786f7b",
        color: "white",
      },
      [`& .${treeItemClasses.label}`]: {
        fontWeight: "inherit",
        color: "inherit",
      },
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 0,
      [`& .${treeItemClasses.content}`]: {
        paddingLeft: theme.spacing(2),
      },
    },
  }));

  function StyledTreeItem(props) {
    const {
      bgColor,
      color,
      labelIcon: LabelIcon,
      labelInfo,
      labelText,
      ...other
    } = props;

    return (
      <StyledTreeItemRoot
        label={
          <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
            <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: "inherit", flexGrow: 1 }}
            >
              {labelText}
            </Typography>
            <Typography variant="caption" color="inherit">
              {labelInfo}
            </Typography>
          </Box>
        }
        style={{
          "--tree-view-color": color,
          "--tree-view-bg-color": bgColor,
        }}
        {...other}
      />
    );
  }

  // const treeItemClickHandler = (e) => console.log(e);
  const treeItemContextMenuHandler = (e) => {
    e.preventDefault();
    alert("yaho");
    console.log(e);
  };

  // 트리 생성 with 스타일
  const renderTree = (nodes) => (
    <StyledTreeItem
      key={nodes.id}
      nodeId={nodes.id}
      labelText={nodes.name}
      labelIcon={nodes?.id?.includes(".") ? DescriptionIcon : FolderIcon}
      color="#1a73e8"
      bgColor="#e8f0fe"
      // onClick={treeItemClickHandler}
      onContextMenu={treeItemContextMenuHandler}
      collapseIcon={nodes?.id?.includes(".") ? null : <ExpandMoreIcon />}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
      {console.log("nodes:", nodes)}
    </StyledTreeItem>
  );

  StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired,
  };

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
            <IcSpan>
              <div onClick={renameHandler}>✏</div>
            </IcSpan>
            <IcSpan>
              <div onClick={deleteHandler}>🪓</div>
            </IcSpan>
            <IcSpan>
              <div onClick={saveHandler}>💾</div>
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
            aria-label="files and directories"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={["root"]}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ flexGrow: 1, overflowY: "auto" }}
            onNodeSelect={nodeSelectHandler}
          >
            {renderTree(filesDirectories)}
          </TreeView>
        </div>
      </DirectoryContainer>
    </React.Fragment>
  );
};

export default Directory;

const DirectoryContainer = styled.div`
  border-radius: 0 10px 10px 0;
  height: 100%;
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
