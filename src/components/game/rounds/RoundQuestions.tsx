import React, {useEffect, useRef, useState} from 'react';
import {Box, List, ListItem, Paper, Typography} from '@mui/material';
import RoundTimer from "../../subcomponents/RoundTimer";
import {QuestionsProps} from "../../../types/props/RoundProps";
import {generateMatchUps, generateRoundOneQuestions, getAllResponsesCount} from "../../../gamelogic/questions";
import {PlayerQuestions} from "../../../types/types/Player";
import {card} from "../../../styling/styles";
import {GameClass} from "../../../types/classes/GameClass";
import {getSocketConnection, useSocketOnHook} from "../../../services/socket";
import ImageCharacter from "../../subcomponents/ImageCharacter";

const socket = getSocketConnection();

const RoundQuestions: React.FC<QuestionsProps> = ({players, onDone, questionAmount, questionTime}) => {
    const [games, setGames] = useState<GameClass[]>([]);
    const playersSubmittedResponse = useRef(0);
    const allResponsesCount = useRef(0);

    useEffect(() => {
        socket.emit("join_specific_room", localStorage.getItem("roomCode"));
    }, []);

    useEffect(() => {
        const matches = generateMatchUps(players, questionAmount);
        const [playerQuestionsArray, games]: [PlayerQuestions[], GameClass[]]
            = generateRoundOneQuestions(matches, players);
        allResponsesCount.current = getAllResponsesCount(games);
        setGames(games);
        socket.emit("send_round_one_questions", playerQuestionsArray);
    }, [players, questionAmount]);
    
    useSocketOnHook(socket, "receive_response", (data) => {
        const updatedGames = games.map(game => {
            if (game.getQuestion() === data.question) {
                playersSubmittedResponse.current++;
                const clonedGame = game.cloneGame();
                clonedGame.addResponse(data.username, data.response);

                if (allResponsesCount.current <= playersSubmittedResponse.current) {
                    handleTimeEnd();
                }

                return clonedGame;
            }
            return game;
        });
        setGames(updatedGames);
    })

    const handleTimeEnd = () => {
        localStorage.setItem("games", JSON.stringify(games.map(game => game.getGameJson())));
        onDone();
    }

    return (
        <>
            <Paper elevation={3} style={card}>
                <div style={{ display: 'flex', alignItems: 'center', padding: 3 }}>
                    <RoundTimer
                        top={0}
                        left={0}
                        initialTime={questionTime}
                        onTimeEnd={handleTimeEnd}
                    />
                    <Typography ml={5}>Answer the questions on your device</Typography>
                </div>
            </Paper>
            <Paper elevation={3} style={card}>

                {/*Done Players*/}
                <Box display="flex" flexDirection="row" sx={
                    {background: "linear-gradient(to bottom, lightyellow 40%, lightblue 100%);"}
                }>
                    <List sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', p: 0 }}>
                        {players.map((player) => (
                            <ListItem key ={player.imageNum} sx={{ width: 'auto', p: 0 }}>
                                <ImageCharacter imageNum={player.imageNum} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <div style={{height: "50px", backgroundColor: "lightblue"}}></div>
                {/*Waiting on Players*/}
                <Box display="flex" flexDirection="row" sx={
                    {background: "linear-gradient(to bottom, lightblue 50%, green 100%);"}
                }>
                    <List sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', p: 0 }}>
                        {players.map((player) => (
                            <ListItem key ={player.imageNum} sx={{ width: 'auto', p: 0 }}>
                                <ImageCharacter imageNum={player.imageNum} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Paper>
        </>
    );
};

export default RoundQuestions;
