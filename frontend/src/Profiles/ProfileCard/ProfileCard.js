import React, { Component } from 'react';
import uuid from 'uuid/v4';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import StarIcon from '@material-ui/icons/Star';
import Fab from '@material-ui/core/Fab';
import { Route, withRouter } from 'react-router-dom';
import queryString from "query-string";
import axios from 'axios';
import JSONBigInt from 'json-bigint';

import "./ProfileCard.css";

/* Route to the Videocall tab specifying a target user */
const ConnectButton = withRouter(({ history, targetAccountId }) => (
    <Fab className="ProfileCard-connect" color={"primary"} variant={"extended"} onClick={() => {
        history.push('/videocall')
        window.location.search = queryString.stringify({
            target: targetAccountId
        })
    }}>
        <VideoCallIcon />
        VideoCall
    </Fab>
))

/* Prompt the user to become a friend */
const FriendButton = (({ targetName, targetId, friendshipSetter }) => (
    <Fab className="ProfileCard-connect" color={"secondary"} variant={"extended"} onClick={() => {
        if (window.confirm('Do you wish to add ' + targetName + ' as a friend?')) {

            axios.put('/dashboard', { user_id: targetId })
                .then(res => {
                    friendshipSetter(true)
                }).catch(err => {
                    console.err(err)
                });
        }
        else {
            console.log("You did not procees with friend request");
        }

    }}>
        <PersonAddIcon />
        Connect
    </Fab>
))

/* Route to the Detail tab */
const ProfileButton = withRouter(({ history, targetAccountId }) => (
    <Fab className="ProfileCard-fullProfile" color={"primary"} variant={"extended"} onClick={() => {
        history.push('/personal/' + targetAccountId)
    }}>Full Profile</Fab>
))

class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: props.status,
        }
    }

    static defaultProps = {
        defaultImgUrl: "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
    }

    render() {
        let { name, age, imgUrl, institution, status, targetAccountId } = this.props;

        if (imgUrl === "") {
            imgUrl = this.props.defaultImgUrl;
        }
        const skillsList = this.props.skills.slice(0, 2).map(skill => (
            <li key={uuid()}><CheckBoxIcon fontSize={"small"} /> {skill.skill_name}: {"*".repeat(skill.experience_level)}</li>
        ));

        const friendshipSetter = (state) => {
            status = state
            this.setState({
                status: state
            });
            console.log("Status updated!");

        }
        return (
            <div className="ProfileCard-container">
                <h2 className="Profile-name">{name} ({age})</h2>
                <img src={imgUrl} />
                <h2 className="Profile-institution">{institution}</h2>
                <div className="Profile-skills">
                    <ul>{skillsList}</ul>
                </div>
                <div className="ProfileCard-footer">
                    {this.state.status ? <ConnectButton targetAccountId={targetAccountId} /> : <FriendButton targetName={name} targetId={targetAccountId} friendshipSetter={friendshipSetter} />}
                    <ProfileButton targetAccountId={targetAccountId} />
                </div>
            </div >
        );
    }
}

export default ProfileCard;