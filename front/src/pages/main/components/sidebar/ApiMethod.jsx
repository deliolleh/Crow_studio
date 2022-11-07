import React from "react";

const SelectMethod = ({ onMethodChange }) => {
  return (
    <select onChange={onMethodChange} defaultValue="GET">
      <option value="GET">GET</option>
      <option value="POST">POST</option>
      <option value="PUT">PUT</option>
      <option value="DELETE">DELETE</option>
    </select>
  );
};

export default SelectMethod;
