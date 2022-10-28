import React, { useState } from "react";

import Profile from "./Profile";
import Project from "./Project";
import Modify from "./Modify";

const Mypage = () => {
  const [isModify, setIsModify] = useState(false);

  const modifyHandler = (isOpen) => {
    setIsModify(isOpen);
  };

  return (
    <section className="flex">
      <Profile openModify={modifyHandler} />
      {!isModify && <Project />}
      {isModify && <Modify closeModify={modifyHandler} />}
    </section>
  );
};

export default Mypage;
