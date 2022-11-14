import React, { useRef } from "react";
import styled from "styled-components";

// svg
import { ReactComponent as IcDirectory } from "../../../../assets/icons/ic_dir.svg";
import { ReactComponent as IcGit } from "../../../../assets/icons/ic_git.svg";
import { ReactComponent as IcTeam } from "../../../../assets/icons/ic_team.svg";
import { ReactComponent as IcApi } from "../../../../assets/icons/ic_api.svg";
import { ReactComponent as IcVar } from "../../../../assets/icons/ic_var.svg";
import { ReactComponent as IcSettings } from "../../../../assets/icons/ic_set.svg";

const Sidebar = ({ clickIcon, showItem }) => {
  const classRef = useRef(null);
  const activeIconDir = showItem === "Dir" ? " activeIcon" : "";
  const activeIconGit = showItem === "Git" ? " activeIcon" : "";
  const activeIconTeam = showItem === "Team" ? " activeIcon" : "";
  const activeIconApi = showItem === "Api" ? " activeIcon" : "";
  const activeIconVar = showItem === "Var" ? " activeIcon" : "";
  const activeIconSet = showItem === "Set" ? " activeIcon" : "";

  const clickHandler = (clickedName) => {
    const isActive = classRef.current.classList.contains("activeIcon");
    switch (clickedName) {
      case "Dir":
        isActive || showItem === "Dir" ? clickIcon("") : clickIcon("Dir");
        break;
      case "Git":
        isActive || showItem === "Git" ? clickIcon("") : clickIcon("Git");
        break;
      case "Team":
        isActive || showItem === "Team" ? clickIcon("") : clickIcon("Team");
        break;
      case "Api":
        isActive || showItem === "Api" ? clickIcon("") : clickIcon("Api");
        break;
      case "Var":
        isActive || showItem === "Var" ? clickIcon("") : clickIcon("Var");
        break;
      case "Set":
        isActive || showItem === "Set" ? clickIcon("") : clickIcon("Set");
        break;
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <SidebarContainer
        className="ml-3 mb-3 bg-component_item_bg_dark"
        style={
          showItem === ""
            ? { borderRadius: "10px" }
            : { borderRadius: "10px 0 0 10px" }
        }
      >
        <div>
          <ul className="pt-3.5">
            {/* Directory */}
            <ListHover
              className={`flex flex-col items-center py-0.5 ${activeIconDir}`}
              ref={classRef}
              onClick={() => clickHandler("Dir")}
            >
              <IcSpan>
                <IcDirectory alt="directory" />
              </IcSpan>
            </ListHover>

            {/* Git */}
            <ListHover
              className={`flex flex-col items-center py-0.5 ${activeIconGit}`}
              ref={classRef}
              onClick={() => clickHandler("Git")}
            >
              <IcSpan>
                <IcGit alt="git" />
              </IcSpan>
            </ListHover>

            {/* Team */}
            <ListHover
              className={`flex flex-col items-center py-0.5 ${activeIconTeam}`}
              ref={classRef}
              onClick={() => clickHandler("Team")}
            >
              <IcSpan>
                <IcTeam alt="team" />
              </IcSpan>
            </ListHover>

            {/* API */}
            <ListHover
              className={`flex flex-col items-center py-0.5 ${activeIconApi}`}
              ref={classRef}
              onClick={() => clickHandler("Api")}
            >
              <IcSpan>
                <IcApi alt="api" />
              </IcSpan>
            </ListHover>

            {/* Variable Name */}
            <ListHover
              className={`flex flex-col items-center py-0.5 ${activeIconVar}`}
              ref={classRef}
              onClick={() => clickHandler("Var")}
            >
              <IcSpan>
                <IcVar alt="variable name" />
              </IcSpan>
            </ListHover>

            {/* Settings */}
            <ListHover
              className={`flex flex-col items-center py-0.5 ${activeIconSet}`}
              ref={classRef}
              onClick={() => clickHandler("Set")}
            >
              <IcSpan>
                <IcSettings alt="settings" />
              </IcSpan>
            </ListHover>
          </ul>
        </div>
      </SidebarContainer>
    </React.Fragment>
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
