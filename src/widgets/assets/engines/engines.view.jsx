import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from "react-bootstrap";
import { Table, Modal, AutoComplete } from '../../widget-controls/constants';

import "../assets.scss";
export default function EnginesView(props) {
    const [EngineName, setEngineName] = useState(props.selectedEngine.deviceName);
    const [SerialNumber, setSerialNumber] = useState(props.selectedEngine.serialNumber);
    const [ModelNumber, setModelNumber] = useState(props.selectedEngine.modelNumber);
    const [OperatingHours, setOperatingHours] = useState(props.selectedEngine.operatingHours);
    useEffect(() => {
        setEngineName(props.selectedEngine.deviceName);
        setSerialNumber(props.selectedEngine.serialNumber);
        setModelNumber(props.selectedEngine.modelNumber);
        setOperatingHours(props.selectedEngine.operatingHours);
    }, [props.selectedEngine]);

    const updateEngineDetails = () => {
        props.editEngine(EngineName, SerialNumber, ModelNumber, OperatingHours);
    };

    const noEnginesText = "No engines found. Click on other assets to view engines.";
    return (
        <div className="engineView">
            <div className="engineViewHeading">
                <span className="engineTitle">Engine Details</span>
                <Button type="button" className="closeEngine" variant="link" onClick={() => props.showEngines(false)}> Close Engine Details </Button>
            </div>
            <div className="commonGrid">
                <Table IsClickable={false} noRecordsText={noEnginesText} {...props} ActionButton={props.ActionButton} />
            </div>
            <Modal
                showPopup={props.isUnassignedEngineClicked}
                closePopup={props.setUnassignEnginePopup}
                modalTitle="Unassigne Engine"
                modalBtnSave="Yes"
                modalBtnClose="No"
                savePopup={props.unassigneEngine}
                size={"lg"}
            >
                <div className="service-modal">
                    <p>Are you sure you want to unassign engine "{props.selectedEnginename}"?</p>
                </div>
            </Modal>
            <Modal
                showPopup={props.isAssignedEngineClicked}
                closePopup={props.setAssignEnginePopup}
                modalTitle="Reassign Engine"
                modalBtnSave="Assign"
                modalBtnClose="Cancel"
                savePopup={props.assigneEngine}
                size={"lg"}
            >
                <div className="service-modal">
                    <p>Select an asset to move the engine to</p>
                    <AutoComplete id="allAssets" labelKey='name' options={props.myAssetList}
                        minLength={2} filterBy={['name']} onChange={props.change} />
                </div>
            </Modal>
            <Modal
                showPopup={props.isEditEngineClicked}
                closePopup={props.setEditPopup}
                modalTitle="Edit Engine"
                modalBtnSave="Save"
                modalBtnClose="Cancel"
                savePopup={updateEngineDetails}
                size={"lg"}
            >
                <div className="service-modal">
                    <p className= "formLabel">Engine name </p>
                    <input type="textbox" value={EngineName} onChange={event => setEngineName(event.target.value)} />
                    <p className= "formLabel">Engine model</p>
                    <input type="textbox" value={ModelNumber} onChange={event => setModelNumber(event.target.value)} />
                    {!props.selectedEngine.isConnected && <div class="row"> <div class="col-sm-5">
                    <p className= "formLabel">Serial Number</p>
                    <input type="textbox" className="m-0" value={SerialNumber} onChange={event => setSerialNumber(event.target.value)} />
                    </div>
                    <div class="col-sm-5">
                    <p className= "formLabel">Operating hours</p>
                    <input type="textbox" className="m-0" value={OperatingHours} onChange={event => setOperatingHours(event.target.value)} />
                    </div>
                    <div class="col-sm-2 pl-0">
                        <span className="hrsTxt">hours</span>
                    </div>
                    </div>}
                </div>
            </Modal>
        </div >
    )
}
