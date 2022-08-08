import './Canvas.css';
import { useEffect, useRef, useState } from 'react';
import React from 'react';

const Canvas = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const DRAW = { width: 20, height: 20 };
    const ZOOM = 10;
    const FG_COLOR = 'blue';
    let canvas = document.getElementById("canvas");
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
        last = eventCanvasCoord(canvas, nativeEvent);
        isDrawing = true;
    }

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return;
        }
        document.querySelector('#errors').innerHTML = "";
        var x = eventCanvasCoord(canvas, nativeEvent)['x'];
        var y = eventCanvasCoord(canvas, nativeEvent)['y'];
        contextRef.current.beginPath();
        contextRef.current.moveTo(last.x, last.y);
        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
        contextRef.current.closePath();
        last.x = eventCanvasCoord(canvas, nativeEvent)['x'];
        last.y = eventCanvasCoord(canvas, nativeEvent)['y'];
        nativeEvent.preventDefault();
    }

    const stopDrawing = ({ nativeEvent }) => {
        if (!isDrawing) {
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
        isDrawing = false;
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
        </canvas >
    )
}

export default Canvas 