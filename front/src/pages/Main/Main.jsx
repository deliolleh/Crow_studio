import React, { useState } from "react";
import styled from "styled-components";

// components
import Sidebar from "./components/Sidebar";
import Directory from "./components/Directory";
// import Git from "./components/Git";
// import Team from "./components/Team";
// import Settings from "./components/Settings";

const SidebarItems = styled.div`
  width: 292px;
  height: 100vh;
  margin-left: 3px;
`

const Main = () => {
  return (
    <>
      <div className="flex">
        <Sidebar />
        <SidebarItems>
          <Directory />
        </SidebarItems>
      </div>
    </>
  )
}

export default Main;