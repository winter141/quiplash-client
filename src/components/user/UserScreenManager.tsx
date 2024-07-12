import {AppBar, Box, Button, Paper, Toolbar, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {card} from "../../styling/styles";
import {PlayerResponse} from "../../types/types/Player";
import {UserScenes} from "../../types/enums/Scenes";
import UserQuestions from "./UserQuestions";
import UserVote from "./UserVote";
import ImageCharacter from "../subcomponents/ImageCharacter";
import {getBlackOrWhiteFromImageNum, getHexColorFromImageNum} from "../../gamelogic/characterImages";
import {getSocketConnection, useSocketOnHook} from "../../services/socket";

const socket = getSocketConnection();

const UserScreenManager = () => {
    const [questions, setQuestions] = useState<string[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const [imageNum, setImageNum] = useState<number>(0);
    const [isVIP, setIsVIP] = useState<boolean>(false);
    const [question, setQuestion] = useState("");
    const [responses, setResponses] = useState([]);
    const [currentScene, setCurrentScene] = useState<UserScenes>(UserScenes.INITIAL);
    const [errorFlag, setErrorFlag] = useState(false);

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
        }
    }, []);

    useSocketOnHook(socket, "vip_ready", () => {
        setIsVIP(true);
    })

    useSocketOnHook(socket, "round_one_questions", (data) => {
        setQuestions(data);
        setCurrentScene(UserScenes.QUESTIONS)
    })

    useSocketOnHook(socket, "vote", (data) => {
        setQuestion(data.game.question);
        setResponses(data.game.playerResponses.map((r: PlayerResponse) => r.response));
        setCurrentScene(UserScenes.VOTING);
    })

    const startGame = () => {
        socket.emit("vip_start_game", roomCode);
        localStorage.removeItem("VIP");
        setIsVIP(false);
    }

    const showUserScene = () => {
        switch (currentScene) {
            case UserScenes.INITIAL:
                return null;
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
            {isVIP && currentScene === UserScenes.INITIAL && <Button variant="contained" onClick={startGame}>Start Game</Button>}
            {showUserScene()}
        </Box>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <ImageCharacter imageNum={imageNum}/>
        </div>
    </React.Fragment>;
}

export default UserScreenManager;