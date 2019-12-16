import React, { Component } from 'react';
import ServicePartnerService from '../../service/servicepartnerservice';
import AdditionalServicePartnerView from './additional-servicepartner.view';
class AdditionalServicePartnerComponent extends Component {
    constructor(props) {
        super(props);
        this.servicepartnerservice = new ServicePartnerService(props.Url);
        this.state = {
            Header: [],
            Body: [],
            CompanyName: '',
            CompanyAdress: '',
            CompanyCity: '',
            Postalcode: '',
            CompanyCountry: '',
            CompanyContact: '+49 17612345678',
            LstServicePartners: [],
            IsDeleteClicked: false,
            ShowAddPopup: false,
            ServicePartnerName: '',
            SelectedPartnertobedeleted: [],
            ParentCompanyId: 2,
            SelectedServicePartner: []
        }
        this.PageConfig = {
            PageCount: 0,
            PageSize: 0
        };
        this.loadAdditionalServicePartners();
        this.loadServicePartners();
        this.addServicePartner = this.addServicePartner.bind(this);
        this.openAddPopup = this.openAddPopup.bind(this);
        this.closeAddPopup = this.closeAddPopup.bind(this);
        this.deleteServicePartner = this.deleteServicePartner.bind(this);
    }
    loadAdditionalServicePartners() {
        this.servicepartnerservice.getAdditionalServicePartners(this.state.ParentCompanyId).then(data => {
            let servicepartnerlist = data.items;
            let header = this.prepareHeader();
            this.setState({ "Header": header });
            let body = this.prepareBody(servicepartnerlist);
            this.setState({ "Body": body });
        });
    }
    loadServicePartners() {
        this.servicepartnerservice.getServicePartners().then(data => {
            let servicepartnerlist = data.items;
            let listofservicepartners = this.prepareListOfServicePartner(servicepartnerlist)
            this.setState({ LstServicePartners: listofservicepartners });
        });
    }
    handleChange = (selectedoptions) => {
        selectedoptions.forEach(e => { this.state.SelectedServicePartner.push(e.id) });
    }
    openAddPopup() {
      this.setState({ShowAddPopup:true});
    }
    closeAddPopup(){
        this.setState({ShowAddPopup:false});
    }
    addServicePartner() {
        const data = {
            ServicePartners: this.state.SelectedServicePartner
        };
        this.servicepartnerservice.addServicePartner(this.state.ParentCompanyId, data).then(data => {
            this.setState({ShowAddPopup:false});
            this.state.SelectedServicePartner = [];
            this.loadAdditionalServicePartners();
        })
    }
    deleteServicePartner(){
        this.servicepartnerservice.deleteservicePartner(this.state.ParentCompanyId,this.state.SelectedPartnertobedeleted).then(data =>{
                this.setState({IsDeleteClicked: false});
                this.state.SelectedPartnertobedeleted = [];
                this.loadAdditionalServicePartners();
            })        
    }
    prepareListOfServicePartner(servicepartners) {
        let lstservpartner = [];
        servicepartners.forEach(a => { lstservpartner.push({ 'Name': a.name, 'id': a.id,'address':a.address[0].addressLine1 + ' '+ a.address[0].addressLine2 + ' ' + a.address[0].city + ' ' +a.address[0].postalCode }) });
        return lstservpartner;
    }
    prepareHeader() {
        // Prepare Head
        let lstHead = [];
        lstHead.push({ "Text": "Name", "IsDefault": true, "IsSort": false, "Type": "Text" });
        lstHead.push({ "Text": "Address", "IsDefault": true, "IsSort": false, "Type": "Text" });
        lstHead.push({ "Text": "Contact", "IsDefault": true, "IsSort": false, "Type": "Text" });
        lstHead.push({ "Text": "Action", "IsDefault": true, "IsSort": false, "Type": "Text" });
        return lstHead;
    }
    prepareBody(servicepartnerlist) {
        let lstBody = [];
        servicepartnerlist.forEach(e => {
            lstBody.push({ "body": [{ "Text": e.name, "Type": "Label" }, { "Text": this.prepareAddress(e.address[0]), "Type": "Label" }, { "Text": '+49 75419077777', "Type": "Telephone" }, { "Text": { "Action": ["deleteIcon"], "Object": e }, "Type": "Icon" }] })
        });
        return lstBody;
    }
    prepareAddress(address) {
        let userViewString = '';
        userViewString += address.addressLine1 + address.addressLine2 + ',' +
            address.city + ',' + address.country + ',' + address.postalCode;
        return userViewString;
    }
    setDeletePopup = () => {
        this.setState({ "IsDeleteClicked": !this.state.IsDeleteClicked });
    }
    actionButton = (actionType, data) => {
        switch (actionType) {
            case 'deleteIcon':
                this.setState({ "IsDeleteClicked": true });
                this.setState({ "ServicePartnerName": data.name });
                this.setState({SelectedPartnertobedeleted:data.id});
                break;
            default:
                alert('Default');
                break;
        }
    }
    render() {
        return (
            <AdditionalServicePartnerView header={this.state.Header} PageConfig={this.PageConfig} body={this.state.Body} ServicePartnersList={this.state.LstServicePartners} ActionButton={this.actionButton} isDeleteClicked={this.state.IsDeleteClicked} showAddPopup={this.state.ShowAddPopup} openAddPopup= {this.openAddPopup} closeAddPopup={this.closeAddPopup}  setDeletePopup={this.setDeletePopup} ServicePartnerName={this.state.ServicePartnerName} onChange={this.handleChange} addServicePartner={this.addServicePartner} deleteServicePartner = {this.deleteServicePartner} />
        );
    }
}

export default AdditionalServicePartnerComponent;