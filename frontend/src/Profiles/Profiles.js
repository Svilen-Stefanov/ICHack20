import React, { Component } from 'react';
import axios from 'axios';
import uuid from 'uuid/v4';

import ProfileCard from './ProfileCard/ProfileCard';

import "./Profiles.css";

class Profiles extends Component {
    componentDidMount() {
        axios.get('http://127.0.0.1:5000/dashboard')
        .then(res => {
            const profiles = res.data;
            console.log(profiles);
        });
    }
    static defaultProps = {
        profiles: [
            {
                name: "Eddy",
                age: "20",
                imgUrl: "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
                institution: "Imperial College London",
                skills: [ 
                    {
                        skill_name: "Maths", 
                        experience_level: "Intermediate" 
                    }, 
                    {
                        skill_name: "Physics", 
                        experience_level: "Beginner" 
                    }
                ]
            },
            {
                name: "Eddy",
                age: "20",
                imgUrl: "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
                institution: "Imperial College London",
                skills: [ 
                    {
                        skill_name: "Maths", 
                        experience_level: "Intermediate" 
                    }, 
                    {
                        skill_name: "Physics", 
                        experience_level: "Beginner" 
                    }
                ]
            }
            
        ]
    }
    
    render() {
        const profiles = this.props.profiles.map(profile => (
            <ProfileCard key={uuid()} data = {profile}/>
        ));
        return (
            <main className="Profiles-container">
                <h1>Suggested Profiles</h1>
                {profiles}
            </main>
        );
    }
}

export default Profiles;