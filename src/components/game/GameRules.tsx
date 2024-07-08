import React from 'react';
import { Paper } from '@mui/material';
import {card, paragraph} from "../../styling/styles";
import {useSpeechSynthesisHook} from "../../services/speech";

interface GameRulesProps {
    onDone: () => void;
}

const GameRules: React.FC<GameRulesProps> = ({ onDone }) => {
    const messages = [
        "Welcome to Quiplash!",
        "Lets get started",
    ];

    useSpeechSynthesisHook(
        messages,
        () => {},
        () => {onDone()}
    )

    return (
        <Paper elevation={3} style={card}>
            {messages.map((message, index) => (
                <p key={index} style={paragraph}>{message}</p>
            ))}
        </Paper>
    );
}

export default GameRules;
