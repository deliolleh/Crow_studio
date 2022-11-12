import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import fileApi from "../../api/fileApi";

import Header from "../../components/Header";

const Test = () => {
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <Header />
    </React.Fragment>
  );
};

export default Test;
