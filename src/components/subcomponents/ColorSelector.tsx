import React from 'react';
interface ColorSelectorProps {
    color: string;
    diameterPx: number;
    selectColor: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ color, diameterPx, selectColor }) => {

    return (
            <div onClick={() => {selectColor(color)}} style={{
                backgroundColor: color,
                borderRadius: "100%",
                width: diameterPx + "px",
                height: diameterPx + "px",
                display: "inline-flex",
                margin: "3px",
            }}
            key={diameterPx}
            />
    );
};

export default ColorSelector;