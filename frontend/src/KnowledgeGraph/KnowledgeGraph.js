
// canvas.js

import React, { Component, useEffect, useState } from 'react';

import Graph from 'vis-react';
import './KnowledgeGraph.css';
import axios from 'axios';
import JSONBigInt from 'json-bigint';

import { useStateWithLocalStorage } from '../utils'


class KnowledgeGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graph: {
                nodes: [{id: 1, label: 'None'}],
                edges: [{}]
            }
        };
    }
    events = {
        select: function(event) {
            let { nodes, edges } = event;
            console.log(nodes, edges)
        }
    }
    options = {
        layout: {
        },
        edges: {
            color: '#000000'
        }
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
                    // console.log(friends)
                    console.log(myself.first + ' ' + myself.last)

                    let nodes = [{ id: 1, label: myself.first + ' ' + myself.last}];
                    for (let i = 0; i < friends.length; ++i) {
                        nodes.push({id: i + 2, label: friends[i].first + ' ' + friends[i].last});
                    }
                    let edges = [];
                    for (let i = 0; i < friends.length; ++i) {
                        edges.push({from: 1, to: i + 2});
                    }
                    this.setState({graph: {
                        ...this.state.graph,
                        nodes: nodes,
                        edges: edges
                    }});
                });
        }

    }
    render() {
        return (
            <main className="knowledge-graph-container">
                <Graph
                    graph={this.state.graph}
                    options={this.options}
                    events={this.events}
                    getNetwork={this.getNetwork}
                    getEdges={this.getEdges}
                    getNodes={this.getNodes}
                    vis={vis => (this.vis = vis)}
                />
            </main>
        );
    }
}
export default KnowledgeGraph;
