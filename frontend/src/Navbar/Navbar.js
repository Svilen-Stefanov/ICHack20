import React, { Component } from 'react';
import SchoolIcon from '@material-ui/icons/School';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SearchIcon from '@material-ui/icons/Search';
import queryString from "query-string";

import './Navbar.css';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: ""
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (!window.location.search)
            window.location.search = queryString.stringify({
                search: this.state.searchValue
            })
    }

    handleChange(e) {
        this.setState({
            searchValue: e.target.value
        })
    }

    render() {
        return (
            <nav className="Navbar-container">
                <div className="Navbar-logo">
                    <h1> <SchoolIcon /> Study Buddy</h1>
                </div>
                <div>
                    <SearchIcon />
                    <input
                        className="Navbar-search"
                        placeholder="Search skills"
                        type="text"
                        name="search"
                        value={this.state.searchValue}
                        onChange={this.handleChange}
                    />
                </div>
                <ul className="Navbar-items">
                    <li>Friends</li>
                    <li>item 2</li>
                    <li><AccountBoxIcon size={"inherit"} /></li>
                </ul>
            </nav>
        );
    }
}

export default Navbar;