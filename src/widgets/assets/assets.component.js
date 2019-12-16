import React from 'react'
import AssetsView from './assets.view';
import AssetsService from '../service/assetsservice';
import { toast } from 'react-toastify';

class AssetsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.Url = props.Url;
        this.assetsService = new AssetsService(this.Url);
        this.state = {
            Header: [],
            Body: [],
            Search: '',
            IsDeleted: false,
            PageSize: 10,
            Page: 1,
            Sort: '+Name',
            IsEngineGridDisplayed: false,
            AssetEnginesHeader: [],
            AssetEnginesBody: [],
            SelectedAssetId: '',
            IsDeleteClicked: false,
            AssetName: '',
            IsEditClicked: false,
            AssetList: [],
            CountryList: [],
            AssetsList: [],
            ApplicationList: [],
            GetEditRowData:''

        }
        this.AssetNameSort = 'sort-asc-order';
        this.ApplicationSort = '';
        this.InformationSort = '';
        this.PageConfig = {
            PageCount: 0,
            PageSize: 0,
            CurrentPageNumber: 1
        };
        this.addAssets = this.addAssets.bind(this);
        
        this.assetsHeader = [];
        this.isSortClicked = false;
        this.loadAssets=this.loadAssets.bind(this);
    }

    componentDidMount() {
        this.loadAssets(this.state.Page);
    }

    actionButton = (actionType, data) => {
        switch (actionType) {
            case 'deleteIcon':
                this.SetDeletePopup();
                this.setState({ "AssetName": data.name, "SelectedAssetId": data.id });
                break;
            case 'editIcon':
                console.log("edit data = ",data);
                this.setState({ "GetEditRowData": data });
                if(data.applicationType.code === "Marine"){
                    console.log("component appliction type for edit = ", data.applicationType.code)
                    this.getApplicationType(data.applicationType.code);
                    this.SetEditPopup();
                    // this.setAssettype(data.applicationType.code);
                    
                }else if(data.applicationType.code === "PowerGen"){
                    console.log("component appliction type for edit = ", data.applicationType.code)
                    this.getApplicationType(data.applicationType.code);
                    // this.getCountries();
                    this.SetEditPopup();
                    // this.setAssettype(data.applicationType.code);

                }
                break;
            default:
                break;
        }
    }

    setAssettype(assets){ 
        // console.log("asset component set assettype = ",assets);
        // console.log("application list  = ",this.state.ApplicationList);
        if(assets === "Marine"){
            let assetType = this.state.ApplicationList.find(v => v.applicationTypeCode === "Marine").assetTypes;             
            this.setState({AssetsList:assetType})
        }else if(assets === "PowerGen"){
            let assetType = this.state.ApplicationList.find(v => v.applicationTypeCode === "PowerGen").assetTypes;             
            this.setState({AssetsList:assetType})
            this.getCountries();
        }else if(assets === "Rail") {
            let assetType = this.state.ApplicationList.find(v => v.applicationTypeCode === "Rail").assetTypes;
            this.setState({AssetsList:assetType})
        }else{
            //nothing
        }         
    }
    
    getCountries()
    {
        this.assetsService.getCountries(this.props.Url).then(data => {
            let listCountries = data.lookUpData
            this.setState({CountryList:listCountries})
        })
    }  
   
    isApplicationType(application){
        if(application === true){
           this.getApplicationType();
        }else{
            //nothing
        }
    }
    getApplicationType(applicationdata){
        // console.log("getapplicationtypeaftereditbutton = ");
        this.assetsService.getApplicationType(this.props.Url).then(data => {             
            let listApplication = data
            this.setState({ApplicationList:listApplication})
            this.setAssettype(applicationdata);
        })
    }
    
    addAssets(marineformdata){
        const marineData = marineformdata;        
        this.assetsService.addAssets(marineData).then(data => {
        })
    }
    
    

    loadAssets(page) {
        const config = {
            pagesize: this.state.PageSize,
            pageindex: page,
            search: this.state.Search,
            sort: this.state.Sort,
            isDeleted: this.state.IsDeleted
        }
        this.assetsService.getAssets(config).then(data => {
            this.setState({ "AssetList": data.items });
            this.PageConfig.PageCount = data.count;
            this.PageConfig.PageSize = this.state.PageSize;
            let header = this.isSortClicked ? this.assetsHeader : this.prepareAssetsHeader();
            this.setState({ "Header": header });
            let body = this.prepareAssetsBody(this.state.AssetList);
            this.setState({ "Body": body });
            let assetEnginesHeader = this.prepareAssetEnginesHeader();
            this.setState({ "AssetEnginesHeader": assetEnginesHeader });
            let assetEngineBody = this.prepareAssetEnginesBody(this.state.AssetList);
            this.setState({ "AssetEnginesBody": assetEngineBody });
        });
    }

    prepareAssetsHeader() {
        // Prepare Head
        let lstHead = [];
        lstHead.push({ "Text": "Asset Name", "IsDefault": true, "IsSort": true, "Type": "Text", "ClassName": 'sort-asc-order' });
        lstHead.push({ "Text": "Application", "IsDefault": false, "IsSort": true, "Type": "Text", "ClassName": 'sort-order' });
        lstHead.push({ "Text": "Information", "IsDefault": false, "IsSort": false, "Type": "Text", "ClassName": '' });
        lstHead.push({ "Text": "Engines", "IsDefault": false, "IsSort": false, "Type": "Text", "ClassName": '' });
        lstHead.push({ "Text": "Action", "IsDefault": false, "IsSort": false, "Type": "Text", "ClassName": '' });
        return lstHead;
    }

    prepareAssetsBody(assetList) {
        let lstBody = [];
        assetList.forEach(e => {
            let information = "";
            if (e.applicationType.code == 'Marine') {
                information = [<p> MMSI: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{e.extendedAttributes ? e.extendedAttributes.MMSINumber:''}</span></p>, <p>IMO Hull:&nbsp;&nbsp;<span>{e.extendedAttributes? e.extendedAttributes.IMOHullNumber:''}</span></p>];
            }
            if (e.applicationType.code == 'Rail' || e.applicationType.code == 'Generic') {
                information = [<p>{(e.extendedAttributes && e.extendedAttributes.additionalInformation) ? e.extendedAttributes.additionalInformation : 'No Information available'}</p>];
            }
            if (e.applicationType.code == 'PowerGen') {
                information = [<p>{e.address[0].addressLine1},  {e.address[0].city}, {e.address[0].postalCode}, {e.address[0].country}</p>];
            }
            lstBody.push({ "body": [{ "Text": e.name, "Type": "Label" }, { "Text": e.applicationType ? e.applicationType.code : "", "Type": "Label" }, { "Text": information, "Type": "html" }, { "Text": e.engineCount, "Type": "Label" }, { "Text": { "Action": ["editIcon", "deleteIcon"], "Object": e }, "Type": "Icon" }], "ClassName": '' });
        });
        return lstBody;
    }

    prepareAssetEnginesHeader() {
        let lstHead = [];
        lstHead.push({ "Text": "Asset Name", "IsDefault": true, "IsSort": false, "Type": "Text" });
        lstHead.push({ "Text": "Engines", "IsDefault": false, "IsSort": false, "Type": "Text" });
        return lstHead;
    }

    prepareAssetEnginesBody(assetList) {
        let lstBody = [];
        assetList.forEach(e => {
            lstBody.push({ "body": [{ "Text": e.name, "Type": "Label" }, { "Text": e.engineCount, "Type": "Label" }], "ClassName": '' });
        });
        return lstBody;
    }

    SelectedRow = (rowIndex, colIndex) => {
        if (colIndex != 4) {
            let asset = this.state.AssetList[rowIndex];
            this.ShowEngines(true);
            this.setState({ "SelectedAssetId": asset.id, "AssetName": asset.name });
        }
        this.state.AssetEnginesBody.forEach((data, i) => {
            data.ClassName = (i === rowIndex) ? 'selectedRow' : '';
        });
        this.state.AssetEnginesBody[rowIndex].ClassName = 'selectedRow';
        this.setState({ "AssetEnginesBody": this.state.AssetEnginesBody });
    }

    

    SetDeletePopup = () => {
        this.setState({ "IsDeleteClicked": !this.state.IsDeleteClicked, "AssetName": '' });
    }

    DeleteAsset = () => {
        this.SetDeletePopup();
        this.assetsService.deleteAsset(this.state.SelectedAssetId).then(data => {
            this.loadAssets(this.state.Page);
            toast.success('Deleted Sucessfully', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        });
    }

    SetEditPopup = () => {
        this.setState({ "IsEditClicked": !this.state.IsEditClicked });
    }

    EditAsset = () => {
        console.log("revert from assetview on component")
        this.SetEditPopup();
    }

    SearchAssets = (data) => {
        if (!this.state.IsEngineGridDisplayed) {
            this.state.Search = data;
            this.setState({ "Search": this.state.Search, "Page": 1 });
            this.loadAssets(this.state.Page);
        }
    }

    sortAssets = (th, i) => {
        if (th[i].IsSort) {
            this.isSortClicked = true;
            if (i === 0) { // 0 is column index of Asset name
                this.AssetNameSort = this.AssetNameSort === 'sort-asc-order' ? 'sort-dec-order' : 'sort-asc-order';
                this.state.Sort = (this.AssetNameSort === 'sort-asc-order' ? '+' : '-') +'Name';
                this.setState({ "Sort": this.state.Sort });
            } else {
                if (i === 1) { // 1 is column index of Application
                    this.ApplicationSort = this.ApplicationSort === 'sort-asc-order' ? 'sort-dec-order' : 'sort-asc-order';
                    this.state.Sort = (this.ApplicationSort === 'sort-asc-order' ? '+' : '-') + 'ApplicationType' + ',+Name';
                    this.setState({ "Sort": this.state.Sort });
                }
                else if (i === 2) { //2 is column index of information
                    this.InformationSort = this.InformationSort === 'sort-asc-order' ? 'sort-dec-order' : 'sort-asc-order';
                    this.state.Sort = (this.InformationSort === 'sort-asc-order' ? '+' : '-')+'Information' + ',+Name';
                    this.setState({ "Sort": this.state.Sort });
                }
            }
            this.loadAssets(this.state.Page);
            th.forEach(a => {
                if (a.IsSort) {
                    a.Text === "Asset Name" ? a.ClassName = 'sort-asc-order' : a.ClassName = 'sort-order';
                }
            });

            i === 0 ? this.state.Header[i].ClassName = this.AssetNameSort :
                this.state.Header[i].ClassName = (i === 1 ? this.ApplicationSort : this.InformationSort);
            this.assetsHeader = this.state.Header;
        }
    }

    ShowEngines = (isShowEngines) => {
        this.setState({ "IsEngineGridDisplayed": isShowEngines });
    }

    ChangePage = (number) => {
        this.state.Page = number;
        this.setState({ "Page": this.state.Page });
        this.loadAssets(this.state.Page);
    };

    render() {
        
        return (
            <div>
                <AssetsView url={this.props.Url} header={this.state.Header} body={this.state.Body} search={this.SearchAssets} ActionButton={this.actionButton} showEngines={this.ShowEngines} isEngineGridDisplayed={this.state.IsEngineGridDisplayed}
                    assetEnginesHeader={this.state.AssetEnginesHeader} assetEnginesBody={this.state.AssetEnginesBody} enginesForAssetId={this.state.SelectedAssetId} selectedAssetname={this.state.AssetName} isDeleteClicked={this.state.IsDeleteClicked}
                    setDeletePopup={this.SetDeletePopup} deleteAsset={this.DeleteAsset} Sort={this.sortAssets} PageConfig={this.PageConfig} ChangePage={this.ChangePage}
                    isEditClicked={this.state.IsEditClicked} setEditPopUp={this.SetEditPopup} editAsset={this.editAsset} SelectedRow={this.SelectedRow}
                    countries = {this.state.CountryList}
                    setAssettype = {this.setAssettype.bind(this)}
                    assetslist = {this.state.AssetsList}
                    applictionlist = {this.state.ApplicationList}
                    isApplicationType = {this.isApplicationType.bind(this)}
                    addAssets = {this.addAssets}
                    reloadAssets={this.loadAssets} 
                    passEditRowData={this.state.GetEditRowData}
                    
                />
            </div>
        )
    }
}

export default AssetsComponent;
