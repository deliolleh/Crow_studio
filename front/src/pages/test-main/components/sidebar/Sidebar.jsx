import React, { useRef } from "react";
import styled from "styled-components";

// svg
import { ReactComponent as IcDirectory } from "../../../../assets/icons/ic_dir.svg";
import { ReactComponent as IcGit } from "../../../../assets/icons/ic_git.svg";
import { ReactComponent as IcTeam } from "../../../../assets/icons/ic_team.svg";
import { ReactComponent as IcApi } from "../../../../assets/icons/ic_api.svg";
import { ReactComponent as IcVar } from "../../../../assets/icons/ic_var.svg";
import { ReactComponent as IcSettings } from "../../../../assets/icons/ic_set.svg";

const Sidebar = ({ onClickIcon, showComponent }) => {
  const classRef = useRef(null);

  const addClassName = showComponent === "디렉토리" ? " activeIcon" : "";

  const clickHandler = (clickedName) => {
    const isContainsActiveIcon =
      classRef.current.classList.contains("activeIcon");
    if (clickedName === "디렉토리") {
      if (isContainsActiveIcon || showComponent === "디렉토리") {
        onClickIcon("");
      } else {
        onClickIcon("디렉토리");
      }
    } else if (clickedName === "깃") {
      if (isContainsActiveIcon || showComponent === "깃") {
        onClickIcon("");
      } else {
        onClickIcon("깃");
      }
    } else if (clickedName === "팀") {
      if (isContainsActiveIcon || showComponent === "팀") {
        onClickIcon("");
      } else {
        onClickIcon("팀");
      }
    } else if (clickedName === "api") {
      if (isContainsActiveIcon || showComponent === "api") {
        onClickIcon("");
      } else {
        onClickIcon("api");
      }
    } else if (clickedName === "변수명") {
      if (isContainsActiveIcon || showComponent === "변수명") {
        onClickIcon("");
      } else {
        onClickIcon("변수명");
      }
    } else if (clickedName === "세팅") {
      if (isContainsActiveIcon || showComponent === "세팅") {
        onClickIcon("");
      } else {
        onClickIcon("세팅");
      }
    }
  };

  return (
    <>
      <SidebarContainer
        className="ml-3 mb-3 bg-component_item_bg_dark"
        style={
          showComponent === ""
            ? { borderRadius: "10px" }
            : { borderRadius: "10px 0 0 10px" }
        }
      >
        <div>
          <ul className="pt-3.5">
            {/* Directory */}
            <ListHover
              className={`flex flex-col items-center py-0.5 ${addClassName}`}
              ref={classRef}
              onClick={() => clickHandler("디렉토리")}
            >
              <IcSpan>
                <IcDirectory alt="directory" />
              </IcSpan>
            </ListHover>

            {/* Git */}
            <ListHover
              className={
                "flex flex-col items-center py-0.5" +
                (showComponent === "깃" ? " activeIcon" : "")
              }
              ref={classRef}
              onClick={() => clickHandler("깃")}
            >
              <IcSpan>
                <IcGit alt="git" />
              </IcSpan>
            </ListHover>

            {/* Team */}
            <ListHover
              className={
                "flex flex-col items-center py-0.5" +
                (showComponent === "팀" ? " activeIcon" : "")
              }
              ref={classRef}
              onClick={() => clickHandler("팀")}
            >
              <IcSpan>
                <IcTeam alt="team" />
              </IcSpan>
            </ListHover>

            {/* API */}
            <ListHover
              className={
                "flex flex-col items-center py-0.5" +
                (showComponent === "api" ? " activeIcon" : "")
              }
              ref={classRef}
              onClick={() => clickHandler("api")}
            >
              <IcSpan>
                <IcApi alt="api" />
              </IcSpan>
            </ListHover>

            {/* Variable Name */}
            <ListHover
              className={
                "flex flex-col items-center py-0.5" +
                (showComponent === "변수명" ? " activeIcon" : "")
              }
              ref={classRef}
              onClick={() => clickHandler("변수명")}
            >
              <IcSpan>
                <IcVar alt="variable name" />
              </IcSpan>
            </ListHover>

            {/* Settings */}
            <ListHover
              className={
                "flex flex-col items-center py-0.5" +
                (showComponent === "세팅" ? " activeIcon" : "")
              }
              ref={classRef}
              onClick={() => clickHandler("세팅")}
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
