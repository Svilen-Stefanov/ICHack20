import React, { Component } from 'react';
import axios from 'axios';
import uuid from 'uuid/v4';

import ProfileCard from './ProfileCard/ProfileCard';
import queryString from "query-string";


import "./Profiles.css";

class Profiles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilesLoaded: false,
            profiles: []
        }
    }
    componentDidMount() {
        console.log(queryString.parse(window.location.search))

        axios.get('/dashboard')
            .then(res => {

                const profilesRes = res.data;
                this.setState({
                    profiles: profilesRes.profiles,
                    profilesLoaded: true
                });
                console.log(profilesRes);
            });
    }

    render() {
        let profiles;
        this.state.profilesLoaded ?
            profiles = this.state.profiles.map(profile => {
                return (
                    <ProfileCard key={uuid()}
                        name={profile.name}
                        age={profile.age}
                        imgUrl={profile.imgUrl}
                        institution={profile.institution}
                        skills={profile.skills}
                    />
                )
            })
            : profiles = <p>Loading Profiles...</p>
        return (
            <main className="Profiles-container">
                <h1>Suggested Profiles</h1>
                {profiles}
            </main>
        );
    }
}

export default Profiles;