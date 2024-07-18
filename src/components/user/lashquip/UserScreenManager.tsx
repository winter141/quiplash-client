import {AppBar, Box, Button, Paper, Toolbar, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {card} from "../../../styling/styles";
import {UserScenes} from "../../../types/enums/Scenes";
import UserQuestions from "./UserQuestions";
import UserVote from "./UserVote";
import ImageCharacter from "../../subcomponents/ImageCharacter";
import {getSocketConnection, useSocketOnHook} from "../../../services/socket";
import {useNavigate} from "react-router-dom";
import {LashQuipResponse} from "../../../types/Responses";
import {getBlackOrWhiteFromImageNum, getHexColorFromImageNum} from "../../../gamelogic/general/imageColors";

const socket = getSocketConnection();

const UserScreenManager = () => {
    const [questions, setQuestions] = useState<string[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const [imageNum, setImageNum] = useState<number>(0);
    const [isVIPReady, setIsVIPReady] = useState<boolean>(false);
    const [question, setQuestion] = useState("");
    const [responses, setResponses] = useState([]);
    const [currentScene, setCurrentScene] = useState<UserScenes>(UserScenes.INITIAL);
    const [errorFlag, setErrorFlag] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        const storedRoomCode = localStorage.getItem("roomCode");
        const storedImageNumString = localStorage.getItem("imageNum");

        if (!storedUsername || !storedRoomCode || !storedImageNumString) {
            setErrorFlag(true);
        } else {
            setUsername(storedUsername);
            setRoomCode(storedRoomCode);
            setImageNum(parseInt(storedImageNumString));
            if (storedUsername) socket.emit("join_specific_room", storedUsername);
            if (storedRoomCode) socket.emit("join_specific_room" , storedRoomCode + "users");
        }
    }, []);

    useSocketOnHook(socket, "vip_ready", () => {
        setIsVIPReady(true);
    })

    useSocketOnHook(socket, "round_questions", (data) => {
        setQuestions(data);
        setCurrentScene(UserScenes.QUESTIONS)
    })

    useSocketOnHook(socket, "vote", (data) => {
        setQuestion(data.game.question);
        setResponses(data.game.playerResponses.map((r: LashQuipResponse) => r.response));
        setCurrentScene(UserScenes.VOTING);
    })

    useSocketOnHook(socket, "end_game", () => {
        setCurrentScene(UserScenes.DONE);
    })

    useSocketOnHook(socket, "vip_start_game", () => {
        setCurrentScene(UserScenes.WAITING);
    })

    const startGame = () => {
        socket.emit("vip_start_game", roomCode);
        localStorage.removeItem("VIP");
        setIsVIPReady(false);
        setCurrentScene(UserScenes.WAITING);
    }

    const showUserScene = () => {
        switch (currentScene) {
            case UserScenes.INITIAL:
                const isVip = localStorage.getItem("VIP") === "true";
                console.log(isVIPReady);
                return (
                    <>
                        {isVip && (
                            <>
                                <Typography>You are the VIP!</Typography>
                                <Typography>You can start the game once at least three players have joined</Typography>
                            </>
                            )}
                        <Typography>Awaiting players...</Typography>
                        {isVIPReady && (
                        <Button variant="contained" onClick={startGame}>Start Game</Button>
                        )}
                    </>

                )
            case UserScenes.WAITING:
                return null;
            case UserScenes.QUESTIONS:
                return (
                    <UserQuestions
                     username={username ? username : ""}
                     roomCode={roomCode ? roomCode : ""}
                     imageNum={imageNum ? imageNum : 0}
                     questions={questions}
                     onDone={() => {setCurrentScene(UserScenes.WAITING)}}
                    />
                )
            case UserScenes.VOTING:
                return (
                    <UserVote
                     username={username ? username : ""}
                     roomCode={roomCode ? roomCode : ""}
                     question={question}
                     responses={responses}
                     onDone={() => {setCurrentScene(UserScenes.WAITING)}}
                    />
                )
            case UserScenes.DONE:
                return (
                    <>
                        <Typography>Thanks for playing!</Typography>
                        <Button variant="contained" onClick={() => {navigate('/join')}}>Back to Join</Button>
                    </>
                )
            default:
                return null;
        }
    }

    if (errorFlag) {
        return (
            <Paper elevation={3} style={card}>
                An error occurred
            </Paper>
        )
    }

    return <React.Fragment>
        <AppBar position="fixed" sx={{backgroundColor: getHexColorFromImageNum(imageNum)}}>
            <Toolbar>
                <Typography variant="h6" color={getBlackOrWhiteFromImageNum(imageNum)} style={{ flexGrow: 1, }}>
                    {username}
                </Typography>
            </Toolbar>
        </AppBar>
        <Box mt={10}>
            {showUserScene()}
        </Box>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <ImageCharacter imageNum={imageNum}/>
        </div>
    </React.Fragment>;
}

export default UserScreenManager;