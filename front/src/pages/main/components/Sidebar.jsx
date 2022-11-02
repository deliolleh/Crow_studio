import React from "react";
import styled from "styled-components";

// svg
import { ReactComponent as IcDirectory } from "../../../assets/icons/ic_dir.svg"
import { ReactComponent as IcGit } from "../../../assets/icons/ic_git.svg"
import { ReactComponent as IcTeam } from "../../../assets/icons/ic_team.svg"
import { ReactComponent as IcSettings } from "../../../assets/icons/ic_set.svg"

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
    border-left: 4px solid #D4A8E3;

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

const Sidebar = () => {
  return (
    <>
      <SidebarContainer className="ml-3 mb-3 bg-component_item_bg_dark">
        <div>
          <ul className="pt-3.5">
            <ListHover className="flex flex-col items-center py-0.5">
              <IcSpan>
                <IcDirectory alt="directory" />
                {/* <span>Directory</span> */}
              </IcSpan>
            </ListHover>
            <ListHover className="flex flex-col items-center py-0.5">
              <IcSpan>
                <IcGit alt="git" />
                {/* <span>Git</span> */}
              </IcSpan>
            </ListHover>
            <ListHover className="flex flex-col items-center py-0.5">
              <IcSpan>
                <IcTeam alt="team" />
                {/* <span>Team</span> */}
              </IcSpan>
            </ListHover>
            <ListHover className="flex flex-col items-center py-0.5">
              <IcSpan>
                <IcSettings alt="settings" />
                {/* <span>Settings</span> */}
              </IcSpan>
            </ListHover>
          </ul>
        </div>
      </SidebarContainer>
    </>
  )
}

export default Sidebar;