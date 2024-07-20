import React, { useRef, useState, useEffect } from 'react';
import {Button, Paper, Stack, Typography} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ColorToolBar from "../../subcomponents/DrawingToolbar";

interface DrawingCanvasProp {
    onDone: (dataUrl: string) => void;
}

const CANVAS_WIDTH = 350;
const CANVAS_HEIGHT = 400;
export const INITIAL_LINE_WIDTH = 8;

const UserDrawingCanvas: React.FC<DrawingCanvasProp> = ({ onDone }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = CANVAS_WIDTH;
            canvas.height = CANVAS_HEIGHT;
            canvas.style.width = `${canvas.width}px`;
            canvas.style.height = `${canvas.height}px`;

            const context = canvas.getContext('2d');
            if (context) {
                context.lineCap = 'round';
                context.strokeStyle = 'black';
                context.lineWidth = INITIAL_LINE_WIDTH;
                contextRef.current = context;
            }
        }

        const handleResize = () => {
            if (canvas) {
                canvas.width = window.innerWidth * 0.8;
                canvas.height = window.innerHeight * 0.6;
            }
        };

        window.addEventListener('resize', handleResize);

        // Prevent default touch behavior
        const preventDefaultTouch = (event: TouchEvent) => {
            event.preventDefault();
        };

        canvas?.addEventListener('touchstart', preventDefaultTouch, { passive: false });
        canvas?.addEventListener('touchmove', preventDefaultTouch, { passive: false });
        canvas?.addEventListener('touchend', preventDefaultTouch, { passive: false });
        canvas?.addEventListener('touchcancel', preventDefaultTouch, { passive: false });

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        event.preventDefault();

        let offsetX: number;
        let offsetY: number;

        if (event.type === 'mousedown') {
            const mouseEvent = event as React.MouseEvent<HTMLCanvasElement>;
            offsetX = mouseEvent.nativeEvent.offsetX;
            offsetY = mouseEvent.nativeEvent.offsetY;
        } else {
            const touchEvent = event as React.TouchEvent<HTMLCanvasElement>;
            const touch = touchEvent.touches[0];
            const boundingRect = touchEvent.currentTarget.getBoundingClientRect();
            offsetX = touch.clientX - boundingRect.left;
            offsetY = touch.clientY - boundingRect.top;
        }

        const context = contextRef.current;

        if (context) {
            context.beginPath();
            context.moveTo(offsetX, offsetY);
            setIsDrawing(true);
        }
    };

    const finishDrawing = () => {
        const context = contextRef.current;

        if (context) {
            context.closePath();
            setIsDrawing(false);
        }
    };

    const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        event.preventDefault();

        let offsetX: number;
        let offsetY: number;

        if (event.type === 'mousemove') {
            const mouseEvent = event as React.MouseEvent<HTMLCanvasElement>;
            offsetX = mouseEvent.nativeEvent.offsetX;
            offsetY = mouseEvent.nativeEvent.offsetY;
        } else {
            const touchEvent = event as React.TouchEvent<HTMLCanvasElement>;
            const touch = touchEvent.touches[0];
            const boundingRect = touchEvent.currentTarget.getBoundingClientRect();
            offsetX = touch.clientX - boundingRect.left;
            offsetY = touch.clientY - boundingRect.top;
        }

        const context = contextRef.current;

        if (!isDrawing || !context) return;

        context.lineTo(offsetX, offsetY);
        context.stroke();
    };

    const handleSubmit = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            onDone(canvas.toDataURL());
        }
    };

    return (
        <div>
            <Stack
                alignItems="center"
                justifyContent="center"
                spacing={2}
            >
                <canvas
                    style={{
                        display: "block",
                        backgroundColor: "white",
                        width: `${CANVAS_WIDTH}px`,
                        boxShadow: "3px 3px 3px 3px #888888",
                        margin: "5px",
                        touchAction: "none"
                    }}
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onTouchStart={startDrawing}
                    onMouseUp={finishDrawing}
                    onTouchEnd={finishDrawing}
                    onMouseMove={draw}
                    onTouchMove={draw}
                />
                <Paper elevation={3} sx={{width: `${CANVAS_WIDTH}px`}}>
                    <ColorToolBar canvas={canvasRef.current}/>
                </Paper>
                <Button variant="contained" color="inherit" onClick={handleSubmit} sx={{width: `${CANVAS_WIDTH}px`}}>
                                    <span style={{display: "flex"}}>
                                        <Typography sx={{marginRight: "3px"}}>SEND</Typography>
                                        <SendIcon/>
                                    </span>
                </Button>
            </Stack>
        </div>
    );
};

export default UserDrawingCanvas;
