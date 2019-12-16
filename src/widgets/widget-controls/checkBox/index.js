import React from "react";
import "./index.scss";

const CheckBox = props => {
  return (
    <div className="checkBoxcontainer">
      <input
        onChange={props.checkBoxValue}
        name=""
        value=""
        id={props.checkBoxID}
        type="checkbox"
      />
      <span className="checkmark"></span>
      <label htmlFor={props.checkBoxID}>{props.labelName}</label>
    </div>
  );
};

export default CheckBox;
