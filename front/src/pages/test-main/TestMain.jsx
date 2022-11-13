import React, { useState } from "react";
import styled from "styled-components";

import Header from "../../components/Header";
import Sidebar from "./components/sidebar/Sidebar";
import Directory from "./components/sidebar/Directory";
import Git from "./components/sidebar/Git";
import Team from "./components/sidebar/Team";
import Api from "./components/sidebar/Api";
import VariableName from "./components/sidebar/VariableName";
import Settings from "./components/sidebar/Settings";

const TestMain = () => {
  const [showItem, setShowItem] = useState("Dir");

  const showItemHandler = (componentName) => setShowItem(componentName);

  return (
    <React.Fragment>
      <Header />
      <div className="flex">
        <div className="flex">
          <Sidebar clickIcon={showItemHandler} showItem={showItem} />
          {showItem && (
            <SidebarItems>
              {showItem === "Dir" && <Directory />}
              {showItem === "Git" && <Git />}
              {showItem === "Team" && <Team />}
              {showItem === "Api" && <Api />}
              {showItem === "Var" && <VariableName />}
              {showItem === "Set" && <Settings />}
            </SidebarItems>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default TestMain;

const SidebarItems = styled.div`
  width: 292px;
  min-width: 0px;
  height: 100vh;
  margin-left: 3px;
`;
