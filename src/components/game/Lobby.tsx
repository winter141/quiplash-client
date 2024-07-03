import {Button, Card, List, ListItem, Paper, Stack, TextField} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {card} from "../../styling/styles";
import {io} from "socket.io-client";
import {useNavigate} from "react-router-dom";
import {Player} from "../../types/Player";

const socket = io("http://localhost:3001").connect();

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

    useEffect(() => {
        socket.on("user_joined", (data) => {
            setPlayers(players.concat([{name: data.username, score: 0, likes: 0, imageNum: data.imageNum}]));
        })
    }, [socket]);

    useEffect(() => {
        socket.on("start_game", (data) => {
            console.log("Receiving start game");
            console.log("players: ", playersRef.current);
            localStorage.setItem("players", JSON.stringify(playersRef.current));
            navigate('/game/play');
        })

    }, [socket]);

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