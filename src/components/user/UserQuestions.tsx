import {Button, Paper, Stack, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {io} from "socket.io-client";
import {UserQuestionsProps} from "../../types/props/UserScreenProps";
import {getSocketConnection} from "../../services/socket";

const socket = getSocketConnection();

const UserQuestions: React.FC<UserQuestionsProps> = ({username, roomCode, questions, onDone}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [response, setResponse] = useState("");

    useEffect(() => {
        socket.emit("join_specific_room", username);
    }, [username]);

    const submitQuestion = () => {
        socket.emit("submit_response", {
            username: username,
            room: roomCode,
            question: questions[currentQuestionIndex],
            response: response,
        })
        if (currentQuestionIndex >= questions.length - 1) {
            onDone();
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }

    const handleResponseChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setResponse(e.target.value)
    }

    return (
        <React.Fragment>
            {questions.length > 0 && currentQuestionIndex < questions.length && (
                <Paper elevation={3} style={{ padding: '20px', marginBottom: '10px' }}>
                    <Stack spacing={2} sx={{ p: 2 }}>
                        <h3>Question {currentQuestionIndex + 1}</h3>
                        <p>{questions[currentQuestionIndex]}</p>
                        <TextField
                            label="Response"
                            onChange={handleResponseChange}
                        />
                        <Button variant="contained" color="primary" onClick={submitQuestion}>
                            Submit
                        </Button>
                    </Stack>
                </Paper>
            )}
        </React.Fragment>
    );
}

export default UserQuestions;