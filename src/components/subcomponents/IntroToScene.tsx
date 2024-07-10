import React from "react";
import {Paper, Typography} from "@mui/material";
import {useSpeechSynthesisHook} from "../../services/speech";
import {card} from "../../styling/styles";

interface IntroToSceneProps {
    messages: string[];
    onDone: () => void;
}

const IntroToScene: React.FC<IntroToSceneProps> = ({messages, onDone}) => {
    useSpeechSynthesisHook(messages, ()=>{}, onDone)
    return (
        <Paper elevation={3} style={card}>
            {messages.map(message => (
                <Typography>
                    {message}
                </Typography>
            ))}
        </Paper>
    )
}

export default IntroToScene;