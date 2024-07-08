import {Button, Paper, Stack, TextField} from "@mui/material";
import React, {useState} from "react";
import {card} from "../../styling/styles";
import {useNavigate} from "react-router-dom";
import {getSocketConnection, useSocketOnHook} from "../../services/socket";

const socket = getSocketConnection();

const JoinRoom = () => {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const navigate = useNavigate();

    useSocketOnHook(socket, "join_successful", (data) => {
        const isVIP = data.VIP === true;
        localStorage.setItem("VIP", isVIP ? "true" : "false");
        localStorage.setItem("imageNum", data.imageNum);
        navigate('/user');
    })

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