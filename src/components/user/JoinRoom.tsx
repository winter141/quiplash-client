import {Avatar, Button, Card, Paper, Stack, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {card, characterImage} from "../../styling/styles";
import {io} from "socket.io-client";
import {useNavigate} from "react-router-dom";
import {getRandomImageNum} from "../../gamelogic/characterImages";

const socket = io("http://localhost:3001").connect();

const JoinRoom = () => {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const navigate = useNavigate();

    const imageNum = getRandomImageNum();

    useEffect(() => {
        socket.on("join_successful", (data) => {
            const isVIP = data.VIP === true;
            localStorage.setItem("VIP", isVIP ? "true" : "false");
            navigate('/user');
            console.log(`Client received with data: ${data}`);
        })
    }, [socket]);

    const joinGame = () => {
        localStorage.setItem("username", username);
        localStorage.setItem("roomCode", room);
        if (room !== "") socket.emit("join_room", { room: room, username: username });
    }

    const handleUsernameChange = (e: { target: { value: React.SetStateAction<string>; }; }) => { setUsername(e.target.value) }

    const handleRoomChange = (e: { target: { value: React.SetStateAction<string>; }; }) => { setRoom(e.target.value) }
    return (
        <Paper elevation={3} style={card}>
            <h1>Join Room</h1>
            <Avatar
                src={require(`../../static/images/characters/${imageNum}.png`)}

                alt="image not found"
                style={characterImage}
            />
            <Stack spacing={2} sx={{p: 2}}>
                <TextField
                    label="Room Code"
                    onChange={handleRoomChange}
                />
                <TextField
                    label="Username"
                    onChange={handleUsernameChange}
                />
                <Button variant="contained" onClick={joinGame}>Join</Button>
            </Stack>
        </Paper>
    );
}

export default JoinRoom;