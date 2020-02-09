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
            profiles: [],
            search: ""
        }
    }
    componentDidMount() {
        this.setState({
            search: queryString.parse(window.location.search)
        });

        axios.get('/dashboard')
            .then(res => {

                const profilesRes = res.data;
                this.setState({
                    profiles: profilesRes,
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
                        imgUrl={profile.image_url}
                        institution={profile.institution}
                        skills={profile.skills}
                        targetAccountId={profile.profile_id}
                    />
                )
            })
            : profiles = <p>Loading Profiles...</p>
        return (
            <main className="Profiles-container">
                <h2>Search results for: {this.state.search.search}</h2>
                {profiles}
            </main>
        );
    }
}

export default Profiles;