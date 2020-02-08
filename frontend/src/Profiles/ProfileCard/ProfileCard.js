import React, { Component } from 'react';
import uuid from 'uuid/v4';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import "./ProfileCard.css";

class ProfileCard extends Component {
    render() {
        let { name, age, imgUrl, institution, skills } = this.props.data;
        const skillsList = this.props.data.skills.map (skill => (
            <li key={uuid()}><CheckBoxIcon fontSize={"small"}/> {skill.skill_name}: {skill.experience_level}</li>
        ));
        return (
        <div className="ProfileCard-container">
            <PersonAddIcon />
            <h2>{name} ({age})</h2>
            <img src={imgUrl}/>
            <h2>{institution}</h2>
            <h2>skills</h2>
            <ul>{skillsList}</ul>
        </div>
        );
    }
}

export default ProfileCard;