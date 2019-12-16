import React, { Component } from 'react';
import { Pagination, ToggleButton } from 'react-bootstrap';
import './index.scss'
export default class Paginator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            active: this.props.activePage
        }
    }

    handleSelect(eventKey) {
        this.setState({ active: eventKey });
        this.props.handleSelect(eventKey);
    }

    prepareItems = (itemSize, active) => {
        let item = [];
        for (let number = 1; number <= itemSize; number++) {
            item.push(number);
        }
        return (
            <React.Fragment>
                {
                    item.map((data, i) =>
                        <Pagination.Item onClick={this.handleSelect.bind(this, data)} key={i} active={this.state.active === data}>
                            {data}
                        </Pagination.Item>
                    )
                }
            </React.Fragment>
        )
    }

    render() {
        return (
            <div className="paginationWrapper">
                <Pagination size="md">
                    <Pagination.Prev onClick={this.handleSelect.bind(this, this.state.active > 1 ? this.state.active - 1 : 1)} />
                    {this.prepareItems(this.props.itemsize, this.props.activePage)}
                    <Pagination.Next onClick={this.handleSelect.bind(this, this.state.active < this.props.itemsize ? this.state.active + 1 : this.props.itemsize)} />
                </Pagination>
            </div>
        );
    }
}

