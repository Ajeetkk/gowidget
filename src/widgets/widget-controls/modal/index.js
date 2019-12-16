import React from "react";
import { Modal } from "react-bootstrap";
import Button from "../button/index";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";

const ModalPopup = props => {
  return (
    <div className="modal-popup">
      <Modal
        show={props.showPopup}
        onHide={props.closePopup}
        className="modal-popup"
        size={props.size}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{props.modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.children}</Modal.Body>
        <Modal.Footer>
          <Button
            TextValue={props.modalBtnClose}
            btnClicked={props.closePopup}
            btnClass="custom-btn reset-btn"
            disabled={false}
          />
          {
            props.nextModalPopup ? 
              <Button
                TextValue={props.modalBtnSave}
                btnClicked={ props.nextModalPopup }
                btnClass="custom-btn primary-btn"            
              />
            : 
              <Button
                TextValue={props.modalBtnSave}                
                btnClicked={props.savePopup}
                btnClass="custom-btn primary-btn"            
              />
          }          
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default ModalPopup;
