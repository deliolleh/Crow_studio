import React from "react";

const DirectoryListItem = ({ item, onClickItem, onRename, onDelete }) => {
  const { path, name, type } = item;

  const showContentHandler = () => onClickItem(path, type);

  const rightClickHandler = (e) => {
    e.preventDefault();
    console.log("right click");
  };

  const renameHandler = () => onRename(path, name);

  const deleteHandler = () => onDelete(path, type, name);

  return (
    <div
      className="flex gap-1 cursor-pointer text-white"
      onClick={showContentHandler}
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
