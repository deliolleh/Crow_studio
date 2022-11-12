import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import fileApi from "../../api/fileApi";
import projectApi from "../../api/projectApi";

import Header from "../../components/Header";

const Test = () => {
  const dispatch = useDispatch();

  const teamSeq = 3;
  const type = 2;
  const fileData = {
    fileTitle: "test.py",
    filePath: "/home/ubuntu/crow_data/3",
  };

  const directoryData = {
    rootPath: `/home/ubuntu/crow_data/${teamSeq}`,
    rootName: ``,
  };

  useEffect(() => {
    // fileApi
    //   .fileCreate(teamSeq, type, fileData)
    //   .then(console.log)
    //   .catch(console.error);
    projectApi
      .directoryList(directoryData)
      .then(console.log)
      .catch(console.error);
  }, []);

  return (
    <React.Fragment>
      <Header />
    </React.Fragment>
  );
};

export default Test;
