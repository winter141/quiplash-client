import React, {useState} from 'react';
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ColorSelector from "./ColorSelector";

interface ColorToolBarProps {
    canvas: HTMLCanvasElement | null;
}

const COLOR_DIAMETER_INITIAL = 16;
const COLOR_DIAMETER_SELECTED = 25;


const ColorToolBar: React.FC<ColorToolBarProps> = ({ canvas }) => {
    const [diameterPxs, setDiameterPxs] = useState<{ [color: string]: number }>({
        black: COLOR_DIAMETER_SELECTED,
        green: COLOR_DIAMETER_INITIAL,
        red: COLOR_DIAMETER_INITIAL,
    });
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

    const setDiameters = (selectedColor: string): { [color: string]: number } => {
        const newDiameters = { ...diameterPxs };
        Object.keys(newDiameters).map((color) => {
            if (selectedColor === color) {
                newDiameters[color] = COLOR_DIAMETER_SELECTED;
            } else {
                newDiameters[color] = COLOR_DIAMETER_INITIAL;
            }
        })
        console.log(newDiameters);
        return newDiameters;
    }

    return (
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
            <HighlightOffIcon onClick={handleClear} sx={{float: "right", margin: "3px"}}/>
        </span>
    )
}

export default ColorToolBar;