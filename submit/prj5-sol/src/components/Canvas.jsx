import React, { Component } from 'react'
import ReactDOM from 'react-dom'

let last = { x: 0, y: 0 };
let last1 = { x: 0, y: 0 };
const ZOOM = 10;
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

    render() {
        return (
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
        );
    }

    handleMouseLeave(event) {
        this.setState({
            isDown: false,
        })
    }
    handleMouseDown(event) {
        this.setState({
            // last: this.eventCanvasCoord(ReactDOM.findDOMNode(this.refs.canvas), event),
            isDown: true,
        }, () => {
            const canvas = ReactDOM.findDOMNode(this.refs.canvas);
            var x = event.offsetX;
            var y = event.offsetY;
            last.x = x;
            last.y = y;
            last1.x = x + 1;
            last1.y = y + 1;
            var ctx = canvas.getContext("2d");
            this.draw(ctx, last, last1);
        }
        )
    }
    handleMouseMove(event) {
        if (this.state.isDown) {
            const canvas = ReactDOM.findDOMNode(this.refs.canvas);
            var x = event.offsetX;
            var y = event.offsetY;
            last.x = x;
            last.y = y;
            last1.x = x + 1;
            last1.y = y + 1;
            var ctx = canvas.getContext("2d");
            this.draw(ctx, last, last1);
        }
    }
    handleMouseUp(event) {
        this.setState({
            isDown: false
        }, () => {
            const canvas = ReactDOM.findDOMNode(this.refs.canvas);
            var x = event.offsetX;
            var y = event.offsetY;
            var ctx = canvas.getContext("2d");
            last.x = this.state.previousPointX;
            last.y = this.state.previousPointY;
            this.draw(ctx, { x: x, y: y }, last);
        })
    }
    componentDidMount() {
        const canvas = ReactDOM.findDOMNode(this.refs.canvas);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillRect(0, 0, 300, 300);
        ctx.strokeRect(2, 2, 296, 296);
    }

    draw(ctx, pt0, pt1) {
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
}

export default Canvas