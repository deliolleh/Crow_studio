import React from "react";

const DirectoryListItem = (props) => {
  const { item, onOpenFile, onOpenFolder, onRename, onDelete } = props;
  const { path, name, type } = item;

  const showContentHandler = () => onOpenFile(path, type);

  const showFolderHandler = () => onOpenFolder(name);

  const rightClickHandler = (e) => {
    e.preventDefault();
    console.log("right click");
  };

  const renameHandler = () => onRename(path, name);

  const deleteHandler = () => onDelete(path, type, name);

  return (
    <div
      className="flex gap-1 cursor-pointer text-white"
      onClick={type === "file" ? showContentHandler : showFolderHandler}
      onContextMenu={rightClickHandler}
    >
      <div>{type === "file" ? "🎃" : "🎁"}</div>
      <div>{name}</div>
      <div onClick={renameHandler}>✏</div>
      <div onClick={deleteHandler}>❌</div>
    </div>
  );
};

export default DirectoryListItem;
