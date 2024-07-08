import React from "react";
import RoundResults from "../game/rounds/RoundResults";
import {Avatar} from "@mui/material";
import {characterImage} from "../../styling/styles";

interface ImageCharacterProps {
    imageNum: number
}
const ImageCharacter: React.FC<ImageCharacterProps> = ({ imageNum }) => {
    if (!imageNum) return null;
    return (
        <Avatar
            src={require(`../../images/characters/${imageNum}.png`)}
            alt="image not found"
            style={characterImage}
        />
    )
}

export default ImageCharacter;
