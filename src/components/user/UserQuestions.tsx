import {Button, Paper, Stack, TextField, Typography} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {UserQuestionsProps} from "../../types/props/UserScreenProps";
import {getSocketConnection} from "../../services/socket";
import {getSafetyQuipResponse} from "../../gamelogic/answers";

const socket = getSocketConnection();

const UserQuestions: React.FC<UserQuestionsProps> = ({username, roomCode, imageNum, questions, onDone}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [response, setResponse] = useState("");
    const [responseError, setResponseError] = useState("");

    useEffect(() => {
        socket.emit("join_specific_room", username);
    }, [username]);

    const submitSafetyQuip = () => {
        return submitQuestion(getSafetyQuipResponse(questions[currentQuestionIndex]));
    }

    const submitQuestion = (responseParam: string) => {
        if (responseParam.length === 0) {
            setResponseError("You need to enter something! Or click safety quip");
            return;
        }
        setResponse("");
        setResponseError("");
        let allSubmitted = false;
        if (currentQuestionIndex >= questions.length - 1) allSubmitted = true;

        socket.emit("submit_response", {
            username: username,
            room: roomCode,
            imageNum: imageNum,
            question: questions[currentQuestionIndex],
            response: responseParam,
            allSubmitted: allSubmitted
        })

        if (allSubmitted) {
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
                <div style={{marginBottom: '10px' }}>
                    <Stack spacing={2} sx={{ p: 2 }}>
                        <h3>Question {currentQuestionIndex + 1}</h3>
                        <p>{questions[currentQuestionIndex]}</p>
                        <TextField
                            label="Response"
                            onChange={handleResponseChange}
                            value={response}
                        />
                        <Typography sx={{color: "red"}}>{responseError}</Typography>
                        <Button variant="contained" color="primary" onClick={() => {submitQuestion(response)}}>
                            Submit
                        </Button>
                        <Button variant="contained" color={"warning"} sx={{color: "black", fontWeight: "bold"}}
                                onClick={submitSafetyQuip}>
                            Use Safety Quip
                        </Button>
                    </Stack>
                </div>
            )}
        </React.Fragment>
    );
}

export default UserQuestions;