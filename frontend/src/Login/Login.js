import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import { withRouter } from 'react-router-dom';

import './Login.css';

/* Route to the Videocall tab without */
const LoginButton = withRouter(({ history }) => (
    <Fab className="Login-button" color={"primary"} variant={"extended"} onClick={() => {
        history.push('/')
    }}>
        Login
    </Fab>
))

class Login extends Component {
    render() {
        return (
            <div class="Login-background">
                <div class="Landing-content-container">
                    <br />
                    <br />
                    <h1>Welcome to Study Buddy</h1>
                    <br />
                    <h1>Education without limits, powered by CISCO</h1>
                    <LoginButton />
                </div>
            </div>
        );
    }
}

export default Login;