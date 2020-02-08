import React, { Component } from 'react';
import uuid from 'uuid/v4';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Fab from '@material-ui/core/Fab';

import "./ProfileCard.css";

class ProfileCard extends Component {

    static defaultProps = {
        imgUrl: "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
    }

    render() {
        const { name, age, imgUrl, institution, skills } = this.props;
        const skillsList = this.props.skills.map(skill => (
            <li key={uuid()}><CheckBoxIcon fontSize={"small"} /> {skill.skill_name}: {skill.experience_level}</li>
        ));
        return (
            <div className="ProfileCard-container">
                <h2>{name} ({age})</h2>
                <img src={imgUrl} />
                <h2>{institution}</h2>
                <h2>skills</h2>
                <ul>{skillsList}</ul>
                <div className="ProfileCard-footer">
                    <Fab className="ProfileCard-connectBtn" color={"primary"} variant={"extended"}><PersonAddIcon /> Connect</Fab>
                    <Fab className="ProfileCard-fullProfileBtn" variant={"extended"}>Full Profile</Fab>
                </div>
            </div>
        );
    }
}

export default ProfileCard;