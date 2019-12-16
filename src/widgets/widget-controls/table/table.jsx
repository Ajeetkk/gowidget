import React, { Component } from 'react'
import { Icons, Pagination } from '../constants';
import "./table.scss";

export default class Table extends Component {
    constructor(props) {
        super(props);
        this.OlderState = 1;
    }

    selectRow = (rowIndex,columnIndex) => {
        if (this.props.IsClickable) {
            this.props.SelectedRow(rowIndex, columnIndex);
        }
    }

    header = () => {
        return (
            <ul className="commonGridHeader" id="company-header">
                {this.props && this.props.header && this.props.header.map((th, i) =>
                    <React.Fragment key={i}>  {this.tableHead(this.props.header, i)} </React.Fragment>
                )}
            </ul>
        )
    }

    noRecord = () => {
        return (
            <div className="commonGridScrollable">
                <ul className="no-records">
                    <li>
                        <span>{this.props.noRecordsText}</span>
                    </li>
                </ul>
            </div>
        )
    }

    lstTd = () => {
        return (
            <div className="commonGridScrollable">
                {
                    this.props.body.map((data, i) =>
                        
                    <>
                        <ul key={i} className={data.ClassName}>
                            {data.body.map((td, j) =>
                                <li key={j} onClick={this.selectRow.bind(this, i, j)}> {this.tableData(td.Type, td.Text)} </li>
                            )}
                        </ul>
                        {data.showChildren && (
                          <div className="detail-expand">
                            {data.children.map((td, j) => (
                              <>{td.body}</>
                            ))}
                            <> {data.editButton} </>
                          </div>
                        )}
                      </>
                    )
                }
            </div>
        )
    }

    body = () => {
        return (
            <React.Fragment> {this.props && this.props.body && this.props.body.length > 0 ? this.lstTd() : this.noRecord()}</React.Fragment>
        )
    }

    checkBox = (Type) => {
        return (
            <React.Fragment>
                <label className="checkBoxcontainer">
                    <input type="checkbox" />
                    <span className="checkmark" onClick={() => this.props.SelectAll(Type)}></span>
                </label>
            </React.Fragment>
        )
    }

    tableHead = (th, i) => {
        switch (th[i].Type) {
            case 'CheckBox':
                return (<li>{this.checkBox(th[i].Type)}</li>);
            case 'Text':
                return (<li className={th[i].ClassName} onClick={() => this.props.Sort(th, i)}>  {th[i].Text} </li>);
            default:
                return (<React.Fragment> </React.Fragment>);
        }
    }

    tableData = (type, data) => {
        switch (type) {
            case 'Link':
                return (<a href={data}> {data} </a>);
            case 'ActionClick':
                return (<span className="actionlink" onClick={() => this.props.ActionButton(type, data.Object)}> {data.Text} </span>);
            case 'Label':
                return (<span> {data} </span>);
            case 'Icon':
                return (<React.Fragment> {data.Action.map((d, i) => <React.Fragment key={i}> <span onClick={() => this.props.ActionButton(d, data.Object)}> <Icons IconName={d} /> </span> </React.Fragment>)} </React.Fragment>);
            case 'Telephone':
                return (<a href={"tel:" + data}> {data} </a>)
            case 'Email':
                return (<a href={"mailto:" + data}> {data} </a>)
            case 'CheckBox':
                return <React.Fragment>
                <label className="checkBoxcontainer">
                    <input type="checkbox" />
                    <span className="checkmark"onClick= {(event)=> this.props.ActionButton(type,data.Object,event)}></span>
                </label>
            </React.Fragment>
            case 'html':
                return (<React.Fragment>{data} </React.Fragment>);
            default:
                return (<React.Fragment> </React.Fragment>);
        }
    }

    pagenationView = () => {
        let totalItem = Math.ceil(this.props.PageConfig.PageCount / this.props.PageConfig.PageSize);
        return (
            <React.Fragment>
                <Pagination
                    itemsize={totalItem}
                    activePage={this.props.PageConfig.CurrentPageNumber}
                    handleSelect={this.handleSelect}
                />
            </React.Fragment>
        )
    }

    handleSelect = (number) => {
        if (this.OlderState != number) {
            this.props.ChangePage(number);
            this.OlderState = number;
        }
    }



    render() {
        return (
            <React.Fragment>
                {this.header()}
                {this.body()}
                { (this.props && this.props.PageConfig && this.props.PageConfig.PageCount) ? this.pagenationView() : null}
            </React.Fragment>
        )
    }
}

Table.defaultProps={
    noRecordsText:"No Records Found..."
};
