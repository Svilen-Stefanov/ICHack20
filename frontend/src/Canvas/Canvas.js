// canvas.js

import React, { Component } from 'react';
import io from 'socket.io-client';

import './Canvas.css'

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.endPaintEvent = this.endPaintEvent.bind(this);
        this.state = { show: false };
    }
    isPainting = false;
    // Different stroke styles to be used for user and guest
    userStrokeStyle = '#EE92C2';
    guestStrokeStyle = '#F0C987';
    line = [];
    prevPos = { offsetX: 0, offsetY: 0 };

    onMouseDown({ nativeEvent }) {
        const { offsetX, offsetY } = nativeEvent;
        this.isPainting = true;
        this.prevPos = { offsetX, offsetY };
    }

    onMouseMove({ nativeEvent }) {
        if (this.isPainting) {
            const { offsetX, offsetY } = nativeEvent;
            const offSetData = { offsetX, offsetY };
            // Set the start and stop position of the paint event.
            const positionData = {
                start: { ...this.prevPos },
                stop: { ...offSetData },
            };
            // Add the position to the line array
            this.line = this.line.concat(positionData);
            this.paint(this.prevPos, offSetData, this.userStrokeStyle);
        }
    }
    endPaintEvent() {
        if (this.isPainting) {
            this.isPainting = false;
            this.sendPaintData();
        }
    }
    paint(prevPos, currPos, strokeStyle) {
        const { offsetX, offsetY } = currPos;
        const { offsetX: x, offsetY: y } = prevPos;

        this.ctx.beginPath();
        this.ctx.strokeStyle = strokeStyle;
        // Move the the prevPosition of the mouse
        this.ctx.moveTo(x, y);
        // Draw a line to the current position of the mouse
        this.ctx.lineTo(offsetX, offsetY);
        // Visualize the line using the strokeStyle
        this.ctx.stroke();
        this.prevPos = { offsetX, offsetY };
    }

    async sendPaintData() {
        const body = {
            line: this.line
        };

        this.line = [];
    }

    componentDidMount() {
        // Here we set up the properties of the canvas element. 

        console.log(this.canvas.width, this.canvas.height);

        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 5;
        setTimeout(() => {
            this.canvas.width = document.getElementById('outer').offsetWidth;
            this.canvas.height = document.getElementById('outer').offsetHeight;
            this.setState({ show: true });
        }, 1000);
        
        io.connect('localhost:5000');
        // socket.emit('my_event', {data: 'I\'m connected!'});

    }
    componentDidUpdate() {
    }

    render() {
        return (
            <main className="canvas-container">
                <div id="outer" className="canvas-left">
                    <canvas id="canvas"
                        // We use the ref attribute to get direct access to the canvas element. 
                        ref={(ref) => (this.canvas = ref)}
                        style={{
                            background: 'black',
                            visibility: this.state.show ? 'visible' : 'hidden'
                        }}
                        onMouseDown={this.onMouseDown}
                        onMouseLeave={this.endPaintEvent}
                        onMouseUp={this.endPaintEvent}
                        onMouseMove={this.onMouseMove}
                    />
                </div>

            </main>
        );
    }
}
export default Canvas;
