import React from "react";
import {Paper, Typography} from "@mui/material";
import {useSpeechSynthesisHook} from "../../services/speech";
import {card, colorCard} from "../../styling/styles";
import TitleImage from "./TitleImage";

interface IntroToSceneProps {
    speechMessages: string[];
    imageTitle?: string;
    onDone: () => void;
}

const IntroToScene: React.FC<IntroToSceneProps> = ({speechMessages, imageTitle, onDone}) => {
    useSpeechSynthesisHook(speechMessages, ()=>{}, onDone)
    return (
        <>
            {imageTitle ? (
                <TitleImage titleName={imageTitle}/>
            ) : (
                speechMessages.map((message, index) => (
                    <Typography variant="h6" sx={{padding: "12px"}}>{message}</Typography>
                ))
            )}
        </>
    )
}

export default IntroToScene;