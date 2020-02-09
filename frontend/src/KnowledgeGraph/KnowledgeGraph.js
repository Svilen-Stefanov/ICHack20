
// canvas.js

import React, { Component, useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import spread from 'cytoscape-spread';
import uuid from 'uuid/v4';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import queryString from "query-string";
import Fab from '@material-ui/core/Fab';
import { Route, withRouter } from 'react-router-dom';
import VideoCallIcon from '@material-ui/icons/VideoCall';

import CytoscapeComponent from 'react-cytoscapejs';

import './KnowledgeGraph.css';
import axios from 'axios';
import JSONBigInt from 'json-bigint';

const ConnectButton = withRouter(({ history, targetAccountId }) => (
    <Fab className="kg-connect" color={"primary"} variant={"extended"} onClick={() => {
        history.push('/videocall')
        window.location.search = queryString.stringify({
            target: targetAccountId
        })
    }}>
        <VideoCallIcon />
        VideoCall
    </Fab>
))


class KnowledgeGraph extends Component {
    constructor(props) {
        super(props);
        this.cy = null;
        this.color_maps = {};
        this.state = {
            elements: [],
            layout: { name: 'cise' },
            style: {},
            show: false,
            friend_name: '',
            friend_institution: '',
            friend_profile_pic: '',
            friend_pid: '',
            friend_skills: []
        };
    }

    componentDidMount() {
        const accountId = localStorage.getItem('accountId');
        if (accountId) {
            axios.defaults.headers.common = {
                'Account-Id': accountId
            };

            axios.get('/knowledge_graph', { transformResponse: [data => data] })
                .then(res => {
                    res = JSONBigInt.parse(res.data);
                    const friends = res.friends;
                    const myself = res.myself;
                    let elements = [{ data: {id: 1, label: myself.first + ' ' + myself.last }}];
                    let cluster_col = {};
                    let col_index = 0;
                    let colors = [
                        '#FFA07A', '#9B0000', '#FF8C00', '#BDB76B', '#7FFF00',
                        '#7FFFD4', '#008080', '#4682B4', '#7B68EE', '#DDA0DD',
                        '#800080', '#DB7093', '#F5F5DC', '#FAEBD7', '#778899',
                        '#FFEBCD', '#BC8F8F', '#A0522D', '#800000', '#DAA520'
                    ]
                    for (let i = colors.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [colors[i], colors[j]] = [colors[j], colors[i]];
                    }

                    for (let i = 0; i < Math.min(friends.length, 20); ++i) {
                        if (!cluster_col.hasOwnProperty(friends[i].subject)) {
                            cluster_col[friends[i].subject] = colors[col_index];
                            col_index++;
                        }
                        elements.push({
                            data: {
                                id: i + 2,
                                pid: friends[i].id,
                                label: friends[i].first + ' ' + friends[i].last,
                                color: cluster_col[friends[i].subject], shape: "Rectangle"

                            }
                        })
                        this.color_maps = cluster_col;

                        elements.push({
                            data: { source: 1, target: i + 2 }
                        })

                    }
                    this.setState({
                        elements: [
                            ...this.state.elements, ...elements
                        ]
                    });
                    this.setState({
                        layout: {
                            ...this.state.layout,
                            name: 'spread',
                            animate: true, // Whether to show the layout as it's running
                            ready: undefined, // Callback on layoutready
                            stop: undefined, // Callback on layoutstop
                            fit: true, // Reset viewport to fit default simulationBounds
                            minDist: 20, // Minimum distance between nodes
                            padding: 20, // Padding
                            expandingFactor: -1.0, // If the network does not satisfy the minDist
                            // criterium then it expands the network of this amount
                            // If it is set to -1.0 the amount of expansion is automatically
                            // calculated based on the minDist, the aspect ratio and the
                            // number of nodes
                            prelayout: { name: 'cose' }, // Layout options for the first phase
                            maxExpandIterations: 4, // Maximum number of expanding iterations
                            boundingBox: undefined, // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
                            randomize: true // Uses random initial node positions on true
                                                                          }
                    });
                    this.setState({
                        style: {
                            ...this.state.style,
                            width: '100%',
                            height: '100%',

                        }
                    })
                    this.setState({ show: true }, () => {
                        if (this.cy) {
                            this.cy.style().selector('node').style({
                                'content': 'data(label)',
                                'background-color': 'data(color)',
                                'width': '20px',
                                'height': '20px'
                            }).update();
                            this.cy.nodes().on('click', function(e){
                                let clickedNode = e.target;
                                let data = clickedNode._private.data;
                                if (!data.pid) { return; }
                                axios.get('/profile/' + data.pid, { transformResponse: [data => data] })
                                .then(res => {
                                    res = JSONBigInt.parse(res.data);
                                    console.log(res)
                                    this.setState({
                                        friend_name: res.first_name + ' ' + res.last_name,
                                        friend_institution: res.institution,
                                        friend_skills: res.skills,
                                        friend_profile_pic: res.profile_pic,
                                        friend_pid: data.pid
                                    })
                                    console.log(res);
                                });
                            }.bind(this));

                        }
                    });

                });
        }
    }

    render() {
        cytoscape.use(spread);
        const skillsList = this.state.friend_skills.map(skill => (
            <li key={uuid()}><CheckBoxIcon fontSize={"small"} /> {skill.skill_name}: {"*".repeat(skill.experience_level)}</li>
        ));

        const colorList = [];
        for (let key of Object.keys(this.color_maps)) {
            colorList.push(
                <div style={{float: 'left'}} key={uuid()}>
                    <div style={{'marginRight': '1em'}}><span style={{height: '1em', width: '1em', 'borderRadius': '50%', display: 'inline-block', 'backgroundColor': this.color_maps[key]}}></span>{key}</div>
                </div>
            )
        }

        return (
            <main className="knowledge-graph-container">
                <div className="knowledge-graph-fg">
                    <img className="knowledge-pic" src={this.state.friend_profile_pic} />
                    <div className="knowledge-name">{this.state.friend_name}</div>
                    <div className="knowledge-instituion">{this.state.friend_institution}</div>
                    {skillsList}
                    { this.state.friend_name == '' ? <div></div> :
                        <ConnectButton targetAccountId={this.state.friend_pid} />
                    }

                </div>
                <div className="knowledge-graph-bg">
                {this.state.show ? <CytoscapeComponent
                    cy={(cy) => { this.cy = cy }}
                    elements={this.state.elements} layout={this.state.layout} style={ { width: '100%', height: '100%' } } />
                : <div></div>}
                </div>
                <div className="kg-footer">{colorList}</div>
            </main>
        );
    }
}
export default KnowledgeGraph;
