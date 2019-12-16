import React, { useState } from 'react';
import { Row, Col, Button, Collapse } from "react-bootstrap";
import { AutoComplete, Table, Icons, Modal } from '../widget-controls/constants';
import "./engine.scss";
export default function EngineView(props) {
    const [open, setOpen] = useState(true);
    const [Search, setSearch] = useState('');
    const _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            props.search(Search);
        }
    }

    return (
        <div className="pagewrapper">
            <Row className="subHeader">
                <Col md={3}>
                    <h4>Unassigned engines</h4>
                </Col>
                <Col md={9} className="searchwrapper">
                    <div className="searchboxWrapper w-65">
                        <input type="textbox" value={Search}
                            onChange={event => setSearch(event.target.value)} onKeyDown={_handleKeyDown} className="searchBox" placeholder="Search by serial number, engine name or model number" />
                        <button className="searchBtn search-icon" type="button">
                            <Icons IconName={"searchIcon"} />
                        </button>
                    </div>
                    <span className="collapseBtn m-0" onClick={() => setOpen(!open)}><Icons IconName={!open ? "collapseRevIcon" : "collapseIcon"} /></span>
                </Col>
            </Row>
            <Collapse in={open}>
                <div className="m-0">
                    <div className="col-xs-12 col-sm-12 p-0 d-flex unAssignedEngines">
                        <div className="commonGrid">
                            <Table {...props} />
                        </div>
                    </div>
                </div>
            </Collapse>
                <Modal
                    showPopup={props.isAssingClicked}
                    closePopup={props.assingClicked}
                    modalTitle="Assign Engine"
                    modalBtnSave="Assign"
                    modalBtnClose="Cancel"
                    savePopup={props.assingEngine}
                    size={"lg"}
                >
                    <div className="service-modal">
                        <p className="formLabel">Select an asset to move the engine to</p>
                        <AutoComplete id="assetEngine-list" labelKey='name' options={props.assetList} minLength={2} filterBy={['name']} onChange={props.selectedAsset} />
                    </div>
                </Modal>
        </div>
    )
}
