import {Button, FormHelperText, Stack, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {UserQuestionsProps} from "../../../types/props/UserScreenProps";
import {getSocketConnection, useSocketOnHook} from "../../../services/socket";
import {getSafetyQuipResponse} from "../../../gamelogic/lashquip/answers";
import ConstructionIcon from "@mui/icons-material/Construction";
import SendIcon from '@mui/icons-material/Send';

const socket = getSocketConnection();

const MAX_RESPONSE_LENGTH = 80;

const UserQuestions: React.FC<UserQuestionsProps> = ({username, roomCode, imageNum, questions, onDone}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [response, setResponse] = useState("");
    const [responseError, setResponseError] = useState("");

    useEffect(() => {
        socket.emit("join_specific_rooms", [username, roomCode + "users"]);
    }, [roomCode, username]);

    useSocketOnHook(socket, "receive_time_end", ()=> {
        onDone();
    });

    const submitSafetyQuip = () => {
        return submitQuestion(getSafetyQuipResponse(questions[currentQuestionIndex]), true);
    }

    const submitQuestion = (responseParam: string, safetyQuip: boolean) => {
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
            safetyQuip: safetyQuip,
            allSubmitted: allSubmitted
        })

        if (allSubmitted) {
            onDone();
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }

    const handleResponseChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setResponse((e.target.value as string).toUpperCase());
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
                            inputProps={{ maxLength: MAX_RESPONSE_LENGTH }}
                        />
                        <FormHelperText>{response.length} / {MAX_RESPONSE_LENGTH}</FormHelperText>

                        <Typography sx={{color: "red"}}>{responseError}</Typography>
                        <Button variant="contained" color="inherit" onClick={() => {
                            submitQuestion(response, false)
                        }}>
                            <span style={{display: "flex"}}>
                                <Typography sx={{marginRight: "3px"}}>SEND</Typography>
                                <SendIcon/>
                            </span>
                        </Button>
                        <Button variant="contained" color={"warning"} sx={{color: "black", fontWeight: "bold"}}
                                onClick={submitSafetyQuip}>
                            <span style={{display: "flex"}}>
                                <Typography sx={{marginRight: "3px"}}>Use Safety Quip</Typography>
                                <ConstructionIcon/>
                            </span>
                        </Button>
                    </Stack>
                </div>
            )}
        </React.Fragment>
    );
}

export default UserQuestions;