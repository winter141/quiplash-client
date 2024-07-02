import React, {useEffect, useState} from 'react';
import { Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {animatedText, card, paragraph} from "../../styling/styles";

interface GameRulesProps {
    onDone: () => void;
}

const GameRules: React.FC<GameRulesProps> = ({ onDone }) => {
    const messages = [
        "Welcome to Quiplash!",
        "Lets get started",
    ];

    useEffect(() => {
        let messageIndex = 0;
        let isSpeaking = false;

        const speakMessage = () => {
            if (!isSpeaking && messageIndex < messages.length) {
                isSpeaking = true;
                const message = new SpeechSynthesisUtterance(messages[messageIndex]);
                messageIndex += 1;
                message.onend = () => {
                    isSpeaking = false;
                    speakMessage();
                };
                window.speechSynthesis.speak(message);
            } else if (messageIndex >= messages.length) {
                onDone();
            }
        };

        speakMessage();

        return () => {
            // Cleanup function to stop speech synthesis if the component unmounts
            window.speechSynthesis.cancel();
        };
    }, []);

    return (
        <Paper elevation={3} style={card}>
            {messages.map((message, index) => (
                <p key={index} style={paragraph}>{message}</p>
            ))}
        </Paper>
    );
}

export default GameRules;
