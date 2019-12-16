import React from "react";
import "./index.scss";

const TextBox = props => {
  return (
    <input
      type="text"
      className={props.textBoxClass}
      placeholder={props.placeHolder}
      value={props.textBoxValue}
      id={props.textBoxId}
      maxLength={props.maxLength}
    />
  );
};

// Textbox.propTypes = {
//   btnClass: PropTypes.string.isRequired,
//   TextValue: PropTypes.string.isRequired
// };

export default TextBox;
