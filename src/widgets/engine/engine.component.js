import React from 'react'
import EngineView from './engine.view';
import EngineService from '../service/engineservice';
import AssetsService from '../service/assetsservice';

class EngineComponent extends React.Component {

    constructor(props) {
        super(props);
        this.engineService = new EngineService(props.Url);
        this.assetsService = new AssetsService(props.Url);
        this.state = {
            Header: this.prepareHeader(),
            Body: [],
            assetList: [],
            selectedAsset: undefined,
            selectedEngine: undefined,
            Search: '',
            IsAssinged: false,
            isAssingClicked: false,
            PageSize: 15,
            Page: 1,
            Sort: 'SerialNumber:ASC',
            Show: false,
        }
        this.defaultSortFieldOrder = 'ASC';
        this.otherSortFieldOrder = '';
        this.loadEngines();
    }

    loadEngines() {
        const config = {
            pagesize: this.state.PageSize,
            pageindex: this.state.Page,
            search: this.state.Search,
            sort: this.state.Sort,
            isAssinged: this.state.IsAssinged,
        }
        this.engineService.getEngines(config, this.Url).then(data => {
            const engineData = data.items;
            const body = this.prepreActiveBody(engineData);
            this.setState({ "Body": body });
        });
    }

    SearchEngine = (data) => {
        this.setState({ "Search": data, "Page": 1 }, () => {
            this.loadEngines();
        });
    }

    SortEngine = (header, colNumber) => {
        // alert('Under Implementation :)')
        // switch (header[colNumber].Text) {
        //     case 'Serial number':
        //         this.applySortingOn('SerialNumber', colNumber, this.defaultSortFieldOrder = this.defaultSortFieldOrder === 'ASC' ? 'DESC' : 'ASC');
        //         break;
        //     case 'Engine name':
        //         this.applySortingOn('AssetName', colNumber, this.otherSortFieldOrder = this.otherSortFieldOrder === 'ASC' ? 'DESC' : 'ASC');
        //         break;
        //     case 'Model number':
        //         this.applySortingOn('ModelNumber', colNumber, this.otherSortFieldOrder = this.otherSortFieldOrder === 'ASC' ? 'DESC' : 'ASC');
        //         break;
        //     default:
        //         break;
        // }
    }

    applySortingOn = (colName, colNum, order) => {
        // TODO: need to bind default className for sortable column
        if (colName === 'SerialNumber') {
            this.state.Header[1].ClassName = 'sort-order';
            this.state.Header[2].ClassName = 'sort-order';
            this.state.Header[colNum].ClassName = order === 'ASC' ? 'sort-asc-order' : 'sort-dec-order';
            this.setState({ 'Sort': colName + ':' + order, 'Header': this.state.Header }, () => {
                this.loadEngines();
            });
        } else {
            this.state.Header[0].ClassName = 'sort-asc-order';
            this.state.Header[1].ClassName = 'sort-order';
            this.state.Header[2].ClassName = 'sort-order';
            this.state.Header[colNum].ClassName = order === 'ASC' ? 'sort-asc-order' : 'sort-dec-order';
            this.setState({ 'Sort': colName + ':' + order + ',' + 'SerialNumber:ASC', 'Header': this.state.Header }, () => {
                this.loadEngines();
            });
        }
    }

    prepareHeader() {
        return [{ 'Text': 'Serial number', 'IsDefault': true, 'IsSort': true, 'Type': 'Text', 'SortText': 'SerialNumber', 'ClassName': 'sort-asc-order' },
        { 'Text': 'Engine name', 'IsDefault': false, 'IsSort': true, 'Type': 'Text', 'SortText': 'AssetName', 'ClassName': 'sort-order' },
        { 'Text': 'Model number', 'IsDefault': false, 'IsSort': true, 'Type': 'Text', 'SortText': 'ModelNumber', 'ClassName': 'sort-order' },
        { 'Text': 'Operating hours', 'IsDefault': false, 'IsSort': false, 'Type': 'Text' },
        { 'Text': 'Connectivity', 'IsDefault': false, 'IsSort': false, 'Type': 'Text' },
        { 'Text': 'Action', 'IsDefault': false, 'IsSort': false, 'Type': 'Text' }];
    }

    prepreActiveBody(engineData) {
        const lstBody = [];
        engineData.forEach(e => {
            lstBody.push({
                "body":
                    [{ "Text": e.serialNumber, "Type": "Label" },
                    { "Text": e.deviceName, "Type": "Label" },
                    { "Text": e.modelNumber, "Type": "Label" },
                    { "Text": '1234', "Type": "Label" },
                    { "Text": e.isActive, "Type": "Link" },
                    { "Text": { "Action": ["editIcon", "assignTextIcon"], "Object": e }, "Type": "Icon" }]
            });
        });
        return lstBody;
    }

    actionButton = (actionType, actionData) => {
        switch (actionType) {
            case 'assignTextIcon':
                // TODO: Need remove harcoded company id once will get it from API
                const companyId = 3;
                this.engineService.getAssetList(companyId).then(data => {
                    this.setState({ assetList: data.items, isAssingClicked: !this.state.isAssingClicked, selectedEngine: actionData.deviceId });
                });
                break;
            default:
                alert('Default');
                break;
        }
    }

    onAssignClick = () => {
        this.setState({ isAssingClicked: !this.state.isAssingClicked, selectedAsset: undefined });
    }

    assingEngine = () => {
        if (this.state.selectedAsset) {
            const inputData = {
                "deviceIds": [
                    this.state.selectedEngine
                ]
            }

            const selectedAsset = this.state.selectedAsset;
            this.engineService.assignEngine(inputData, selectedAsset[0].company.id, selectedAsset[0].id).then(data => {
                if (data.items == '200') {
                    let res = data.data.packet.body;
                    if (res.errors.length == 0) {
                        this.loadEngines();
                    } else {
                        // need to show the error message 
                    }
                } else {
                    // show error message in toaster
                }
            });
        }
        this.onAssignClick();
    }

    selectedAsset = (data) => {
        this.setState({ selectedAsset: data });
    }

    render() {
        return (
            <div>
                <EngineView header={this.state.Header} body={this.state.Body} search={this.SearchEngine} Sort={this.SortEngine} assetList={this.state.assetList} Show={this.state.Show} ActionButton={this.actionButton} isAssingClicked={this.state.isAssingClicked} assingClicked={this.onAssignClick} assingEngine={this.assingEngine} selectedAsset={this.selectedAsset} />
            </div>
        )
    }
}

export default EngineComponent;
