import React, { Fragment, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Menu, Transition } from "@headlessui/react";

import clsx from "clsx";
import { Tree } from "react-arborist";
// import { dirData } from "./directory/dirData";
import { FillFlexParent } from "./directory/fill-flex-parent.tsx";

import * as icons from "react-icons/md";
import { IoDocumentOutline } from "react-icons/io5";
import styles from "./directory/dir-data.module.css";

// import svg
import { ReactComponent as IcNewFile } from "../../../../assets/icons/ic_new_file.svg";
import { ReactComponent as IcNewDir } from "../../../../assets/icons/ic_new_dir.svg";
import { ReactComponent as IcToggle } from "../../../../assets/icons/ic_toggle.svg";

import * as iconsi from "react-icons/io5";

import { getDirectoryList } from "../../../../redux/projectSlice";
import {
  createFile,
  deleteFile,
  renameFile,
  getFileContent,
  saveFileContent,
} from "../../../../redux/fileSlice";

// dropdown func
// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// tree view func (React Arborist)
function Node({ node, style, dragHandle }) {
  const Icon = node.data.icon || IoDocumentOutline;
  return (
    <div
      ref={dragHandle}
      style={style}
      className={clsx(styles.node, node.state)}
      onClick={() => node.isInternal && node.toggle()}
    >
      <FolderArrow node={node} />
      <span>
        <Icon />
      </span>
      <span>{node.isEditing ? <Input node={node} /> : node.data.name}</span>
      <span>{node.data.unread === 0 ? null : node.data.unread}</span>
    </div>
  );
}

function Input({ node }) {
  return (
    <input
      autoFocus
      type="text"
      defaultValue={node.data.name}
      onFocus={(e) => e.currentTarget.select()}
      onBlur={() => node.reset()}
      onKeyDown={(e) => {
        if (e.key === "Escape") node.reset();
        if (e.key === "Enter") node.submit(e.currentTarget.value);
      }}
    />
  );
}

function FolderArrow({ node }) {
  if (node.isLeaf) return <span></span>;
  return (
    <span>
      {node.isOpen ? <icons.MdArrowDropDown /> : <icons.MdArrowRight />}
    </span>
  );
}

function Cursor({ top, left }) {
  return <div className={styles.dropCursor} style={{ top, left }}></div>;
}

const TEAM_SEQ = 3;
const TYPE_DIRECTORY = 1;
const TYPE_FILE = 2;
const DIRECTORY_DATA = {
  rootPath: `/home/ubuntu/crow_data/${TEAM_SEQ}`,
  rootName: ``,
};

const Directory = () => {
  const dispatch = useDispatch();
  const [term, setTerm] = useState("");

  const [curItems, setCurItems] = useState([]);
  // const [newFileName, setNewFileName] = useState("");
  // const [newDirectoryName, setNewDirectoryName] = useState("");

  const dispatchGetDirectoryList = () => {
    dispatch(getDirectoryList(DIRECTORY_DATA))
      .unwrap()
      .then((res) => {
        console.log("directoryList res:", res);
        setCurItems(
          res.fileDirectory.map((el, i) => {
            const elementData = {
              id: `${i + 1}`,
              name: el.name,
              unread: 0,
              icon: el.name.includes(".py")
                ? iconsi.IoLogoPython
                : iconsi.IoFolderOpenOutline,
            };
            return elementData;
          })
        );
      })
      .catch(console.error);
  };

  useEffect(() => {
    dispatchGetDirectoryList();
  }, []);

  // 디렉터리 생성 핸들러
  const createDirectoryHandler = () => {
    const newDirectoryName = prompt("생성할 폴더 이름 입력");
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
      filePath: `/home/ubuntu/crow_data/${TEAM_SEQ}`,
    };
    dispatch(createFile({ teamSeq: TEAM_SEQ, type: TYPE_FILE, fileData }))
      .unwrap()
      .then(() => {
        console.log(`${newFileName} 생성 완료`);
        dispatchGetDirectoryList();
      })
      .catch(console.error);
  };

  return (
    <>
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

            {/* dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button>
                <IcSpan className="flex">
                  <IcToggle alt="IcToggle" aria-hidden="true" />
                </IcSpan>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-6 -top-2 z-10 mt-2 w-36 origin-top-right rounded-md bg-component_item_bg_+2_dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      <div className="block px-4 py-2 text-xs cursor-pointer text-white hover:bg-point_purple_op20">
                        파일 업로드
                      </div>
                    </Menu.Item>
                    <Menu.Item>
                      <div className="block px-4 py-2 text-xs cursor-pointer text-white hover:bg-point_purple_op20">
                        폴더 업로드
                      </div>
                    </Menu.Item>
                    <Menu.Item>
                      <div className="block px-4 py-2 text-xs cursor-pointer text-white hover:bg-point_purple_op20">
                        zip 파일로 다운로드
                      </div>
                    </Menu.Item>
                    <Menu.Item>
                      <div className="block px-4 py-2 text-xs cursor-pointer text-white hover:bg-point_purple_op20">
                        이름 바꾸기
                      </div>
                    </Menu.Item>
                    <Menu.Item>
                      <div className="block px-4 py-2 text-xs cursor-pointer text-white hover:bg-point_purple_op20">
                        삭제
                      </div>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <div className="text-xs" style={{ padding: 15 }}>
          <hr
            className="bg-component_dark border-0 m-0 absolute min-h-[3px]"
            style={{ height: 3, width: 292, top: 140, left: 88 }}
          />
          <div>뭐야 왜 이거 없으면 안보여?</div>
          <FillFlexParent>
            {({ width, height }) => {
              return (
                <Tree
                  // initialData={dirData}
                  // initialData={curItems}
                  data={curItems}
                  width={width}
                  // height={height}
                  height={600}
                  rowHeight={32}
                  renderCursor={Cursor}
                  searchTerm={term}
                  paddingBottom={32}
                >
                  {Node}
                </Tree>
              );
            }}
          </FillFlexParent>
        </div>
      </DirectoryContainer>
    </>
  );
};

export default Directory;

// styled
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
