import React from "react";
import "./index.scss";

const Radio = props => {
  return (
    <div className="container-radio">
     {props.name}
      <input
        onChange={props.radioBtnValue}
        name={props.name}
        value={props.code}
        id={props.radioBtnID}
        type="radio"
      />
      <span className="checkmark"></span>
    </div>
  );
};

export default Radio;
