import React, { Component } from 'react';
import SchoolIcon from '@material-ui/icons/School';

import './Canvas.css';

class Canvas extends Component {
    constructor() {
        super()
        this.drawing = false;
        this.current = {
            color: 'black'
        };

    }
    componentDidMount() {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        let mousePos = (e) => {
            let x = e.offsetX;
            let y = e.offsetY;
            console.log(x, y, e)
            return [x, y];
        }
        let onMouseDown = (e) => {
            this.drawing = true;
            [this.current.x, this.current.y] = mousePos(e);
        };

        let onMouseUp = (e) => {
            if (!this.drawing) { return; }
            this.drawing = false;
            let [nextX, nextY] = mousePos(e);
            drawLine(this.current.x, this.current.y, nextX, nextY, this.current.color, true);
            [this.current.x, this.current.y] = [nextX, nextY];
        }

        let onMouseMove = (e) => {
            if (!this.drawing) { return; }
            let [nextX, nextY] = mousePos(e);
            drawLine(this.current.x, this.current.y, nextX, nextY, this.current.color, true);
            [this.current.x, this.current.y] = [nextX, nextY];
        }

        let onColorUpdate = (e) => {
            this.current.color = e.target.className.split(' ')[1];
        }

        // limit the number of events per second
        let throttle = (callback, delay) => {
            var previousCall = new Date().getTime();
            return () => {
                var time = new Date().getTime();
                if ((time - previousCall) >= delay) {
                    previousCall = time;
                    callback.apply(null, arguments);
                }
            };
        };

        let onDrawingEvent = (data) => {
            var w = this.canvas.width;
            var h = this.canvas.height;
            drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
        }

        // make the canvas fill its parent
        let onResize = () => {
            // this.canvas.width = window.innerWidth;
            // this.canvas.height = window.innerHeight;
        }


        let drawLine = (x0, y0, x1, y1, color, emit) => {
            this.context.beginPath();
            this.context.moveTo(x0, y0);
            this.context.lineTo(x1, y1);
            this.context.strokeStyle = color;
            this.context.lineWidth = 1;
            this.context.stroke();
            this.context.closePath();
            console.log(x0, y0, x1, y1);
            if (!emit) { return; }
            var w = this.canvas.width;
            var h = this.canvas.height;

            // socket.emit('drawing', {
            //   x0: x0 / w,
            //   y0: y0 / h,
            //   x1: x1 / w,
            //   y1: y1 / h,
            //   color: color
            // });
        }

        this.canvas.addEventListener('mousedown', function (e) { onMouseDown(e); }.bind(this), false);
        this.canvas.addEventListener('mouseup', function (e) { onMouseUp(e); }.bind(this), false);
        this.canvas.addEventListener('mouseout', function (e) { onMouseUp(e); }.bind(this), false);
        this.canvas.addEventListener('mousemove', function (e) { throttle(onMouseMove(e), 10) }.bind(this), false);

        //Touch support for mobile devices
        this.canvas.addEventListener('touchstart', function (e) { onMouseDown(e); }.bind(this), false);
        this.canvas.addEventListener('touchend', function (e) { onMouseUp(e); }.bind(this), false);
        this.canvas.addEventListener('touchcancel', function (e) { onMouseUp(e); }.bind(this), false);
        this.canvas.addEventListener('touchmove', function (e) { throttle(onMouseMove(e), 10) }.bind(this), false);

 
    }
    render() {
        return (
            <main className="canvas-container">
                <div className="canvas-left">
                    <canvas id="canvas" className="canvas-canvas"></canvas>

                </div>
                <div className="canvas-right">Right</div>
            </main>
        );
    }
}

export default Canvas;