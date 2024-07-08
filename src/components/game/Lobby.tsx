import {Button, Card, List, ListItem, Paper, Stack, TextField} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {card} from "../../styling/styles";
import {useNavigate} from "react-router-dom";
import {Player} from "../../types/types/Player";
import {getSocketConnection, useSocketOnHook} from "../../services/socket";

const socket = getSocketConnection();

const Lobby = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [roomCode, setRoomCode] = useState<string>("");
    const navigate = useNavigate();
    const playersRef = useRef(players); // Create a ref to store the latest players state

    useEffect(() => {
        playersRef.current = players;
    }, [players]);

    useEffect(() => {
        const foundRoom = localStorage.getItem("roomCode");
        if (!foundRoom) {
            navigate('/game/menu');
        } else {
            setRoomCode(foundRoom);
            socket.emit("init_game_room", foundRoom)
        }
    }, [socket]);

    useSocketOnHook(socket, "user_joined", (data) => {
        setPlayers(players.concat([{name: data.username, score: 0, likes: 0, imageNum: data.imageNum}]));
    })

    useSocketOnHook(socket, "start_game", (data) => {
        localStorage.setItem("players", JSON.stringify(playersRef.current));
        navigate('/game/play');
    })

    const displayLobby = () => {
        return (
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {players.map(player => (
                    <ListItem key={player.name}>{player.name}</ListItem>
                ))}
            </List>
        )
    }

    return (
        <Paper elevation={3} style={card}>
            <h1>Lobby</h1>
            <h2>Code: {roomCode}</h2>
            <Paper elevation={3} style={card}>{displayLobby()}</Paper>
        </Paper>
    );
}

export default Lobby;