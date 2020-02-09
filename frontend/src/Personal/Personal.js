import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';
import JSONBigInt from 'json-bigint';
import uuid from 'uuid/v4';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import "./Personal.css";

import { useStateWithLocalStorage } from '../utils'

function Personal(props) {
    const [accountId, setAccountId] = useStateWithLocalStorage(
        'accountId'
    );

    const targetAccountId = props.match.params.targetAccountId

    const [targetUser, setTargetUser] = useState(null);

    const [skillsList, setSkillsList] = useState([])

    /* Retrieve user data if one is specifying a target */
    useEffect(() => {
        if (targetAccountId) {
            console.log("TARGET ID: " + targetAccountId);

            axios.get('/profile/' + targetAccountId, { transformResponse: [data => data] })
                .then(res => {
                    setTargetUser(JSONBigInt.parse((res.data)))
                }).catch(err => {
                    console.err(err)
                });
        }
    }, [targetAccountId])

    useEffect(() => {
        if (targetUser) {
            setSkillsList(targetUser.skills.map(skill => (
                <li key={uuid()}><CheckBoxIcon fontSize={"small"} /> {skill.skill_name}: {"*".repeat(skill.experience_level)}</li>
            )));
        }
    }, [targetUser])

    return (
        <div>
            {targetUser && <div className={"Personal-container"}>
                <h2> {targetUser.first_name} {targetUser.last_name}</h2>
                <h3>{targetUser.date_of_birth}</h3>
                <img src={targetUser.imgUrl || "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"} />
                <h3>{targetUser.institution}</h3>
                <h3>skills  </h3>
                <ul>{skillsList}</ul>
            </div>
            }
        </div>
    )

}

export default withRouter(Personal);