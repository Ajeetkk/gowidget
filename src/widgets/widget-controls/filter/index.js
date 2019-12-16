import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./index.scss";
import {Icons } from '../constants';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterUser: {
        Role: [
          { name: "GM User", id: 2 },
          // { name: "Service Engineer", id: 3 },
          { name: "Company  Admin", id: 4 }
        ]
        // Type: [
        //   { name: "Admin", id: 1 },
        //   { name: "Guest", id: 2 },
        //   { name: "Guest 2", id: 3 },
        //   { name: "Guest 3", id: 4 }
        // ]
      },
      filterCheck: [],
      applyFilterCheck: [],
      ResultsShow: "",
      roleResults: false,
      typeResults: false,
      activeShow: false,
      checkBoxDefaultStatus: false,
      activeButton: false,
      submitting: true
    };
  }
  componentDidMount() {
    document.addEventListener("click", this.handleClickOutside, true);
  }
  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside, true);
  }
  handleClickOutside = event => {
    const domNode = ReactDOM.findDOMNode(this);
    if (!domNode || !domNode.contains(event.target)) {
      this.setState({
        ResultsShow: ""
      });
    }
  };
  //Filter popup open
  handleRolePopup = (method, e) => {
    this.state.ResultsShow != method
      ? this.setState({ ResultsShow: method })
      : this.setState({ ResultsShow: "" });
  };

  //Filter get checkbox value
  handleCheckValue(filterType, e) {
    var arr = {};
    arr["id"] = e.target.id;
    arr["name"] = e.target.name;
    arr["filter"] = filterType;
    const filterCheck = this.state.filterCheck;
    if (e.target.checked) {
      filterCheck.push(arr);
    } else {
      var index = filterCheck.findIndex(
        p => p.name === e.target.name && p.filter === filterType
      );
      filterCheck.splice(index, 1);
    }
    this.setState({ filterCheck: filterCheck });
    if (filterCheck.length === 0) {
      this.setState({ submitting: true });
    } else {
      this.setState({ submitting: false });
    }
  }

  //Reset all
  handleResetAll = () => {
    this.setState({
      filterCheck: [],
      applyFilterCheck: [],
      activeShow: false,
      activeButton: false,
      submitting: true,
      ResultsShow: ""
    });
    this.props.Filter([]);
  };

  handleClearFilter = check => {
    //console.log(check.filter);
    const filterCheck = this.state.filterCheck;
    var index = filterCheck.findIndex(
      p => p.id === check.id && p.filter === check.filter
    );
    filterCheck.splice(index, 1);

    const applyFilterCheck = this.state.applyFilterCheck;
    var checkIndex = applyFilterCheck.findIndex(
      p => p.id === check.id && p.filter === check.filter
    );
    applyFilterCheck.splice(checkIndex, 1);

    if (applyFilterCheck.length === 0) {
      this.setState({
        activeShow: false,
        activeButton: false,
        submitting: true
      });
    }
    this.setState({
      filterCheck: filterCheck,
      applyFilterCheck: applyFilterCheck
    });
    this.props.Filter(this.state.filterCheck);
  };

  //Filter popup close
  handleFilter = e => {
    this.setState({ applyFilterCheck: [...this.state.filterCheck] });
    e.preventDefault();
    this.setState({
      ResultsShow: "",
      activeShow: true,
      typeResults: true,
      roleResults: false
    });
    const filterCheck = this.state.filterCheck;
    if (filterCheck.length === 0) {
      this.setState({ activeButton: false });
    } else {
      this.setState({ activeButton: true });
    }
    this.props.Filter(this.state.filterCheck);
  };

  render() {
    const {
      activeButton,
      activeShow,
      filterUser,
      filterCheck,
      applyFilterCheck,
      submitting
    } = this.state;

    return (
      <section className="filter-widget">
        {Object.keys(filterUser).map((method, methodIndex) => {
          return (
            <React.Fragment key={method}>
              <div className="filter-dropdown">
                <div className="role-filter float-left">
                  <button
                    className={
                      "button col-12 " +
                      (this.ResultsShow === methodIndex,
                        activeButton ? "button-active " : "button-inactive")
                    }
                    value={method}
                    onClick={this.handleRolePopup.bind(this, method)}
                  >
                    {method} <span className="down-arrow">
                        <Icons IconName={"Filter-Icon"} />
                      </span>
                  </button>
                </div>
                {this.state.ResultsShow == method ? (
                  <div className="p-10 filter-popup float-left" id={method}>
                    {filterUser[method].map((v, index) => {
                      return (
                        <label className="checkBoxcontainer" key={v.id}>
                          <input
                            onChange={this.handleCheckValue.bind(this, method)}
                            name={v.name}
                            value={v.id}
                            id={v.id}
                            checked={
                              filterCheck.findIndex(
                                p => p.id == v.id && p.filter == method
                              ) != -1
                                ? true
                                : false
                            }
                            type="checkbox"
                          />
                          <span className="checkmark"></span>
                          <span htmlFor={v.id}>{v.name}</span>
                        </label>
                      );
                    })}

                    <button
                      className="apply-btn button"
                      onClick={this.handleFilter}
                      disabled={submitting}
                    >
                      Apply
                    </button>
                  </div>
                ) : null}
              </div>
            </React.Fragment>
          );
        })}

        <div
          className={
            "selected-filter float-left col-9 p-0 " + (!activeShow ? "hidden " : "")
          }
        >
          {applyFilterCheck.map(check => (
            <div className="selected-filter-tab" key={check.filter + check.id}>
              <span>{check.name}</span>
              <span
                id={check.id}
                onClick={() => this.handleClearFilter(check)}
                className="close-icon"
              >
                <Icons IconName={"Tag-close"} />
              </span>
            </div>
          ))}

          <button className="filter-reset" onClick={this.handleResetAll}>
            Reset all
          </button>
        </div>
      </section>
    );
  }
}
Filter.propTypes = {
  btnClass: PropTypes.string.isRequired,
  TextValue: PropTypes.string.isRequired
};

export default Filter;


