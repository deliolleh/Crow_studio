import React, { useEffect, useRef } from "react";
import styled from "styled-components";

// svg
import { ReactComponent as IcDirectory } from "../../../../assets/icons/ic_dir.svg";
import { ReactComponent as IcGit } from "../../../../assets/icons/ic_git.svg";
import { ReactComponent as IcTeam } from "../../../../assets/icons/ic_team.svg";
import { ReactComponent as IcApi } from "../../../../assets/icons/ic_api.svg";
import { ReactComponent as IcVar } from "../../../../assets/icons/ic_var.svg";
import { ReactComponent as IcSettings } from "../../../../assets/icons/ic_set.svg";

const SidebarContainer = styled.div`
  border-radius: 10px 0 0 10px;
  width: 73px;
  min-width: 73px;
  max-width: 73px;
  height: 100vh;
`;
const ListHover = styled.li`
  cursor: pointer;

  &:hover {
    border-left: 4px solid #d4a8e3;
    & svg {
      & path {
        fill: white;
      }
    }
  }
  &.activeIcon {
    border-left: 4px solid #d4a8e3;
    & svg {
      & path {
        fill: white;
      }
    }
  }
`;
const IcSpan = styled.span`
  padding: 15px 0px;
`;

const Sidebar = ({ onClickIcon, com }) => {
  const classRef = useRef(null);

  // useEffect(() => {
  // console.log("className: ", classRef.current.className);
  // 👇️ check if element contains class
  // if (classRef.current.classList.contains("activeIcon")) {
  //   console.log("Element contains class");
  // } else {
  //   console.log("Element does NOT contain class");
  // }
  // }, []);

  return (
    <>
      <SidebarContainer
        className="mb-3 bg-component_item_bg_dark"
        style={
          com === ""
            ? { borderRadius: "10px" }
            : { borderRadius: "10px 0 0 10px" }
        }
      >
        <div>
          <ul className="pt-3.5">
            <ListHover
              className={
                "flex flex-col items-center py-0.5" +
                (com === "디렉토리" ? " activeIcon" : "")
              }
              onClick={() => {
                if (
                  classRef.current.classList.contains("activeIcon") ||
                  com === "디렉토리"
                ) {
                  onClickIcon("");
                  console.log(com);
                } else {
                  onClickIcon("디렉토리");
                  console.log(com);
                }
              }}
              ref={classRef}
            >
              <IcSpan>
                <IcDirectory alt="directory" />
              </IcSpan>
            </ListHover>
            <ListHover
              className={
                "flex flex-col items-center py-0.5" +
                (com === "깃" ? " activeIcon" : "")
              }
              onClick={() => {
                if (
                  classRef.current.classList.contains("activeIcon") ||
                  com === "깃"
                ) {
                  onClickIcon("");
                  console.log(com);
                } else {
                  onClickIcon("깃");
                  console.log(com);
                }
              }}
              ref={classRef}
            >
              <IcSpan>
                <IcGit alt="git" />
              </IcSpan>
            </ListHover>
            <ListHover
              className={
                "flex flex-col items-center py-0.5" +
                (com === "팀" ? " activeIcon" : "")
              }
              onClick={() => {
                if (
                  classRef.current.classList.contains("activeIcon") ||
                  com === "팀"
                ) {
                  onClickIcon("");
                  console.log(com);
                } else {
                  onClickIcon("팀");
                  console.log(com);
                }
              }}
              ref={classRef}
            >
              <IcSpan>
                <IcTeam alt="team" />
              </IcSpan>
            </ListHover>
            <ListHover
              className={
                "flex flex-col items-center py-0.5" +
                (com === "api" ? " activeIcon" : "")
              }
              onClick={() => {
                if (
                  classRef.current.classList.contains("activeIcon") ||
                  com === "api"
                ) {
                  onClickIcon("");
                  console.log(com);
                } else {
                  onClickIcon("api");
                  console.log(com);
                }
              }}
              ref={classRef}
            >
              <IcSpan>
                <IcApi alt="api" />
              </IcSpan>
            </ListHover>
            <ListHover
              className={
                "flex flex-col items-center py-0.5" +
                (com === "변수명" ? " activeIcon" : "")
              }
              onClick={() => {
                if (
                  classRef.current.classList.contains("activeIcon") ||
                  com === "변수명"
                ) {
                  onClickIcon("");
                  console.log(com);
                } else {
                  onClickIcon("변수명");
                  console.log(com);
                }
              }}
              ref={classRef}
            >
              <IcSpan>
                <IcVar alt="variable name" />
              </IcSpan>
            </ListHover>
            <ListHover
              className={
                "flex flex-col items-center py-0.5" +
                (com === "세팅" ? " activeIcon" : "")
              }
              onClick={() => {
                if (
                  classRef.current.classList.contains("activeIcon") ||
                  com === "세팅"
                ) {
                  onClickIcon("");
                  console.log(com);
                } else {
                  onClickIcon("세팅");
                  console.log(com);
                }
              }}
              ref={classRef}
            >
              <IcSpan>
                <IcSettings alt="settings" />
              </IcSpan>
            </ListHover>
          </ul>
        </div>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
