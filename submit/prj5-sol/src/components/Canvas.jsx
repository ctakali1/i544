import './Canvas.css';
import { useEffect, useRef, useState } from 'react';
import React from 'react';

const Canvas = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const DRAW = { width: 20, height: 20 };
    const ZOOM = 10;
    const FG_COLOR = 'blue';
    let canvas = '';
    let last = { x: 0, y: 0 };
    let [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        canvas = canvasRef.current;
        canvas.width = DRAW.width; canvas.height = DRAW.height;
        canvas.style.width = `${ZOOM * DRAW.width}.px`;
        canvas.style.height = `${ZOOM * DRAW.height}px`;

        const context = canvas.getContext("2d");
        context.lineJoin = context.lineCap = "round";
        context.strokeStyle = FG_COLOR;
        context.lineWidth = 1;
        contextRef.current = context;
    }, []);

    const startDrawing = ({ nativeEvent }) => {
        // const { offsetX, offsetY } = nativeEvent;
        var canvas = document.getElementById("canvas");
        last = eventCanvasCoord(canvas, nativeEvent);
        isDrawing = true;
        setIsDrawing = true;
        // contextRef.current.beginPath();
        // contextRef.current.moveTo(offsetX, offsetY);
        // contextRef.current.lineTo(offsetX, offsetY);
        // contextRef.current.stroke();
        // setIsDrawing(true);
        // nativeEvent.preventDefault();
    }

    const draw = ({ nativeEvent }) => {
        if (!setIsDrawing && !isDrawing) {
            return;
        }
        var x = eventCanvasCoord(canvas, nativeEvent)['x'];
        var y = eventCanvasCoord(canvas, nativeEvent)['y'];
        contextRef.current.beginPath();
        contextRef.current.moveTo(last.x, last.y);
        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
        contextRef.current.closePath();
        last.x = eventCanvasCoord(canvas, nativeEvent)['x'];
        last.y = eventCanvasCoord(canvas, nativeEvent)['y'];
        // if (!isDrawing) {
        //     return;
        // }
        // var canvas = document.getElementById("canvas");
        // console.log(eventCanvasCoord(canvas, nativeEvent))
        // const { offsetX, offsetY } = nativeEvent;
        // contextRef.current.lineTo(offsetX, offsetY);
        // contextRef.current.stroke();
        // nativeEvent.preventDefault();
    }

    const stopDrawing = ({ nativeEvent }) => {
        if (!setIsDrawing && !isDrawing) {
            return;
        }
        var x = eventCanvasCoord(canvas, nativeEvent)['x'];
        var y = eventCanvasCoord(canvas, nativeEvent)['y'];
        contextRef.current.beginPath();
        contextRef.current.moveTo(x, y);
        contextRef.current.lineTo(last.x, last.y);
        contextRef.current.stroke();
        contextRef.current.closePath();
        last.x = 0;
        last.y = 0;
        setIsDrawing = false;
        isDrawing = false;
        // contextRef.current.closePath();
        // setIsDrawing(false);
    }

    const eventCanvasCoord = (canvas, ev) => {
        const x = (ev.pageX - canvas.offsetLeft) / ZOOM;
        const y = (ev.pageY - canvas.offsetTop) / ZOOM;
        return { x, y };
    }

    return (
        <canvas id="canvas" className="canvas-container"
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}>
        </canvas>
    )
}

/* import React, { Component } from 'react'
import ReactDOM from 'react-dom'

let last = { x: 0, y: 0 };
let last1 = { x: 0, y: 0 };
const ZOOM = 10;
let ctx;
class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDown: false,
        }
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    Classify(a, b) {
        console.log(a, b);
    }

    render() {
        let canvas = ReactDOM.findDOMNode(this.refs.canvas);
        console.log('canvas is ', this.state)
        ctx = canvas.current.getContext('2d');
        return (
            <div>
                <div>
                    <canvas id="canvas" ref="canvas" width={300} height={300}
                        onMouseDown={ev => {
                            let nativeEvent = ev.nativeEvent;
                            this.handleMouseDown(nativeEvent);
                        }}
                        onMouseMove={ev => {
                            let nativeEvent = ev.nativeEvent;
                            this.handleMouseMove(nativeEvent);
                        }}
                        onMouseUp={ev => {
                            let nativeEvent = ev.nativeEvent;
                            this.handleMouseUp(nativeEvent);
                        }}
                        onMouseLeave={ev => {
                            let nativeEvent = ev.nativeEvent;
                            this.handleMouseLeave(nativeEvent);
                        }}
                    />
                </div>
                <div>
                    <button onClick={this.Classify(this.ReactDOM, this.ctx)}>Classify</button>
                </div>
            </div>
        );
    }

    handleMouseLeave(event) {
        this.setState({
            isDown: false,
        })
    }
    handleMouseDown(event) {
        this.setState({
            isDown: true,
        }, () => {
            // const canvas = ReactDOM.findDOMNode(this.refs.canvas);
            var x = event.offsetX;
            var y = event.offsetY;
            last.x = x;
            last.y = y;
            last1.x = x + 1;
            last1.y = y + 1;
            // ctx = canvas.getContext("2d");
            this.draw(ctx, last, last1);
        }
        )
    }
    handleMouseMove(event) {
        if (this.state.isDown) {
            // const canvas = ReactDOM.findDOMNode(this.refs.canvas);
            var x = event.offsetX;
            var y = event.offsetY;
            last.x = x;
            last.y = y;
            last1.x = x + 1;
            last1.y = y + 1;
            // ctx = canvas.getContext("2d");
            this.draw(ctx, last, last1);
        }
    }
    handleMouseUp(event) {
        this.setState({
            isDown: false
        }, () => {
            // const canvas = ReactDOM.findDOMNode(this.refs.canvas);
            var x = event.offsetX;
            var y = event.offsetY;
            // ctx = canvas.getContext("2d");
            last.x = this.state.previousPointX;
            last.y = this.state.previousPointY;
            this.draw(ctx, { x: x, y: y }, last);
        })
    }
    componentDidMount() {
        // const canvas = ReactDOM.findDOMNode(this.refs.canvas);
        // ctx = canvas.getContext("2d");
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillRect(0, 0, 300, 300);
        ctx.strokeRect(2, 2, 296, 296);
    }

    draw(ctx, pt0, pt1) {
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1;
        ctx.beginPath()
        ctx.moveTo(pt0.x, pt0.y);
        ctx.lineTo(pt1.x, pt1.y);
        ctx.stroke();
        ctx.closePath();
    }

    eventCanvasCoord(canvas, ev) {
        const x = (ev.pageX - canvas.offsetLeft) / ZOOM;
        const y = (ev.pageY - canvas.offsetTop) / ZOOM;
        return { x, y };
    }
}*/

export default Canvas 