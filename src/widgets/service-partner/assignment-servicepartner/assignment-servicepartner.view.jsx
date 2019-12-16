import React, { useState} from "react";
import { Row, Col, Collapse } from "react-bootstrap";
import { Modal, Table, Button, Icons,AutoComplete } from "../../widget-controls/constants";
import "./assignment-servicepartner.scss";
export default function AssignmentServicePartnerView(props) {  
  const [showBulk, ShowBulkModal] = useState(false);
  const handleBulk = () => ShowBulkModal(true);
  const handleBulkClose = () => ShowBulkModal(false);
  const [setToggle, setToggleShow] = useState(true);
  const [open, setOpen] = useState(true);

  const [Search, setSearch] = useState("");
  const _handleKeyDown = e => {
    if (e.key === "Enter") {
      props.search(Search);
    }
  };
  const handleSearchBtn = e => {    
      props.search(Search);    
  };

  const _clearSearch = () => {
    setSearch('');
    props.search('');
  }

  return (
    <div className="col-5 assign-service">
      <Row className="sub-header">
        <Col md={10}>
          <h4>Service partner assignment</h4>
        </Col>
        <Col md={2}>
          <span className="collapseBtn" onClick={() => setOpen(!open)}>
            <Icons IconName={!open ? "collapseRevIcon" : "collapseIcon"} />
          </span>
        </Col>
      </Row>
      {open && (
        <>
          <Row className="assign-service-view">
            <Col md={9} className="searchwrapper">
              <input
                type="textbox"
                value={Search}
                onChange={event => setSearch(event.target.value)}
                onKeyDown={_handleKeyDown}
                className="searchBox"
                placeholder="Search"
              />
              {Search.length === 0 ? (
                <button
                  _ngcontent-atc-c2=""
                  className="searchBtn search-icon"
                  type="button"
                  onClick={handleSearchBtn}
                >
                  <Icons IconName={"searchIcon"} />
                </button>
              ) : (
                <button
                  _ngcontent-atc-c2=""
                  onClick={_clearSearch}
                  className="searchBtn search-icon"
                  type="button"
                >
                  <Icons IconName={"closeIcon"} />
                </button>
              )}
            </Col>
            <Col md={3}>
              <Button
                btnClicked={handleBulk}
                btnClass="custom-btn primary-btn bulk-btn"
                TextValue="Bulk assign"
              ></Button>
            </Col>
          </Row>
          <Table {...props} />
        </>
      )}

      <Modal
        showPopup={showBulk}
        closePopup={handleBulkClose}
        modalTitle="Assign additional service partner"
        modalBtnSave="Assign"
        modalBtnClose="Cancel"
        size={"lg"}
      >
        <div className="service-modal">
          <p>
            Select the additional service partner you wish to assign to {} asset
            name.
          </p>
          <div className="service-textarea">
            {/* <AutoComplete id="service-partner" placeholder="" labelKey='Name' options={this.state.LstServicePartners} minLength={2} filterBy ={['Name']}/>
             */}
          </div>
        </div>
      </Modal>
    </div>
  );
}
