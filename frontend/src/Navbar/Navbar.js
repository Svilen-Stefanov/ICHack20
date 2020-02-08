import React, { Component } from 'react';
import SchoolIcon from '@material-ui/icons/School';

import './Navbar.css';

class Navbar extends Component {
    render(){
        return(
            <nav className="Navbar-container">
                <div className="Navbar-logo">
                    <h1> <SchoolIcon /> Study Buddy</h1>
                </div>

                <ul className="Navbar-items">
                    <li>item 1</li>
                    <li>item 2</li>
                    <li>item 3</li>
                </ul>
            </nav>
        );
    }
}

export default Navbar;