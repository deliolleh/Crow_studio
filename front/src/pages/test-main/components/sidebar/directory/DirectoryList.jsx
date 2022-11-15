import React from "react";

import DirectoryListItem from "./DirectoryListItem";

const DirectoryList = ({ curItems, onClickItem, onRename, onDelete }) => {
  return (
    <div className="flex flex-col text-base">
      {curItems.map((item) => (
        <DirectoryListItem
          key={item.path}
          item={item}
          onClickItem={onClickItem}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DirectoryList;
