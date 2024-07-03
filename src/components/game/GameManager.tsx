import React, {useEffect, useRef, useState} from 'react';
import {animated, useTransition} from '@react-spring/web';
import GameRules from "./GameRules";
import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import { GameScenes } from "../../types/Scenes";
import RoundOne from "./rounds/RoundManager";

const GameManager: React.FC = () => {
    const [currentScene, setCurrentScene] = useState<GameScenes>(GameScenes.RULES);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioOn, setAudioOn] = useState(false);

    const storedPlayers = localStorage.getItem('players');
    if (!storedPlayers) {
        console.error("NO PLAYERS: HANDLE ERROR");
        return (<div>NO PLAYERS: HANDLE ERROR</div>);
    }
    const players = JSON.parse(storedPlayers);

    const toggleAudio = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play().catch(error => {
                    console.log("Failed to play audio: ", error);
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
                setCurrentScene(GameScenes.RULES); // or another end state
                break;
            default:
                setCurrentScene(GameScenes.RULES);
                break;
        }
    };

    return (
        <div>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        {currentScene}
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={toggleAudio}>
                        {audioOn ? <MusicOffIcon /> : <MusicNoteIcon />}
                    </IconButton>
                </Toolbar>
            </AppBar>
            <div></div>
            <Box mt={10}>
                {(() => {
                    if (currentScene === GameScenes.RULES) {
                        return (
                            <animated.div>
                                <GameRules onDone={handleDone} />
                            </animated.div>
                        );
                    } else if (currentScene === GameScenes.ROUND_ONE) {
                        return (
                            <animated.div>
                                <RoundOne players={players} onDone={handleDone} />
                            </animated.div>
                        );
                    } else if (currentScene === GameScenes.ROUND_TWO) {
                        return (
                            <animated.div>
                                <div>Round Two Placeholder</div>
                            </animated.div>
                        );
                    } else if (currentScene === GameScenes.ROUND_THREE) {
                        return (
                            <animated.div>
                                <div>Round Three Placeholder</div>
                            </animated.div>
                        );
                    } else {
                        return (
                            <animated.div>
                                <div>Unknown Scene</div>
                            </animated.div>
                        );
                    }
                })()}
            </Box>
            <audio ref={audioRef} loop>
                <source src={`${process.env.PUBLIC_URL}/background_music.mp3`} type="audio/mpeg"/>
                Your browser does not support the audio element.
            </audio>
        </div>
    );
};

export default GameManager;
