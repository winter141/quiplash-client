import React from "react";
import RoundResults from "../rounds/RoundResults";
import {Avatar} from "@mui/material";
import {characterImage} from "../../../styling/styles";

interface ImageCharacterProps {
    imageNum?: number
}
const ImageCharacter: React.FC<ImageCharacterProps> = ({ imageNum }) => {
    if (!imageNum) return null;
    return (
        <Avatar
            src={require(`../../../static/images/characters/${imageNum}.png`)}
            alt="image not found"
            style={characterImage}
        />
    )
}

export default ImageCharacter;
