import {Button, Paper, Stack} from "@mui/material";
import React, {useEffect} from "react";
import {card} from "../../../styling/styles";
import {getSocketConnection, useSocketOnHook} from "../../../services/socket";
import {UserVoteProps} from "../../../types/props/UserScreenProps";
import {LashQuipResponseData, PlayerResponse} from "../../../types/Responses";

const socket = getSocketConnection();

const UserVote: React.FC<UserVoteProps> = ({username, roomCode, question, responses, onDone}) => {
    useEffect(() => {
        socket.emit("join_specific_rooms", [username, roomCode + "users"]);
    }, [roomCode, username]);

    useSocketOnHook(socket, "receive_time_end", ()=> {
        onDone();
    });

    const submitResponse = (response: PlayerResponse) => {
        socket.emit("cast_vote", {response: response, voterUsername: username, room: roomCode});
        onDone();
    }

    return (
        <Paper elevation={0} style={card}>
            <h1>{question}</h1>
            <Stack spacing={2} sx={{ p: 2 }}>
                {responses.map((response: PlayerResponse) => (
                    <Button variant="contained" onClick={() => {submitResponse(response)}}>
                        {(response.responseData as LashQuipResponseData).response}
                    </Button>
                ))}
            </Stack>
        </Paper>
    );
}

export default UserVote;