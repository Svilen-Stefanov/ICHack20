
// canvas.js

import React, { Component } from 'react';

import Graph from 'vis-react';
import './KnowledgeGraph.css';
import axios from 'axios';



class KnowledgeGraph extends Component {
    constructor(props) {
        super(props);
    }
    graph = {
        nodes: [
            { id: 1, label: 'Node 1' },
            { id: 2, label: 'Node 2' },
            { id: 3, label: 'Node 3' },
            { id: 4, label: 'Node 4' },
            { id: 5, label: 'Node 5' }
        ],
        edges: [{ from: 1, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 4 }, { from: 2, to: 5 }]
    }
    events = {
        select: function(event) {
            let { nodes, edges } = event;
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
        console.log('hi')
        axios.get('/knowledge_graph')
        .then(res => {
            console.log(res);
        });
    }
    render() {
        return (
            <main className="knowledge-graph-container">
                <Graph
                    graph={this.graph}
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
