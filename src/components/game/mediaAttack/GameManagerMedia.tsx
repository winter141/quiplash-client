import React, {useRef, useState} from 'react';
import {animated} from '@react-spring/web';
import {AppBar, Box, CardMedia, IconButton, Toolbar} from "@mui/material";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import {GameScenes} from "../../../types/enums/Scenes";
import RoundManagerMediaAttack from "./rounds/RoundManagerMedia";
import IntroToScene from "../../subcomponents/IntroToScene";
import {useNavigate} from "react-router-dom";
import {getSocketConnection} from "../../../services/socket";

const GAME_RULES_MESSAGES = ["Get Ready to Draw and Conquer!", "Welcome to Media Attack!", "Toggle background music by clicking on the music icon in the top right"]

const socket = getSocketConnection();

const GameManagerMedia: React.FC = () => {
    const [currentScene, setCurrentScene] = useState<GameScenes>(GameScenes.RULES);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioOn, setAudioOn] = useState(false);
    const navigate = useNavigate();
    if (audioRef.current) audioRef.current.volume = 0.25;

    const storedPlayers = localStorage.getItem('players');
    if (!storedPlayers) {
        console.error("NO PLAYERS: ERROR");
        return (<div>NO PLAYERS: HANDLE ERROR</div>);
    }
    const players = JSON.parse(storedPlayers);

    const roomCode = localStorage.getItem("roomCode");
    if (!roomCode) {
        console.error("NO ROOM CODE: ERROR");
        return (<div>NO ROOM CODE: ERROR</div>);
    }

    const toggleAudio = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play().catch(error => {
                    console.error("Failed to play audio: ", error);
                });
                setAudioOn(true);
            } else {
                audioRef.current.pause();
                setAudioOn(false);
            }
        }
    };

    const handleDone = () => {
        // Transition to the next scene based on the current scene
        switch (currentScene) {
            case GameScenes.RULES:
                setCurrentScene(GameScenes.ROUND_ONE);
                break;
            case GameScenes.ROUND_ONE:
                setCurrentScene(GameScenes.ROUND_TWO);
                break;
            case GameScenes.ROUND_TWO:
                setCurrentScene(GameScenes.ROUND_THREE);
                break;
            case GameScenes.ROUND_THREE:
                setCurrentScene(GameScenes.FINAL_ROUND);
                break;
            case GameScenes.FINAL_ROUND:
                navigate('/game/menu');
                socket.emit("end_game", roomCode);
                break;
            default:
                setCurrentScene(GameScenes.RULES);
                break;
        }
    };

    const showScene = () => {
        let sceneElement;

        switch (currentScene) {
            case GameScenes.RULES:
                sceneElement = <IntroToScene
                    speechMessages={GAME_RULES_MESSAGES}
                    onDone={handleDone}/>
                break;
            case GameScenes.ROUND_ONE:
                sceneElement = <RoundManagerMediaAttack players={players} onDone={handleDone} roundNumber={1}/>
                break;
            case GameScenes.ROUND_TWO:
                sceneElement = <RoundManagerMediaAttack players={players} onDone={handleDone} roundNumber={2}/>
                break;
            case GameScenes.ROUND_THREE:
                sceneElement = <RoundManagerMediaAttack players={players} onDone={handleDone} roundNumber={3}/>
                break;
            case GameScenes.FINAL_ROUND:
                sceneElement = <RoundManagerMediaAttack players={players} onDone={handleDone} roundNumber={4}/>
                break;
            default:
                sceneElement = <div>Unknown Scene</div>
        }
        return (
            <animated.div>
                {sceneElement}
            </animated.div>
        )
    }

    return (
        <div>
            <AppBar position="fixed" color="secondary" >

                <Toolbar sx={{ display: "flex", justifyContent: "space-between", backgroundColor: "#FFBD59" }} >
                    <CardMedia
                        component="img"
                        src={require(`../../../images/titles/mediaattacktitle.png`)}
                        alt="image not found"
                        sx={{width: "10rem"}}
                    />
                    <Box sx={{ marginLeft: "auto" }}>
                        <IconButton edge="end" sx={{color: "black"}} onClick={toggleAudio}>
                            {audioOn ? <MusicNoteIcon /> : <MusicOffIcon />}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box mt={13}>
                {showScene()}
            </Box>
            <audio ref={audioRef} loop>
                <source src={`${process.env.PUBLIC_URL}/background_music2.mp3`} type="audio/mpeg"/>
                Your browser does not support the audio element.
            </audio>
        </div>
    );
};

export default GameManagerMedia;
