import React from "react";
import PropTypes from "prop-types";
import { Typeahead } from "react-bootstrap-typeahead";

const AutoComplete = props => {
  return (
    <Typeahead id={props.id} placeholder= {props.placeholder} multiple = {props.multiple} onChange={props.onChange} labelKey={props.labelKey} options={props.options} minLength={props.minLength} filterBy ={props.filterBy}/>
  );
};

AutoComplete.propTypes = {
  id: PropTypes.string.isRequired,
  labelKey: PropTypes.string.isRequired,
  options:PropTypes.array.isRequired,  
};

export default AutoComplete;