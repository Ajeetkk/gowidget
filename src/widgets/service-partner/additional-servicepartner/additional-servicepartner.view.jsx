import React, { useState } from "react";
import { Row, Col, Collapse } from "react-bootstrap";
import { Modal, Table, Button,AutoComplete, Icons } from "../../widget-controls/constants";
import "./additional-servicepartner.scss";
export default function AdditionalServicePartnerView(props) { 
  const [open, setOpen] = useState(true);    
  let placeholder = 'Search by partner name, address, city or postal code';  
  return (    
    <div className="pagewrapper">
      <Row className="subHeader">
        <Col md={6}>
          <h4>Additional service partners</h4>
      </Col>
        <Col md={6} className="searchwrapper">
          <Button
            btnClicked={props.openAddPopup}
            btnClass="btn btn-primary"
            TextValue="Add service partner"
          ></Button>
          <span className="collapseBtn" onClick={() => setOpen(!open)}><Icons IconName={!open? "collapseRevIcon" : "collapseIcon"} /></span>
        </Col>
      </Row>
      <Collapse in={open}>
        <div className="m-0">
          <div className="col-xs-12 col-sm-12 p-0 d-flex addServicePartner">
            <div className="commonGrid">
              <Table {...props} />
            </div>
          </div>
          </div>
      </Collapse>
      <Modal
        showPopup={props.showAddPopup}
        closePopup={props.closeAddPopup}
        modalTitle="Add service partner"
        modalBtnSave="Add"
        modalBtnClose="Cancel"
        savePopup = {props.addServicePartner}
        size={"lg"}
      >
        <div className="service-modal">
          <p className="formLabel">Select the additional service partner.</p>
          <AutoComplete id="service-partner" placeholder= {placeholder} labelKey='Name' options={props.ServicePartnersList} minLength={2} filterBy ={['Name','address']} onChange = {props.onChange}/>
        </div>
      </Modal>
      <Modal
        showPopup={props.isDeleteClicked}
        closePopup={props.setDeletePopup}
        modalTitle="Delete service Partner"
        modalBtnSave="Yes"
        modalBtnClose="No"
        savePopup = {props.deleteServicePartner}
        size={"lg"}
      >
        <div className="service-modal">
          <p>Are you sure you want to remove {props.ServicePartnerName}</p>          
        </div>
      </Modal>
    </div>
  );
}
