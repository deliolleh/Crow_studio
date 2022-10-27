import React from "react";
import styled from "styled-components";

//import svg
import { ReactComponent as IcNewFile } from "../../../assets/icons/ic_new_file.svg";
import { ReactComponent as IcNewDir } from "../../../assets/icons/ic_new_dir.svg";
import {ReactComponent as IcToggle } from "../../../assets/icons/ic_toggle.svg"

const DirectoryContainer = styled.div`
  border-radius: 0 10px 10px 0;
  height: 100vh;
`;
const IcSpan = styled.span`
  padding: 0.5rem;

  &:hover {
    background-color: #D9D9D9;
    border-radius: 5px;

    & svg {
      & path {
        fill: #2B2C2B;
      }
    }  
  }
`;

const Directory = () => {
  return (
    <>
      <DirectoryContainer className="mb-3 bg-component_item_bg_dark flex flex-col">
        <div className="flex justify-between items-center" style={{ padding: 15 }}>
          <div className="text-xl font-bold text-white">Directory</div>
          <div className="mt-1 flex items-center">
            <IcSpan>
              <IcNewFile alt="IcNewFile" />
            </IcSpan>
            <IcSpan>
              <IcNewDir alt="IcNewDir" />
            </IcSpan>
            <IcSpan>
              <IcToggle alt="IcToggle" />
            </IcSpan>
          </div>
        </div>
        <hr className="bg-component_dark border-0 m-0" style={{ height: 3 }} />
        <div className="" style={{ padding: 15 }}>여기 폴더 구조</div>
      </DirectoryContainer>
    </>
  )
}

export default Directory;