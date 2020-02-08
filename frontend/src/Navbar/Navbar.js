import React, { Component } from 'react';
import SchoolIcon from '@material-ui/icons/School';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

import './Navbar.css';

class Navbar extends Component {
    render(){
        return(
            <nav className="Navbar-container">
                <div className="Navbar-logo">
                    <h1> <SchoolIcon /> Study Buddy</h1>
                </div>

                <ul className="Navbar-items">
                    <li>Friends</li>
                    <li>item 2</li>
                    <li><AccountBoxIcon size={"inherit"}/></li>
                </ul>
            </nav>
        );
    }
}

export default Navbar;