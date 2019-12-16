import React from 'react'
import EnginesView from '../engines/engines.view';
import EngineService from '../../service/engineservice';
import AssetsService from '../../service/assetsservice';
import { toast } from 'react-toastify';

class EnginesComponent extends React.Component {
    constructor(props) {
        super(props);
        this.url = props.Url;
        this.engineService = new EngineService(this.url);
        this.assetsService = new AssetsService(this.url);
        this.state = {
            Header: [],
            Body: [],
            Search: props.searchText,
            PageSize: 10,
            Page: 1,
            Sort: '+serialNumber',
            AssetSort: '+Name',
            IsDeleted: false,
            selectedEngineId: '',
            isUnassignedEngineClicked: false,
            isAssignedEngineClicked: false,
            engineName: '',
            myAssetList: [],
            parentAssetGuid: '',
            parentCompanyGuid: '',
            isEditEngineClicked: false,
            selectedEngine: {}
        }
        this.nameSortOrder = '+';
        this.otherSortFieldName = '';
        this.otherSortFieldOrder = '';
        this.enginesHeader = [];
        this.isSortClicked = false;
        this.PageConfig = {
            PageCount: 0,
            PageSize: 0,
            CurrentPageNumber: 1
        };
    }

    componentDidMount() {
        this.loadEngines(this.state.Page);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            if (this.props.IsLoadEngines || prevProps.assetId !== this.props.assetId) {
                this.loadEngines(this.state.Page);
            }
        }
    }

    loadEngines(page) {
        const config = {
            pagesize: this.state.PageSize,
            pageindex: page,
            search: this.props.searchText,
            sort: this.state.Sort,
            assetId: this.props.assetId ? this.props.assetId : '',
            isAssinged: true
        }
        this.engineService.getEngines(config).then(data => {
            let engineList = data.items;
            if (engineList.length == 0) {
                this.props.IsNoEngines(true);
            }
            this.PageConfig.PageCount = data.count;
            this.PageConfig.PageSize = this.state.PageSize;
            let header = this.isSortClicked ? this.enginesHeader : this.prepareEnginesHeader();
            this.setState({ "Header": header });
            let body = this.prepareEnginesBody(engineList);
            this.setState({ "Body": body });
        });
    }

    prepareEnginesBody(engineList) {
        let lstBody = [];
        engineList.forEach(e => {
            var connectivityStatus = (e.deviceStatus && e.deviceStatus.connectivity === "Connected") ? [<span className="connected">Connected</span>] : [<span className="unconnected">Unconnected</span>];
            lstBody.push({
                "body": [{ "Text": e.serialNumber, "Type": "Label" },
                { "Text": e.deviceName, "Type": "Label" },
                { "Text": e.modelNumber, "Type": "Label" },
                { "Text": "8572 hrs", "Type": "Label" },
                { "Text": connectivityStatus, "Type": "html" },
                { "Text": { "Action": ["editIcon", "deleteIcon", "searchIcon"], "Object": e }, "Type": "Icon" }
                ]
            })
        });
        return lstBody;
    }

    prepareEnginesHeader() {
        // Prepare Head
        let lstHead = [];
        lstHead.push({ "Text": "Serial Number", "IsDefault": true, "IsSort": true, "Type": "Text", "ClassName": 'sort-asc-order' });
        lstHead.push({ "Text": "Engine name", "IsDefault": false, "IsSort": true, "Type": "Text", "ClassName": 'sort-order' });
        lstHead.push({ "Text": "Model Number", "IsDefault": false, "IsSort": true, "Type": "Text", "ClassName": 'sort-order' });
        lstHead.push({ "Text": "Op. hours", "IsDefault": false, "IsSort": false, "Type": "Text", "ClassName": 'sort-order' }); //IsSort should be made true once API value is binded
        lstHead.push({ "Text": "Connectivity", "IsDefault": false, "IsSort": false, "Type": "Text", "ClassName": '' });
        lstHead.push({ "Text": "Action", "IsDefault": false, "IsSort": false, "Type": "Text", "ClassName": '' });
        return lstHead;
    }

    sortEngines = (th, i) => {
        if (th[i].IsSort) {
            this.isSortClicked = true;
            if (i === 0) {
                this.nameSortOrder === '+' ? this.nameSortOrder = '-' : this.nameSortOrder = '+';
                this.otherSortFieldName = '';
            } else {
                this.nameSortOrder = '+';
                switch (i) {
                    case 1:
                        this.otherSortFieldName = "name";
                        break;
                    case 2:
                        this.otherSortFieldName = "modelNumber";
                        break;
                    case 3:
                        // TODO once operating hours is fetched from API
                        break;
                    default:
                        this.otherSortFieldName = "serialNumber";
                        break;
                }
                this.otherSortFieldOrder === '+'
                    ? this.otherSortFieldOrder = '-' : this.otherSortFieldOrder = '+';
            }

            let SortColumnName = this.otherSortFieldName ? this.otherSortFieldOrder + this.otherSortFieldName + "," + this.nameSortOrder + "serialNumber"
                : this.nameSortOrder + "serialNumber";
            this.state.Sort = SortColumnName;
            this.setState({ "Sort": SortColumnName });
            this.loadEngines(this.state.Page);

            //set classname.
            th.forEach(a => {
                if (a.IsSort)
                    a.Text != "Serial Number" ? a.ClassName = 'sort-order' : a.ClassName = 'sort-asc-order';
            });
            th[i].Text === "Serial Number" ? this.state.Header[i].ClassName = this.nameSortOrder === "+" ? 'sort-asc-order' : 'sort-dec-order' :
                this.state.Header[i].ClassName = this.otherSortFieldOrder === "+" ? 'sort-asc-order' : 'sort-dec-order';
            this.enginesHeader = this.state.Header;
        }
    }
    actionButton = (actionType, data) => {
        switch (actionType) {
            case 'deleteIcon':
                this.SetUnassignEnginePopup();
                this.setState({ "engineName": data.deviceName, "selectedEngineId": data.deviceId });
                break;
            case 'searchIcon':
                this.SetAssignEnginePopup();
                this.getMyAssetList();
                this.setState({ "engineName": data.deviceName, "selectedEngineId": data.deviceId });
                break;
            case 'editIcon':
                this.SetEditPopup();
                this.state.selectedEngine = data;
                this.setState({ "selectedEngine": this.state.selectedEngine });
                break;
            default:
                break;
        }
    }

    SetEditPopup = () => {
        this.setState({ "isEditEngineClicked": !this.state.isEditEngineClicked });
        if (!this.state.isEditEngineClicked) {
            this.setState({ "selectedEngine": {} });
        }
    }

    EditEngine = (name, serialNumber, modelNumber, opHours) => {

        const engineDTO = {
            "deviceId": this.state.selectedEngine.deviceId,
            "name": name ? name : this.state.selectedEngine.assetName,
            "modelNumber": modelNumber ? modelNumber : this.state.selectedEngine.modelNumber,
            "serialNumber": serialNumber ? serialNumber : this.state.selectedEngine.serialNumber,
            "companyId": this.state.selectedEngine.companyId,
            "parentId": this.state.selectedEngine.parentId
        };

        this.engineService.editEngine(engineDTO).then(data => {
            if (data.status == '200') {
                this.SetEditPopup();
                toast.success('Updated Sucessfully', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                this.loadEngines(this.state.Page);
            } else {
                toast.error('Error occurred', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        });
    }

    SetUnassignEnginePopup = () => {
        this.setState({ "isUnassignedEngineClicked": !this.state.isUnassignedEngineClicked, "engineName": '' });
        this.setState({ "isAssignedEngineClicked": false });
    }
    SetAssignEnginePopup = () => {
        this.setState({ "isAssignedEngineClicked": !this.state.isAssignedEngineClicked, "engineName": '' });
        this.setState({ "isUnassignedEngineClicked": false });
    }

    UnAssignEngine = () => {
        this.SetUnassignEnginePopup();
        const inputData = {
            deviceIds: [this.state.selectedEngineId]
        };
        this.engineService.unAssignEngine(inputData).then(data => {
            if (data.status == '200') {
                this.loadEngines(this.state.Page);
                this.props.reloadAssets(this.state.Page);
                toast.success('Engine Unassigned Sucessfully', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                toast.error('Error occurred', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        });
    }
    getMyAssetList() {
        const config = {
            pagesize: this.state.PageSize,
            pageindex: this.state.Page,
            search: this.state.Search,
            sort: this.state.AssetSort,
            isDeleted: this.state.IsDeleted
        }
        this.assetsService.getAssets(config).then(data => {
            let res = data.items;
            this.setState({ "myAssetList": res });
        });
    }
    handleChange = (selectedoption) => {
        this.state.parentAssetGuid = selectedoption[0].id;
        this.setState({ "parentAssetGuid": this.state.parentAssetGuid });
    }

    AssignEngine = () => {
        this.SetAssignEnginePopup();
        const inputData = {
            deviceIds: [this.state.selectedEngineId]
        };
        this.engineService.assignEngine(inputData, 1446, this.state.parentAssetGuid).then(data => {
            if (data.status == '200') {
                this.loadEngines(this.state.Page);
                this.props.reloadAssets(this.state.Page);
                toast.success('Engine assigned Sucessfully', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                toast.error('Error occurred', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        });
    }

    ChangePage = (number) => {
        this.state.Page = number;
        this.setState({ "Page": this.state.Page });
        this.loadEngines(this.state.Page);
    };

    render() {
        return (
            <div>
                <EnginesView header={this.state.Header} body={this.state.Body} showEngines={this.props.showEngines}
                    selectedEnginename={this.state.engineName} selectedEngineId={this.state.selectedEngineId}
                    unassigneEngine={this.UnAssignEngine} setUnassignEnginePopup={this.SetUnassignEnginePopup}
                    ActionButton={this.actionButton} isUnassignedEngineClicked={this.state.isUnassignedEngineClicked}
                    assigneEngine={this.AssignEngine} isAssignedEngineClicked={this.state.isAssignedEngineClicked}
                    setAssignEnginePopup={this.SetAssignEnginePopup} myAssetList={this.state.MyAssetList}
                    myAssetList={this.state.myAssetList} change={this.handleChange}
                    Sort={this.sortEngines} PageConfig={this.PageConfig} ChangePage={this.ChangePage}
                    setEditPopup={this.SetEditPopup} isEditEngineClicked={this.state.isEditEngineClicked} editEngine={this.EditEngine} selectedEngine={this.state.selectedEngine} />
            </div>
        )
    }
}

export default EnginesComponent;

