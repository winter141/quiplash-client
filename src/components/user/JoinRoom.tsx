import {Button, FormHelperText, Paper, Stack, TextField, Typography, useFormControl} from "@mui/material";
import React, {useState} from "react";
import {card, smallTitleImage} from "../../styling/styles";
import {useNavigate} from "react-router-dom";
import {getSocketConnection, useSocketOnHook} from "../../services/socket";
import TitleImage from "../subcomponents/TitleImage";

const socket = getSocketConnection();

const MAX_USERNAME_CHARACTERS = 12;

const JoinRoom = () => {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useSocketOnHook(socket, "join_fail", (message) => {
        setErrorMessage(message);
    })

    useSocketOnHook(socket, "join_successful", (data) => {
        localStorage.setItem("VIP", data.VIP ? "true" : "false");
        localStorage.setItem("imageNum", data.imageNum);
        localStorage.setItem("roomCode", data.room);
        localStorage.setItem("username", data.username);
        navigate('/user');
    })

    const joinGame = () => {
        if (username.length === 0) {
            setErrorMessage("Please enter a name");
            return;
        }
        if (room.length === 0) {
            setErrorMessage("Please enter a room code");
            return;
        }
        if (room !== "") {
            const imageNumString = localStorage.getItem("imageNum");
            socket.emit("join_room", {
                room: room,
                username: username,
                storedRoom: localStorage.getItem("roomCode"),
                storedUsername: localStorage.getItem("username"),
                storedImageNum: imageNumString ? parseInt(imageNumString) : 0
            });
        }
    }

    const handleUsernameChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setUsername((e.target.value as string).toUpperCase());
    }

    const handleRoomChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setRoom((e.target.value as string).toUpperCase())
    }

    return (
        <>
            <Paper elevation={3} style={card}>
                <h1>Join Room</h1>
                <Stack spacing={2} sx={{p: 2}}>
                    <TextField
                        label="Room Code"
                        value={room}
                        onChange={handleRoomChange}
                    />
                    <TextField
                        label="Username"
                        value={username}
                        onChange={handleUsernameChange}
                        inputProps={{ maxLength: MAX_USERNAME_CHARACTERS }}
                    />
                    <FormHelperText>{username.length} / {MAX_USERNAME_CHARACTERS}</FormHelperText>
                    <Button variant="contained" onClick={joinGame}>Join</Button>
                </Stack>
                <Typography sx={{color: "red"}}>{errorMessage}</Typography>
            </Paper>
            <TitleImage titleName={"partypack1"} style={smallTitleImage}/>
        </>

);
}

export default JoinRoom;