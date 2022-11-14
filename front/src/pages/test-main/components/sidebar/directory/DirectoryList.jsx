import React from "react";

import DirectoryListItem from "./DirectoryListItem";

const DirectoryList = ({ curItems }) => {
  return (
    <React.Fragment>
      {curItems.map((item) => (
        <DirectoryListItem item={item} />
      ))}
    </React.Fragment>
  );
};

export default DirectoryList;
