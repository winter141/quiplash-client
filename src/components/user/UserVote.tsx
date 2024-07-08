import {Button, Paper, Stack} from "@mui/material";
import React, {useEffect} from "react";
import {card} from "../../styling/styles";
import {io} from "socket.io-client";
import {UserVoteProps} from "../../types/props/UserScreenProps";
import {getSocketConnection} from "../../services/socket";

const socket = getSocketConnection();

const UserVote: React.FC<UserVoteProps> = ({username, roomCode, question, responses, onDone}) => {
    useEffect(() => {
        socket.emit("join_specific_room", username);
    }, [username]);

    const submitResponse = (response: string) => {
        socket.emit("cast_vote", {response: response, voterUsername: username, room: roomCode});
        onDone();
    }

    return (
        <Paper elevation={0} style={card}>
            <h1>{question}</h1>
            <Stack spacing={2} sx={{ p: 2 }}>
                {responses.map((response) => (
                    <Button variant="contained" onClick={() => {submitResponse(response)}}>{response}</Button>
                ))}
            </Stack>
        </Paper>
    );
}

export default UserVote;