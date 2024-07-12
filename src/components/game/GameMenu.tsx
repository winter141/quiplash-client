import {Button, Paper} from "@mui/material";
import React from "react";
import {card} from "../../styling/styles";
import {useNavigate} from "react-router-dom";
import {getSocketConnection, useSocketOnHook} from "../../services/socket";

const socket = getSocketConnection();

const StartGame = () => {
    const navigate = useNavigate();

    useSocketOnHook(socket, "init_game_room_success", (roomCode) => {
        localStorage.setItem("roomCode", roomCode);
        navigate('/game/lobby');
    })

    const startGame = () => {
        localStorage.clear();
        socket.emit("init_game_room");
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