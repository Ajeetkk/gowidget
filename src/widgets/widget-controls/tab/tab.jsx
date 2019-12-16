import React, { Component } from 'react'
import TabButtons from './tabuttons';
import TabContent from './tabcontent';
import "./tab.scss"
export default class Tab extends Component {
    render() {
        return (
            <>
                <div className="col-xs-12 tab-buttons">
                    <TabButtons TabButtons={this.props.TabButtons} ChangeTab={this.props.ChangeTab}/>
                </div>
                <div className="col-xs-12 col-sm-12 p-0 d-flex">
                    <TabContent Content={this.props.Component} />
                </div>
            </>
        )
    }
}
