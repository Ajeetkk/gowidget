import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Modal, Button,AutoComplete } from "../../widget-controls/constants";
import "./default-servicepartner.scss";
import { Icons } from "../../widget-controls/constants";

export default function DefaultServicePartnerView(props) {  
  return (
    <div className="pagewrapper col-6 default-service">
      <Row className="subHeader">
        <Col md={8}>
          <h4>Default service Partner</h4>
        </Col>
        <Col md={4} className="text-right">
          <Button
            btnClicked={props.openChangePopup}
            btnClass="custom-btn primary-btn"
            TextValue="Change"
          ></Button>
        </Col>
      </Row>
      <Row className="service-content m-0">
        <h2>{props.Name}</h2>
        <Row>
          <Col className="service-icon">
            <Icons IconName={"mapIcon"} />
          </Col>
          <Col md={6}>
            <p>
              <span>{props.Address}</span>
              <span>{props.City}</span>
            </p>
            <p>
              <span>{props.PostalCode}</span>
              <span className="service-country">{props.Country}</span>
            </p>
          </Col>
          <Col className="service-icon">
            <Icons IconName={"callIcon"} />
          </Col>
          <Col md={4} className="service-contact">
            <p>{props.Contact}</p>
          </Col>
        </Row>
      </Row>
      <Modal
        showPopup={props.ShowChangePopup}
        closePopup={props.closeChangePopup}
        modalTitle="Change default service partner"
        modalBtnSave="Save"
        modalBtnClose="Cancel"
        savePopup = {props.ChangeServicePartner}        
      >
        <div className="service-modal">
          <p>Select the default service partner.</p>
          <AutoComplete id="service-partner"  labelKey='Name' options={props.ServicePartnersList} minLength={2} filterBy ={['Name']} onChange = {props.onChange} />
        </div>
      </Modal>
    </div>
  );
}
