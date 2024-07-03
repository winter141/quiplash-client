import {AppBar, Box, Button, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {card} from "../../styling/styles";
import {io} from "socket.io-client";
import {PlayerResponse} from "../../types/Player";
import {UserScenes} from "../../types/Scenes";
import UserQuestions from "./UserQuestions";
import UserVote from "./UserVote";
import MusicOffIcon from "@mui/icons-material/MusicOff";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ImageCharacter from "../game/subcomponents/ImageCharacter";

const socket = io("http://localhost:3001").connect();

const UserScreenManager = () => {
    const [questions, setQuestions] = useState<string[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const [imageNum, setImageNum] = useState<number>(0);
    const [isVIP, setIsVIP] = useState<boolean>(localStorage.getItem("VIP") === "true");
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
            console.log(storedImageNumString);
            setImageNum(parseInt(storedImageNumString));
        }
    }, []); // Runs only once on component mount

    useEffect(() => {
        socket.emit("join_specific_room", username);
    }, [username]);

    useEffect(() => {
        socket.on("round_one_questions", (data) => {
            console.log("Received: ");
            console.log(data);
            setQuestions(data);
            setCurrentScene(UserScenes.QUESTIONS)
        })
    }, [socket]);

    useEffect(() => {
        const handleVote = (data: any) => {
            console.log("Received Vote");
            console.log(data);
            setQuestion(data.game.question);
            setResponses(data.game.responses.map((r: PlayerResponse) => r.response));
            setCurrentScene(UserScenes.VOTING);
        };

        socket.on("vote", handleVote);

        return () => {
            socket.off("vote", handleVote);
        };
    }, [socket]);

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
                An error occured
            </Paper>
        )
    }

    return <React.Fragment>
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    {username}
                </Typography>
            </Toolbar>
        </AppBar>
        <Box mt={10}>
            {isVIP && currentScene === UserScenes.INITIAL && <Button variant="contained" onClick={startGame}>Start Game</Button>}
            {showUserScene()}
        </Box>
        <ImageCharacter imageNum={imageNum}/>
    </React.Fragment>;
}

export default UserScreenManager;