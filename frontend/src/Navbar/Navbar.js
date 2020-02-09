import React, { Component } from 'react';
import SchoolIcon from '@material-ui/icons/School';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SearchIcon from '@material-ui/icons/Search';
import Drawer from '@material-ui/core/Drawer';
import queryString from "query-string";
import { Link } from 'react-router-dom'

import './Navbar.css';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: "",
            sideDrawerOpen: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(e) {
        this.setState({
            searchValue: e.target.value
        })
    }

    handleSubmit(e) {
        window.location.search = queryString.stringify({
            search: this.state.searchValue
        })
        e.preventDefault();
    }

    handleClick() {
        this.setState({
            sideDrawerOpen: !this.state.sideDrawerOpen
        });
    }

    render() {
        return (
            <nav className="Navbar-container">

                <div className="Navbar-logo">
                    <Link to="/">
                        <h1> <SchoolIcon /> Study Buddy</h1>
                    </Link>
                </div>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <SearchIcon />
                        <input
                            className="Navbar-search"
                            placeholder="Search skills.."
                            type="text"
                            name="search"
                            value={this.state.searchValue}
                            onChange={this.handleChange}
                        />
                    </form>
                </div>
                <ul className="Navbar-items">
                    <li>Friends</li>
                    <li>item 2</li>
                    <li><AccountBoxIcon size={"inherit"} onClick={this.handleClick} /></li>
                </ul>
                <Drawer anchor={"right"} open={this.state.sideDrawerOpen} onClose={this.handleClick}>
                    <div className="Navbar-drawer">
                        <img src="https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80" />
                        <div>
                            <button>My Profile</button>
                            <button>Settings</button>
                            <button>Logout</button>
                        </div>
                    </div>
                </Drawer>
            </nav>
        );
    }
}

export default Navbar;