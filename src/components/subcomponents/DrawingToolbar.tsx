import React, {useState} from 'react';
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ColorSelector from "./ColorSelector";
import {Slider} from "@mui/material";
import {INITIAL_LINE_WIDTH} from "../user/mediaAttack/DrawingCanvas";
import CreateIcon from '@mui/icons-material/Create';

interface ColorToolBarProps {
    canvas: HTMLCanvasElement | null;
}

const COLOR_DIAMETER_INITIAL = 16;
const COLOR_DIAMETER_SELECTED = 25;


const DrawingToolBar: React.FC<ColorToolBarProps> = ({ canvas }) => {
    const [diameterPxs, setDiameterPxs] = useState<{ [color: string]: number }>({
        black: COLOR_DIAMETER_SELECTED,
        blue: COLOR_DIAMETER_INITIAL,
        red: COLOR_DIAMETER_INITIAL,
        green: COLOR_DIAMETER_INITIAL,
        yellow: COLOR_DIAMETER_INITIAL,
    });
    const [lineWidth, setLineWidth] = useState(INITIAL_LINE_WIDTH);
    const [colorSelected, setColorSelected] = useState("black");
    const handleClear = () => {
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    const setColor = (color: string) => {
        setDiameterPxs(setDiameters(color));
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                context.strokeStyle = color;
            }
        }
    }

    const handleLineWidthChange = (event: Event, newValue: number | number[]) => {
        setLineWidth(newValue as number);
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                context.lineWidth = newValue as number;
            }
        }
    };


    const setDiameters = (selectedColor: string): { [color: string]: number } => {
        const newDiameters = { ...diameterPxs };
        setColorSelected(selectedColor);
        Object.keys(newDiameters).map((color) => {
            if (selectedColor === color) {
                newDiameters[color] = COLOR_DIAMETER_SELECTED;
            } else {
                newDiameters[color] = COLOR_DIAMETER_INITIAL;
            }
        })
        return newDiameters;
    }

    return (
        <>
            <span style={{display: "inline"}}>
                <span style={{float: "left"}}>
                    {Object.keys(diameterPxs).map((color) => (
                        <ColorSelector
                            key={color}
                            color={color}
                            diameterPx={diameterPxs[color]}
                            selectColor={() => setColor(color)}
                        />
                    ))}
                </span>
                <span style={{display: "inline", float: "right"}}>
                    <CreateIcon onClick={() => {setColor("white")}} sx={{ transform: 'rotate(180deg)', marginRight: "9px" }} />
                    <HighlightOffIcon onClick={handleClear} sx={{margin: "3px"}}/>
                </span>
            </span>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
                <Slider
                    aria-label="Line Width"
                    value={lineWidth}
                    onChange={handleLineWidthChange}
                    min={5}
                    max={15}
                    color={"info"}
                    sx={{
                        '& .MuiSlider-thumb': {
                            backgroundColor: colorSelected === "white" ? "grey" : colorSelected
                        },
                    }}
                />
            </div>
        </>

    )
}

export default DrawingToolBar;