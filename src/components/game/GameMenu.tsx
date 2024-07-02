import {Button, Card, List, ListItem, Paper, Stack, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {card} from "../../styling/styles";
import {io} from "socket.io-client";
import {useNavigate} from "react-router-dom";
import {generateRoomCode} from "../../gamelogic/roomCode";

// const socket = io("http://localhost:3001").connect();

const StartGame = () => {
    const navigate = useNavigate();

    const startGame = () => {
        navigate('/game/lobby');
        // localStorage.setItem('roomCode', generateRoomCode())
        localStorage.setItem('roomCode', "LUCK")
    }

    return (
        <Paper elevation={3} style={card}>
            <h1>Quiplash</h1>
                <Button variant="contained" onClick={startGame}>
                    Start Game
                </Button>
        </Paper>
    );
}

export default StartGame;