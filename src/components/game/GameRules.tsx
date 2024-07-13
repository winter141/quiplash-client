import React from 'react';
import { Paper, Typography } from '@mui/material';
import {card, colorCard, paragraph} from "../../styling/styles";
import {useSpeechSynthesisHook} from "../../services/speech";

interface GameRulesProps {
    onDone: () => void;
}

const GameRules: React.FC<GameRulesProps> = ({ onDone }) => {
    const messages = [
        "Welcome to Quiplash!",
        "Toggle background music by clicking on the music icon in the top right",
    ];

    useSpeechSynthesisHook(
        messages,
        () => {},
        () => {onDone()}
    )

    return (
        <Paper elevation={3} style={colorCard}>
            {messages.map((message, index) => (
                <Typography key={index} variant="h3" style={paragraph}>{message}</Typography>
            ))}
        </Paper>
    );
}

export default GameRules;
