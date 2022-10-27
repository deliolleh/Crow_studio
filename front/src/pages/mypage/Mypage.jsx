import React from "react";

import Profile from "./Profile";
import Project from "./Project";

const Mypage = () => {
  return (
    <section className="flex">
      <Profile />
      <Project />
    </section>
  );
};

export default Mypage;
