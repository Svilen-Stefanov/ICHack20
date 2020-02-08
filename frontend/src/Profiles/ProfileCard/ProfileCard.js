import React, { Component } from 'react';
import Card from '@material-ui/core/Card';

import "./ProfileCard.css";

class ProfileCard extends Component {
    render() {
        let { name, age, imgSrc, skills } = this.props.data;
        return (
        <div className="ProfileCard-container">
            <h2>{name}</h2>
            <img src={imgSrc}/>
            <p>wkejfnkwnef</p>
            <p>wkefnkwenfkj</p>
        </div>
        );
    }
}

export default ProfileCard;