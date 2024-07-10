import React, {useRef, useState} from 'react';
import {animated} from '@react-spring/web';
import GameRules from "./GameRules";
import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import {GameScenes} from "../../types/enums/Scenes";
import RoundManager from "./rounds/RoundManager";

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
                setCurrentScene(GameScenes.FINAL_ROUND); // or another end state
                break;
            case GameScenes.FINAL_ROUND:
                setCurrentScene(GameScenes.RULES); // or another end state
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
                sceneElement = <GameRules onDone={handleDone}/>
                break;
            case GameScenes.ROUND_ONE:
                sceneElement = <RoundManager players={players} onDone={handleDone} roundNumber={1}/>
                break;
            case GameScenes.ROUND_TWO:
                sceneElement = <RoundManager players={players} onDone={handleDone} roundNumber={2}/>
                break;
            case GameScenes.ROUND_THREE:
                sceneElement = <RoundManager players={players} onDone={handleDone} roundNumber={3}/>
                break;
            case GameScenes.FINAL_ROUND:
                sceneElement = <RoundManager players={players} onDone={handleDone} roundNumber={4}/>
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
                    {showScene()}
                </Box>
                <audio ref={audioRef} loop>
                    <source src={`${process.env.PUBLIC_URL}/background_music.mp3`} type="audio/mpeg"/>
                    Your browser does not support the audio element.
                </audio>
            </div>
    );
};

export default GameManager;
