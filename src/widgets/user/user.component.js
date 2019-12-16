import React from 'react'
import UserView from './user.view';
import UserService from '../service/userservice';
import { toast } from 'react-toastify';
import DefaultStrings from './config';

class UserComponent extends React.Component {
    constructor(props) {
        super(props);
        this.Url = "https://azeuw-apimhived01.azure-api.net/api/v1";
        this.userService = new UserService(this.Url);
        this.state = {
            Header: [],
            Body: [],
            Search: '',
            IsActive: true,
            Roles: 'GMUser,CompanyAdmin',
            PageSize: DefaultStrings.PageSize,
            Page: DefaultStrings.Page,
            Sort: DefaultStrings.SortActive,
            Show: false,
            Hide: false,
            RolesData: [],
            popupName: "",
            ConfirmText: DefaultStrings.Save,
            CancelText: DefaultStrings.Cancel,
            Title: "",
            PopupData: {}
        }
        this.tabs = [{ "Name": DefaultStrings.ActiveTab, "IsActive": true }, { "Name": DefaultStrings.InvitedTab, "IsActive": false }];
        this.IsActivated = false;
        this.nameSortOrder = '+';
        this.otherSortFieldName = '';
        this.otherSortFieldOrder = '';
        this.PageConfig = {
            PageCount: 0,
            PageSize: 0,
            CurrentPageNumber: 1
        };
    }

    componentDidMount() {
        this.loadRoles();
        let header = this.prepareActiveHeader();
        this.setState({ "Header": header });
        this.loadUsers(this.state.Page);
    }

    loadRoles() {
        this.userService.getUsersMasterRoles().then(data => {
            let userData = data;
            let roleData = [];
            userData.forEach(x => {
                if (x.name === DefaultStrings.AppName) {
                    x.modules.forEach(y => {
                        y.roles.forEach(z => {
                            if (z.name !== "Service Engineer") {
                                roleData.push({ "id": z.id, "name": z.name, "code": z.code });
                            }
                        });
                    });
                }
            });
            this.setState({ RolesData: [...this.state.RolesData, roleData] });
        });
    }

    loadUsers(page) {
        const config = {
            pagesize: this.state.PageSize,
            pageindex: page,
            types: '',
            roles: this.state.Roles,
            search: this.state.Search,
            sort: this.state.Sort,
            isActive: this.state.IsActive
        }
        this.userService.getAllUserList(config).then(data => {
            let userData = data.items;
            this.PageConfig.PageCount = data.count;
            this.PageConfig.PageSize = this.state.PageSize;
            let body = this.prepreActiveBody(userData);
            this.setState({ "Body": body });
        });
    }

    loadInviteUsers(page) {
        const config = {
            pagesize: this.state.PageSize,
            pageindex: page,
            types: '',
            roles: this.state.Roles,
            search: this.state.Search,
            sort: this.state.Sort,
            isActive: this.state.IsActive
        }
        this.userService.getInviteUsers(config).then(data => {
            let userData = data.items;
            this.PageConfig.PageCount = data.count;
            this.PageConfig.PageSize = this.state.PageSize;
            let body = this.prepareInviteBody(userData);
            this.setState({ "Body": body });
        });
    }

    SearchUser = (data) => {
        this.state.Search = data;
        this.setState({ Search: this.state.Search });
        this.setState({ "Page": 1 });
        if (this.IsActivated) {
            this.loadInviteUsers(this.state.Page);
        } else {
            this.loadUsers(this.state.Page);
        }
    }

    FilterUser = (data) => {
        let ids = [];
        data.forEach(x => {
            this.state.RolesData.forEach(y => {
                let data = y.filter(z => z.id == x.id);
                data.forEach(z => {
                    ids.push(z.code);
                });
            });
        });
        if (ids.length > 0) {
            this.state.Roles = ids;
        } else {
            this.state.Roles = 'GMUser,CompanyAdmin';
        }

        this.setState({ "Roles": this.state.Roles });
        this.setState({ "Page": 1 });
        if (this.IsActivated) {
            this.loadInviteUsers(this.state.Page);
        } else {
            this.loadUsers(this.state.Page);
        }
    }

    Sortuser = (th, i) => {
        if (th[i].IsSort) {
            if (th[i].IsDefault) {
                this.nameSortOrder === '+' ? this.nameSortOrder = '-' : this.nameSortOrder = '+';
                this.otherSortFieldName = '';
            } else {
                this.nameSortOrder = '+';
                if (this.otherSortFieldName !== th[i].SortText) {
                    this.otherSortFieldOrder = '';
                }
                this.otherSortFieldName = th[i].SortText;
                this.otherSortFieldOrder === '+'
                    ? this.otherSortFieldOrder = '-' : this.otherSortFieldOrder = '+';
            }

            // Change Class
            if (this.IsActivated) {
                let SortColumnName = this.otherSortFieldName ? this.otherSortFieldOrder + this.otherSortFieldName + "," + this.nameSortOrder + "EmailId"
                    : this.nameSortOrder + "EmailId:";
                this.state.Sort = SortColumnName;
                this.setState({ "Sort": SortColumnName });
                this.loadInviteUsers(this.state.Page);
            } else {
                let SortColumnName = !th[i].IsDefault ? "+IsApproved," + this.otherSortFieldOrder + this.otherSortFieldName + "," + this.nameSortOrder + "DisplayName"
                    : "+IsApproved," + this.nameSortOrder + th[i].SortText;
                this.state.Sort = SortColumnName;
                this.setState({ "Sort": SortColumnName });
                this.loadUsers(this.state.Page);
            }
            this.state.Header[i].ClassName = this.nameSortOrder === "+" ? 'sort-dec-order' : 'sort-asc-order';
            this.setState({ Header: this.state.Header });
        }
    }
    ChangePage = (number) => {
        this.state.Page = number;
        this.setState({ "Page": this.state.Page });
        if (this.IsActivated) {
            this.loadInviteUsers(this.state.Page);
        } else {
            this.loadUsers(this.state.Page);
        }

    }

    ChangeTab = (tabName) => {
        switch (tabName) {
            case 'Active':
                this.tabs = [{ "Name": DefaultStrings.ActiveTab, "IsActive": true }, { "Name": DefaultStrings.InvitedTab, "IsActive": false }];
                this.state.Sort = DefaultStrings.SortActive;
                this.state.IsActive = true;
                this.IsActivated = false;
                this.state.Page = 1;
                this.setState({ "Page": this.state.Page, "IsActive": this.state.IsActive, "Sort": this.state.Sort });
                let header = this.prepareActiveHeader();
                this.setState({ "Header": header });
                this.loadUsers(this.state.Page);
                break;
            case 'Invited':
                this.tabs = [{ "Name": DefaultStrings.ActiveTab, "IsActive": false }, { "Name": DefaultStrings.InvitedTab, "IsActive": true }];
                this.state.Sort = DefaultStrings.SortInvite;
                this.IsActivated = true;
                this.state.Page = 1;
                this.setState({ "Page": this.state.Page, "IsActive": false, "Sort": this.state.Sort });
                let header1 = this.prepareInviteHeader();
                this.setState({ "Header": header1 });
                this.loadInviteUsers(this.state.Page);
                break;
            default:
                break;
        }
    }

    actionButton = (actionType, data) => {
        switch (actionType) {
            case 'deleteIcon':
                this.openPopup(DefaultStrings.Deactivate, DefaultStrings.DeactivateHead, DefaultStrings.Yes, DefaultStrings.No, data);
                break;
            case 'revokeIcon':
                this.openPopup(DefaultStrings.Reinvoke, DefaultStrings.RevokeHead, DefaultStrings.Yes, DefaultStrings.No, data);
                break;
            case 'reloadIcon':
                this.openPopup(DefaultStrings.Resend, DefaultStrings.ResendHead, DefaultStrings.Yes, DefaultStrings.No, data);
                break;
            case 'Invite':
                this.openPopup(DefaultStrings.Invite, DefaultStrings.InviteUserHead, DefaultStrings.Invite, DefaultStrings.Cancel, data);
                break;
            case 'Export':
                this.openPopup(DefaultStrings.Export, DefaultStrings.ExportUserHead, DefaultStrings.Export, DefaultStrings.Cancel, data);
                break;
            case 'ActionClick':
                this.openPopup(DefaultStrings.Role, DefaultStrings.AssignRoleHead, DefaultStrings.Assign, DefaultStrings.Cancel, data);
                break;
            default:
                alert('Default');
                break;
        }
    }

    openPopup = (PopupName, Title, SubmitButtonTxt, CancelButtonTxt, data) => {
        this.state.popupName = PopupName;
        this.state.Title = Title;
        this.state.ConfirmText = SubmitButtonTxt;
        this.state.CancelText = CancelButtonTxt;
        this.state.PopupData = data;
        this.setState({ "PopupData": this.state.PopupData });
        this.setState({ "Show": true, "popupName": this.state.popupName, "Title": this.state.Title, "ConfirmText": this.state.ConfirmText, "CancelText": this.state.CancelText });
    }

    SubmitPopup = (actionType, data) => {
        switch (actionType) {
            case DefaultStrings.Deactivate:
                this.userService.deleteuser(data.id).then(data => {
                    if (data.status === DefaultStrings.SucessCode) {
                        this.loadUsers(this.state.Page);
                    }
                    this.ClosePopup();
                });
                break;
            case DefaultStrings.Reinvoke:
                this.userService.revokeInvite(data.userInvitationId).then(data => {
                    if (data.status === DefaultStrings.SucessCode) {
                        this.loadInviteUsers(this.state.Page);
                    }
                    this.ClosePopup();
                });
                break;
            case DefaultStrings.Resend:
                this.userService.resendInvite(data.userInvitationId).then(data => {
                    this.ClosePopup();
                });
                break;
            case DefaultStrings.Invite:
                const activeTabName = this.tabs.filter(x => x.IsActive);
                this.userService.inviteUser(data).then(data => {
                    if (data.status === DefaultStrings.SucessCode) {
                        this.ClosePopup();
                        if (activeTabName[0].Name === 'Active') {
                            this.loadUsers(this.state.Page);
                        } else {
                            this.loadInviteUsers(this.state.Page);
                        }
                    }
                })
                break;
            case DefaultStrings.Role:
                activeTabName = this.tabs.filter(x => x.IsActive);
                if (activeTabName[0].Name === 'Active') {
                    this.userService.updateRoles(data).then(data => {
                        this.ClosePopup();
                        if (data.status === DefaultStrings.SucessCode) {
                            this.loadUsers(this.state.Page);
                        }
                    });
                }
                else {
                    this.userService.updateInviteUserRoles(data).then(data => {
                        this.ClosePopup();
                        if (data.status === DefaultStrings.SucessCode) {
                            this.loadInviteUsers(this.state.Page);
                        }
                    });
                }
                break;
            default:
                alert('Default');
                break;
        }
    }

    ClosePopup = () => {
        this.setState({ "Show": false });
    }

    SelectedRow = (index) => {
        alert(index);
    }

    prepareActiveHeader() {
        // Prepare Head
        let lstHead = [];
        lstHead.push({ "Text": "", "IsDefault": false, "IsSort": false, "Type": "CheckBox", "ClassName": '' });
        lstHead.push({ "Text": "Name", "IsDefault": true, "IsSort": true, "Type": "Text", "SortText": "DisplayName", "ClassName": "sort-dec-order" });
        lstHead.push({ "Text": "Email", "IsDefault": false, "IsSort": true, "Type": "Text", "ClassName": '', "SortText": "alternateEmailId", "ClassName": "sort-order" });
        lstHead.push({ "Text": "Phone", "IsDefault": false, "IsSort": true, "Type": "Text", "ClassName": '', "SortText": "telephonenumber", "ClassName": "sort-order" });
        lstHead.push({ "Text": "Manage role", "IsDefault": false, "IsSort": false, "Type": "Text", "ClassName": '' });
        lstHead.push({ "Text": "Action", "IsDefault": false, "IsSort": false, "Type": "Text", "ClassName": '' });
        return lstHead;
    }

    prepreActiveBody(userData) {
        let lstBody = [];
        userData.forEach(e => {
            lstBody.push({ "body": [{ "Text": "", "Type": "CheckBox" }, { "Text": e.displayName, "Type": "Label" }, { "Text": e.alternateEmail, "Type": "Email" }, { "Text": e.telephoneNumber, "Type": "Telephone" }, { "Text": { "Text": this.prepeareUserView(e.modules), "Object": e }, "Type": "ActionClick" }, { "Text": { "Action": ["deleteIcon"], "Object": e }, "Type": "Icon" }] })
        });
        return lstBody;
    }

    prepareInviteHeader() {
        // Prepare Head
        let lstHead = [];
        lstHead.push({ "Text": "Email", "IsDefault": true, "IsSort": true, "Type": "Text", "SortText": "EmailId", "ClassName": "sort-order" });
        lstHead.push({ "Text": "Manage role", "IsDefault": false, "IsSort": true, "Type": "Text", "SortText": "EmailId", "ClassName": "sort-order" });
        lstHead.push({ "Text": "Action", "IsDefault": false, "IsSort": false, "Type": "Text", "ClassName": '' });
        return lstHead;
    }

    prepareInviteBody(userData) {
        let lstBody = [];
        userData.forEach(e => {
            lstBody.push({ "body": [{ "Text": e.email, "Type": "Email" }, { "Text": { "Text": this.prepeareUserView(e.modules), "Object": e }, "Type": "ActionClick" }, { "Text": { "Action": ["revokeIcon", "reloadIcon"], "Object": e }, "Type": "Icon" }] })
        });
        return lstBody;
    }

    prepeareUserView(modules) {
        let userViewString = '';
        if (modules != null) {
            modules.forEach(x => {
                if (x.name === DefaultStrings.ModuleName && x.roles.length > 0) {
                    x.roles.forEach(y => {
                        if (y.name !== "Service Engineer") {
                            userViewString += y.name + ',';
                        }
                    });
                }
            });
            userViewString = userViewString.slice(0, userViewString.length - 1);
        }
        else {
            userViewString = DefaultStrings.AssignRole;
        }
        return userViewString == '' ? DefaultStrings.AssignRole : userViewString;
    }
    render() {
        return (
            <div>
                <UserView header={this.state.Header} body={this.state.Body}
                    search={this.SearchUser} Filter={this.FilterUser} Sort={this.Sortuser}
                    Pagination={this.props.Pagination} TabButtons={this.tabs} TabChange={this.ChangeTab}
                    FilterData={this.state.RolesData} IsClickable={false} SelectedRow={this.SelectedRow}
                    IsActivated={this.IsActivated} ActionButton={this.actionButton} PageConfig={this.PageConfig} ChangePage={this.ChangePage}
                    Show={this.state.Show} Hide={this.state.Hide} PopupName={this.state.popupName} Submit={this.SubmitPopup} Close={this.ClosePopup}
                    Title={this.state.Title} CancelText={this.state.CancelText} ConfirmText={this.state.ConfirmText} PopData={this.state.PopupData} />
            </div>
        )
    }
}

export default UserComponent;
