import React from "react";
import PropTypes from "prop-types";
import "./index.scss";

const Button = props => {
  return (
    <button onClick={props.btnClicked} className={props.btnClass} disabled={props.disable}>
      {props.TextValue}
    </button>
  );
};

Button.propTypes = {
  btnClass: PropTypes.string.isRequired,
  TextValue: PropTypes.string.isRequired
};

export default Button;
