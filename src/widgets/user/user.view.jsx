import React, { useState } from 'react';
import { Row, Col, Button } from "react-bootstrap";
import { Filter, Tab, Table, Icons } from '../widget-controls/constants';
import UserPopup from './user.popup';
import "./user.scss";
export default function UserView(props) {
    const [Search, setSearch] = useState('');
    const [popupName, setPopupName] = useState('');
    const _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            props.search(Search);
        }
    }

    const changeTab = (tabName) => {
        props.TabChange(tabName);
    }

    const onFilter = (filterData) => {
        props.Filter(filterData);
    }

    const openExportPopup = () => {
        props.ActionButton('Export', {});
    }

    const openInvitePopup = () => {
        props.ActionButton('Invite', {});
    }

    return (
        <div className="pagewrapper">
            <Row className="subHeader user-subHead">
                <Col md={3}>
                    <h4>Manage users</h4>
                </Col>
                <Col md={9} className="searchwrapper">
                    <div className="searchboxWrapper">
                        <input type="textbox" value={Search}
                            onChange={event => setSearch(event.target.value)} onKeyDown={_handleKeyDown} className="searchBox" placeholder="Search" />
                        <button _ngcontent-atc-c2="" className="searchBtn search-icon" type="button">
                            <Icons IconName={"searchIcon"} />
                        </button>
                    </div>
                    <Button variant="outline-primary" onClick={openExportPopup}>Export</Button>
                    <Button variant="primary" onClick={openInvitePopup}>Invite user</Button>
                </Col>
            </Row>
            <Filter Filter={onFilter} {...props} btnClass={"test"} TextValue={"test"} />
            <Tab Component={<div className={!props.IsActivated ? 'commonGrid' : 'commonGrid inactiveTable'}>
                <Table {...props} />
            </div>
            } TabButtons={props.TabButtons} ChangeTab={changeTab} />
            <UserPopup {...props} />
        </div >
    )
}
