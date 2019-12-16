import React, { Component } from "react";
import ServicePartnerService from "../../service/servicepartnerservice";
import AssignmentServicePartnerView from "./assignment-servicepartner.view";
import {
  Button,
  Modal,
  AutoComplete,
  Icons
} from "../../widget-controls/constants";
class AssignmentServicePartnerComponent extends Component {
  constructor(props) {
    super(props);
    this.servicepartnerservice = new ServicePartnerService(props.Url);
    this.state = {
      Header: [],
      Body: [],
      Pagesize: 10,
      Page: 1,
      SortColumnName: "AssetName:ASC",
      IsDeleted: false,
      AssetName: "",
      popupCompanies: [],
      showDetails: false,
      showBulk: false,
      Search: "",
      LstServicePartners: [],
      IsBulkassignEnabled: false,
      SelectedAssets: [],
      ListOfAssets: [],
      lstAssignedCompany: [],
      editPopupCompanies: [],
      assetID: "",
      showChildren: false,
      filteredListServicePartners: [],
      ShowBulkModal: "",
      updateAssetID: [],
      selectedAssetEdit: [],
      disableButton: false
    };
    this.PageConfig = {
      PageCount: 0,
      PageSize: 0,
      CurrentPageNumber: 1
    };
    this.loadAssetList();
    this.loadServicePartners();
    this.deletePopup = this.deletePopup.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
  }

  handleDetails = (event, i) => {
    const bodyContent = this.state.Body;
    const ID = bodyContent.findIndex(obj => obj.ID === i);
    let body = [...this.state.Body];
    let item = { ...body[ID] };
    item.showChildren = !item.showChildren;
    body[ID] = item;
    this.setState({ Body: body });
  };

  deletePopup = companyID => {
    const popupCompanyState = this.state.popupCompanies;
    const popupCompanies = popupCompanyState.filter(
      obj => obj.companyID !== companyID
    );
    this.setState({ popupCompanies: popupCompanies });
    this.setState({ disableButton: false });
  };

  preparePopupCompanies = assetID => {
    const childFilter = {
      ...this.state.Body.filter(obj => obj.ID === assetID)
    };
    let popupCompanies = [];
    this.setState({ editPopupCompanies: [] });
    childFilter[0].children.map((item, i) => {
      popupCompanies.push({
        companyID: item.ID,
        companyName: item.Name
      });
    });
    return popupCompanies;
  };

  handleShow = id => {
    const popupCompanies = this.preparePopupCompanies(id);
    const filteredListServicePartners = this.state.LstServicePartners;
    // filteredListServicePartners.map(e => {
    //   var IndexCheck = popupCompanies.findIndex(
    //     i => i.companyID.toLowerCase() == e.id.toLowerCase()
    //   );
    //   IndexCheck == -1 &&
    //     this.state.filteredListServicePartners.push({
    //       id: e.id,
    //       Name: e.name
    //     });
    // });
    this.setState({ popupCompanies });
    this.setState({ show: !this.state.show });
    this.setState({ assetID: id });
  };

  handleClose = () => {
    this.setState({ editPopupCompanies: [] });
    this.setState({ show: !this.state.show });
    this.setState({ disableButton: true });
  };

  ChangePage = number => {
    this.state.Page = number;
    this.setState({ Page: this.state.Page });
    this.loadAssetList(this.state.Page);
  };

  handleEditChange = selectedoptions => {
    selectedoptions.map(e => {
      var IndexCheck = this.state.popupCompanies.findIndex(
        i => i.companyID == e.id
      );
      IndexCheck == -1 &&
        this.state.popupCompanies.push({
          companyID: e.id,
          companyName: e.Name
        });
    });
    this.setState({ popupCompanies: this.state.popupCompanies });
  };

  updateServicePartnerSave = assetID => {
    let popupCompanies = this.state.popupCompanies;
    popupCompanies.map(e => this.state.editPopupCompanies.push(e.companyID));

    this.setState({ show: !this.state.show });
    this.setState({ disableButton: true });

    const data = {
      additionalServicePartners: this.state.editPopupCompanies      
    };

    this.servicepartnerservice
      .updateServicePartner(data, this.state.assetID)
      .then(data => {
        if (data.status == "200") {
          this.state.ShowBulkModal = false;
          this.state.deletePopupCompanies = [];
          this.state.editPopupCompanies = [];
          this.state.popupCompanies = [];
          this.setState({ editPopupCompanies: [] });
          this.loadAssetList();
        }
      });
  };

  openBulkPopup = () => {
    this.setState({ showBulk: true });
  };
  closeBulkPopup = () => {
    this.setState({ showBulk: false });
  };
  handleChange = selectedoptions => {
    selectedoptions.forEach(e => {
      this.state.lstAssignedCompany.push(e.id);
    });
  };
  loadAssetList = () => {
    const config = {
      pagesize: this.state.Pagesize,
      pageindex: this.state.Page,
      search: this.state.Search,
      sortColumnName: this.state.SortColumnName,
      companyTypes: this.state.CompanyTypes,
      isDeleted: this.state.IsDeleted
    };
    this.servicepartnerservice
      .getAssignmentServicePartners(config, this.props.Url)
      .then(data => {
        let servicepartnerlist = data.items;
        this.PageConfig.PageCount = data.count;
        this.PageConfig.PageSize = this.state.Pagesize;
        let header = this.prepareActiveHeader();
        this.setState({ Header: header });
        let body = this.prepreActiveBody(servicepartnerlist);
        this.setState({ Body: body });
      });
  };

  loadServicePartners = () => {
    this.servicepartnerservice.getServicePartners(this.props.Url).then(data => {
      let servicepartnerlist = data.items;
      let listofservicepartners = this.prepareListOfServicePartner(
        servicepartnerlist
      );
      this.setState({ LstServicePartners: listofservicepartners });
    });
  };

  SearchAssets = data => {
    if (!this.state.IsEngineGridDisplayed) {
      this.state.Search = data;
      this.setState({ Search: this.state.Search, Page: 1 });
      this.loadAssetList(this.state.Page);
    }
  };
  prepareListOfServicePartner(servicepartners) {
    let lstservpartner = [];
    servicepartners.forEach(a => {
      lstservpartner.push({
        Name: a.name,
        id: a.id,
        address:
          a.address[0].addressLine1 +
          " " +
          a.address[0].addressLine2 +
          " " +
          a.address[0].city +
          " " +
          a.address[0].postalCode
      });
    });
    return lstservpartner;
  }

  assignServicePartner = () => {
    const dataforAssign = {
      ParentCompanyId: "b52755bc-bf1c-4152-a1cb-9fb7004fb13f",
      AdditionalServicePartners: this.state.lstAssignedCompany.filter(
        (v, i) => this.state.lstAssignedCompany.indexOf(v) === i
      ),
      AssignedItems: this.state.SelectedAssets.filter(
        (v, i) => this.state.SelectedAssets.indexOf(v) === i
      )
    };
    this.servicepartnerservice
      .assignServicePartner(dataforAssign, this.props.Url)
      .then(data => {
        if (data.packet.header.responseCode == "200") {
          this.setState({ showBulk: false });
          this.state.SelectedAssets = [];
          this.state.lstAssignedCompany = [];
          this.loadAssetList();
        }
      });
  };
  prepareActiveHeader = () => {
    // Prepare Head
    let lstHead = [];
    lstHead.push({
      Text: "",
      IsDefault: true,
      IsSort: false,
      Type: "CheckBox"
    });
    lstHead.push({
      Text: "Asset name",
      IsDefault: true,
      IsSort: false,
      Type: "Text"
    });
    lstHead.push({
      Text: "Additional service partners",
      IsDefault: true,
      IsSort: false,
      Type: "Text"
    });

    lstHead.push({
      Text: "",
      IsDefault: true,
      IsSort: false,
      Type: "Text"
    });
    return lstHead;
  };

  prepreActiveBody = servicepartnerlist => {
    let lstBody = [];
    servicepartnerlist.map(e =>
      lstBody.push({
        body: [
          { Text: "", Type: "CheckBox" },
          { Text: e.name, Type: "Label" },
          {
            Text: e.additionalServicePaertners.length,
            Type: "Label",
            Count: true
          },
          {
            Text: (
              <button
                className="details-btn"
                onClick={() => this.handleDetails(this, e.id)}
              >
                Details
                <span>
                  <span className="collapseBtn">
                    <Icons
                      IconName={
                        !this.state.showChildren
                          ? "collapseRevIcon"
                          : "collapseIcon"
                      }
                    />
                  </span>
                </span>
              </button>
            ),
            Type: "Label"
          }
        ],
        editButton: (
          <Button
            btnClicked={() => this.handleShow(e.id)}
            btnClass="custom-btn primary-btn"
            TextValue="Edit"
          ></Button>
        ),
        ID: e.id,
        assetName: e.name,
        showChildren: false,
        children: this.accessRightCompaniesList(e.additionalServicePaertners)
      })
    );
    return lstBody;
  };

  accessRightCompaniesList = additionalServicePaertners => {
    let lstBody = [];
    additionalServicePaertners.map(e =>
      lstBody.push({
        body: <span id={e.id}>{e.name}</span>,
        ID: e.id,
        Name: e.name
      })
    );
    return lstBody;
  };
  actionButton = (actionType, data, event) => {
    switch (actionType) {
      case "CheckBox":
        this.setState({ IsBulkassignEnabled: true });
        const index = this.state.SelectedAssets.indexOf(data.assetGuid);
        this.state.SelectedAssets.indexOf(data.assetGuid) == -1
          ? this.state.SelectedAssets.push(data.assetGuid)
          : this.state.SelectedAssets.splice(index, 1);
        break;
      default:
        alert("Default");
        break;
    }
  };
  selectAll = actionType => {
    switch (actionType) {
      case "CheckBox":
        this.setState({ IsBulkassignEnabled: true });
        this.state.ListOfAssets.forEach(a => {
          this.state.SelectedAssets.push(a.assetGuid);
        });

        break;
      default:
        alert("Default");
        break;
    }
  };
  render() {
    return (
      <>
        <AssignmentServicePartnerView
          header={this.state.Header}
          search={this.SearchAssets}
          body={this.state.Body}
          ActionButton={this.actionButton}
          SelectAll={this.selectAll}
          handleDetails={this.state.showDetails}
          disablebulkassign={this.state.IsBulkassignEnabled}
          PageConfig={this.PageConfig}
          openBulkPopup={this.openBulkPopup}
          ServicePartnersList={this.state.LstServicePartners}
          ChangePage={this.ChangePage}
          Pagination={this.props.Pagination}
        />
        <Modal
          showPopup={this.state.show}
          closePopup={this.handleClose}
          savePopup={this.updateServicePartnerSave}
          modalTitle="Additional service partners"
          modalBtnSave="Save"
          modalBtnClose="Cancel"
          size={"lg"}
          disable={this.state.disableButton}
        >
          <div className="service-modal">
            <p>
              Select additional service partners you wish to assign to asset
              name.
            </p>
            <div className="service-textarea edit-company-popup">
              {this.state.popupCompanies.map(additionalServicePaertners => (
                <React.Fragment>
                  <div className="detail-expand">
                    <span className="company-label">
                      {additionalServicePaertners.companyName}
                      <button
                        onClick={() =>
                          this.deletePopup(additionalServicePaertners.companyID)
                        }
                        type="button"
                      ></button>
                    </span>
                  </div>
                </React.Fragment>
              ))}
              <AutoComplete
                id="service-partner"
                multiple={true}
                placeholder=""
                onChange={this.handleEditChange}
                labelKey="Name"
                options={this.state.LstServicePartners}
                //options={this.state.filteredListServicePartners}
                minLength={2}
                filterBy={["Name"]}
              />
            </div>
          </div>
        </Modal>
        <Modal
          showPopup={this.state.showBulk}
          closePopup={this.closeBulkPopup}
          modalTitle="Assign additional service partner"
          modalBtnSave="Assign"
          modalBtnClose="Cancel"
          savePopup={this.assignServicePartner}
        >
          <div className="service-modal">
            <p>
              Select the additional service partner you wish to assign to {}{" "}
              asset name.
            </p>
            <div className="service-textarea">
              <AutoComplete
                id="service-partner"
                labelKey="Name"
                multiple={true}
                options={this.state.LstServicePartners}
                minLength={2}
                onChange={this.handleChange}
              />
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default AssignmentServicePartnerComponent;
