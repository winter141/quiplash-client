import {Button, Paper} from "@mui/material";
import React from "react";
import {card} from "../../styling/styles";
import {useNavigate} from "react-router-dom";

// const socket = getSocketConnection();

const StartGame = () => {
    const navigate = useNavigate();

    const startGame = () => {
        navigate('/game/lobby');
        // localStorage.setItem('roomCode', generateRoomCode())
        localStorage.clear();
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