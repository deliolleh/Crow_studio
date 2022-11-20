import React from "react";

import DirectoryListItem from "./DirectoryListItem";

const DirectoryList = (props) => {
  const { curItems, onOpenFile, onOpenFolder, onRename, onDelete } = props;
  return (
    <div className="flex flex-col text-base">
      {curItems.map((item) => (
        <DirectoryListItem
          key={item.path}
          item={item}
          onOpenFile={onOpenFile}
          onOpenFolder={onOpenFolder}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DirectoryList;
