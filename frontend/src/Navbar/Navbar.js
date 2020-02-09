import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import SchoolIcon from '@material-ui/icons/School';
import SettingsIcon from '@material-ui/icons/Settings';
import SearchIcon from '@material-ui/icons/Search';
import VideoCallIcon from '@material-ui/icons/VideoCall';

import Drawer from '@material-ui/core/Drawer';
import queryString from "query-string";
import { Link } from 'react-router-dom'

import './Navbar.css';

/* Route to the Videocall tab without */
const VideoCallButton = withRouter(({ history }) => (
    <VideoCallIcon fontSize={"large"} onClick={
        () => {
            history.push('/videocall')
        }} />
))

/* Route to the Videocall tab specifying a target user */
const ProfileButton = withRouter(({ history }) => (
    <button onClick={() => {
        history.push('/personal/' + localStorage.getItem('accountId'))
    }}>
        My Profile
    </button>
))

/* Route to the Videocall tab specifying a target user */
const FriendGraphButton = withRouter(({ history }) => (
    <button onClick={() => {
        history.push('/graph')
    }}>
        Friend Graph
    </button>
))

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: "",
            sideDrawerOpen: false,
            showFilter: true,
            showNav: true,
            onRouteChanged: () => {
                if (this.props.location.pathname === "/login") {
                    this.setState({
                        showNav: false
                    });
                }
                if (this.props.location.pathname !== "/") {
                    this.setState({
                        showFilter: false
                    });
                }
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleVideoCall = this.handleVideoCall.bind(this);
        console.log(this.props.location);
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.state.onRouteChanged()
        }
    }

    componentDidMount() {
        this.state.onRouteChanged()
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

    handleVideoCall() {

    }

    render() {
        const { showNav, showFilter } = this.state;

        if (showNav) {
            return (
                <nav className="Navbar-container" >

                    <div className="Navbar-logo">
                        <Link to="/">
                            <h1 className="Navbar-logo-text"> <SchoolIcon /> Study Buddy </h1>
                        </Link>
                    </div>
                    {showFilter && <div>
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
                    </div>}
                    <ul className="Navbar-items">
                        <li><VideoCallButton /></li>
                        <li><SettingsIcon fontSize={"large"} onClick={this.handleClick} /></li>
                    </ul>
                    <Drawer anchor={"right"} open={this.state.sideDrawerOpen} onClose={this.handleClick}>
                        <div className="Navbar-drawer">
                            <button className="Navbar-drawer-close" onClick={this.handleClick}>x</button>
                            <img src="https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80" />
                            <div>
                                <ProfileButton />
                                <FriendGraphButton />
                                <Link to="/login">
                                    <button>Logout</button>
                                </Link>
                            </div>
                        </div>
                    </Drawer>
                </nav >
            );
        } else {
            return (
                <div></div>
            );
        }
    }
}

export default withRouter(Navbar);