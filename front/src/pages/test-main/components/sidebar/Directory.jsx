import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import TreeView from "@mui/lab/TreeView";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled as muiStyled } from "@mui/material/styles";
import PropTypes from "prop-types";

// icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DescriptionIcon from "@mui/icons-material/Description";
import { IoLogoPython } from "react-icons/io5";

import { ReactComponent as IcNewFile } from "../../../../assets/icons/ic_new_file.svg";
import { ReactComponent as IcNewDir } from "../../../../assets/icons/ic_new_dir.svg";
// import { ReactComponent as IcToggle } from "../../../../assets/icons/ic_toggle.svg";

// import * as iconsi from "react-icons/io5";

import projectApi from "../../../../api/projectApi";

import { selectFile } from "../../../../redux/teamSlice";
import fileApi from "../../../../api/fileApi";

const TYPE_DIRECTORY = "1";
const TYPE_FILE = "2";

const getFileType = (filePath) => {
  const filenameExtension = filePath.split(".")[1] ?? null;
  switch (filenameExtension) {
    case "py":
      return "python";
    case null:
      return "directory";
    default:
      return null;
  }
};

const getFileName = (filePath) => {
  if (filePath.includes(".")) {
    return filePath.split("/").slice(-1)[0].split(".")[0];
  } else {
    return filePath.split("/").slice(-1)[0];
  }
};

const Directory = (props) => {
  const dispatch = useDispatch();

  const { curPath, curName, teamSeq, selectedFilePath, saveFileContent } =
    props;

  const [filesDirectories, setFilesDirectories] = useState({});

  useEffect(() => {
    projectApi
      .getAllFiles(teamSeq)
      .then((res) => setFilesDirectories(res.data))
      .catch(console.error);
  }, [dispatch, teamSeq]);

  // 디렉터리 생성 핸들러
  const createDirectoryHandler = async () => {
    const newDirectoryName = prompt("생성할 폴더 이름 입력");
    if (newDirectoryName.trim().length === 0) {
      return;
    }
    if (newDirectoryName.trim().includes(".")) {
      alert("폴더 이름에 .을 넣을 수 없습니다");
      return;
    }
    const fileInfoData = {
      fileTitle: newDirectoryName,
      filePath: selectedFilePath,
    };
    try {
      await fileApi.createFile(teamSeq, TYPE_DIRECTORY, fileInfoData);
      const res = await projectApi.getAllFiles(teamSeq);
      setFilesDirectories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 파일 생성 핸들러
  const createFileHandler = () => {
    const newFileName = prompt("생성할 파일 이름 (확장자까지) 입력");
    if (newFileName.trim().length === 0) {
      return;
    }
    if (!newFileName.trim().includes(".")) {
      alert("확장자까지 유효하게 입력해야 합니다");
      return;
    }
    const fileData = {
      fileTitle: newFileName,
      filePath: curPath,
    };
    // dispatch(createFile({ teamSeq, type: TYPE_FILE, fileData }))
    //   .unwrap()
    //   .then(() => {
    //     console.log(`${newFileName} 생성 완료`);
    //     dispatch(getAllFiles(teamSeq))
    //       .unwrap()
    //       .then(setFilesDirectories)
    //       .catch(console.error);
    //   })
    //   .catch(console.error);
  };

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
    // dispatch(renameFile({ teamSeq, fileData: renameData }))
    //   .unwrap()
    //   .then(() => {
    //     console.log(`${curName} -> ${newName} 변경 성공`);
    //     dispatch(getAllFiles(teamSeq))
    //       .unwrap()
    //       .then(setFilesDirectories)
    //       .catch(console.error);
    //   })
    //   .catch(console.error);
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
    // dispatch(deleteFile({ teamSeq, type: targetType, fileData: targetData }))
    //   .unwrap()
    //   .then((res) => {
    //     console.log("삭제 성공 res:", res);
    //     dispatch(getAllFiles(teamSeq))
    //       .unwrap()
    //       .then(setFilesDirectories)
    //       .catch(console.error);
    //   })
    //   .catch(console.error);
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
    const filenameExtension = nodeIds.split(".")[1] ?? null;
    const payloadData = {
      type: getFileType(nodeIds),
      name: getFileName(nodeIds),
      path: nodeIds,
    };
    dispatch(selectFile(payloadData));
  };

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
      color: "#BBBBBB",
      borderTopRightRadius: theme.spacing(1),
      borderBottomRightRadius: theme.spacing(1),
      paddingRight: theme.spacing(1),
      borderTopLeftRadius: theme.spacing(1),
      borderBottomLeftRadius: theme.spacing(1),
      paddingLeft: theme.spacing(0),
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
        backgroundColor: "transparent",
        color: "#D4A8E3",
        fontWeight: "bold",
      },
      [`& .${treeItemClasses.label}`]: {
        fontWeight: "inherit",
        color: "inherit",
      },
      [`& .${treeItemClasses.iconContainer}`]: {},
    },
    [`& .${treeItemClasses.group}`]: {
      // marginLeft: 0,
      // [`& .${treeItemClasses.content}`]: {
      //   paddingLeft: theme.spacing(2),
      // },
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
            <Box
              component={LabelIcon}
              color="inherit"
              sx={{ mr: 1, width: 20, height: "auto" }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: "inherit",
                flexGrow: 1,
                fontSize: 14,
                width: "100%",
              }}
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
  };

  // 트리 생성 with 스타일
  const renderTree = (nodes) => (
    <StyledTreeItem
      key={nodes.id}
      nodeId={nodes.id}
      labelText={nodes.name}
      labelIcon={
        nodes?.id?.includes(".")
          ? nodes?.id?.includes(".py")
            ? IoLogoPython
            : DescriptionIcon
          : FolderIcon
      }
      // color="#1a73e8"
      // bgColor="#e8f0fe"
      // onClick={treeItemClickHandler}
      onContextMenu={treeItemContextMenuHandler}
      collapseIcon={nodes?.id?.includes(".") ? null : <ExpandMoreIcon />}
      expandIcon={nodes?.id?.includes(".") ? null : <ChevronRightIcon />}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
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

        {/* stroke */}
        <hr className="bg-component_dark border-0 m-0 h-[3px] min-h-[3px]" />

        <div className="text-xs" style={{ padding: 15 }}>
          {/* 디렉터리 파일, 폴더 모음 */}
          <TreeView
            aria-label="files and directories"
            // defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={["root"]}
            // defaultExpandIcon={<ChevronRightIcon />}
            defaultEndIcon={<div style={{ width: 24 }} />}
            sx={{ flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
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
