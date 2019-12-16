import React, { useState, useEffect, useMemo } from 'react'
import { Modal } from '../widget-controls/constants';
import InviteUser from './user.invite';
import AssignRole from './user.assignrole';

export default function UserPopups(props) {
    // Export Props
    const [disableButton, setDisable] = useState(true);
    const [checked, setChecked] = useState(true);
    const [isExportAll, changeExportAll] = useState(false);
    const [exportColumnList, setColumns] = useState([
        { name: 'Name', isActive: false },
        { name: 'Contact', isActive: false },
        { name: 'Type', isActive: false },
        { name: 'Company', isActive: false },
        { name: 'Role', isActive: false }
    ]);

    // Invite user Props
    const [IsInvalidEmail, changeEmail] = useState(false);
    const [EmailErrorText, setErrorText] = useState('');
    const [LstEmail, setEmails] = useState([]);

    // Roles
    const [roleList, setRole] = useState([]);


    const validateEmail = (isValid, errText, lstEmail) => {
        changeEmail(isValid);
        setErrorText(errText);
        setEmails(lstEmail);
        // 
        if (isValid) {
            setDisable(true);
        } else {
            if (roleList.length === 0) {
                setDisable(true);
            } else {
                setDisable(false);
            }
        }
    }

    const selectedRole = (lstRole) => {
        setRole(lstRole);
        if (props.PopupName === 'Invite') {
            if (!IsInvalidEmail && LstEmail.length > 0) {
                setDisable(false);
            } else {
                setDisable(true);
            }
        } else {
            setDisable(false);
        }
    }

    const prepareRole = () => {
        let lstRole = [];
        props.FilterData[0].forEach(element => {
            lstRole.push(element);
        });
        return lstRole;
    }

    const inviteUserView = () => {
        return (<div>
            <InviteUser ValidateEmail={validateEmail} FilterData={props.FilterData} SelectedRole={selectedRole} />
        </div>)
    }

    const resendView = () => {
        return (<div>
            <p>An invitation email has already been sent to the user. Are you sure you want to resend invitation to {props.PopData.email}?</p>
        </div>)
    }

    const revokeView = () => {
        return (<div>
            <p>The user details will be removed and the user will have to register himself once the invitation is revoked. Are you sure you want to revoke the invitation to {props.PopData.email}?</p>
        </div>)
    }

    const deleteView = () => {
        return (<div>
            <p>Are you sure you want to deactivate {props.PopData.alternateEmail}?</p>
        </div>)
    }

    const exportView = () => {
        return (<div>
            <p className="mb-26">Please choose the fields you want to export.</p>
            <label className="checkBoxcontainer selectAll">
                <input type="checkbox" checked={isExportAll} />
                <span className="checkmark"></span>
                <span>SelectAll</span>
            </label>
            <React.Fragment> {
                exportColumnList.map((data, i) =>
                    <label className="checkBoxcontainer" key={i}>
                        <input type="checkbox" checked={data.isActive} />
                        <span className="checkmark"></span>
                        <span>{data.name}</span>
                    </label>
                )
            } </React.Fragment>
        </div >)
    }

    const roleView = () => {
        return (
            <div>
                <p className="mb-26">Please select the role:</p>
                <AssignRole roles={props.FilterData} SelectedRole={selectedRole} SelectedId={props.PopData.modules != null? props.PopData.modules[0].roles[0].id : 0} />
            </div>)
    }

    const savePopup = () => {
        if (props.PopupName === 'Invite') {
            let data = {
                emailIds: LstEmail,
                companyId: 2,
                roles: roleList
            }
            props.Submit(props.PopupName, data);
        } else if (props.PopupName === 'Role') {
            const data = { userId: props.PopData.userId, roles: roleList };
            props.Submit(props.PopupName, data);
        }
        else {
            props.Submit(props.PopupName, props.PopData);
        }
        setDisable(true);
    }

    const closePopup = () => {
        props.Close();
        setDisable(true);
    }

    const popupContent = () => {
        switch (props.PopupName) {
            case 'Resend':
                return (<React.Fragment> {resendView()} </React.Fragment>)
            case 'Reinvoke':
                return (<React.Fragment> {revokeView()} </React.Fragment>)
            case 'Deactivate':
                return (<React.Fragment> {deleteView()} </React.Fragment>)
            case 'Invite':
                return (<React.Fragment> {inviteUserView()} </React.Fragment>)
            case 'Export':
                return (<React.Fragment> {exportView()} </React.Fragment>)
            case 'Role':
                return (<React.Fragment> {roleView()} </React.Fragment>)
            default:
                return (<React.Fragment> </React.Fragment>)
                break;
        }
    }

    return (
        <React.Fragment>
            <Modal modalBtnClass="primary" size={"lg"} modalTitle={props.Title} modalBtnClose={props.CancelText} modalBtnSave={props.ConfirmText} showPopup={props.Show} disable={props.PopupName === 'Invite' || props.PopupName === 'Role' ? disableButton : false} closePopup={closePopup} savePopup={savePopup}>
                {popupContent()}
            </Modal>
        </React.Fragment>
    )
}
