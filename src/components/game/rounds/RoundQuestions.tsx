import React, {useEffect, useState} from 'react';
import {List, ListItem, Paper, Typography} from '@mui/material';
import RoundTimer from "../../subcomponents/RoundTimer";
import {QuestionsProps} from "../../../types/props/RoundProps";
import {generateMatchUps, generateRoundOneQuestions} from "../../../gamelogic/questions";
import {PlayerQuestions} from "../../../types/types/Player";
import {card} from "../../../styling/styles";
import {GameClass} from "../../../types/classes/GameClass";
import {getSocketConnection, useSocketOnHook} from "../../../services/socket";

const socket = getSocketConnection();

const RoundQuestions: React.FC<QuestionsProps> = ({players, onDone, questionAmount, questionTime}) => {
    const [games, setGames] = useState<GameClass[]>([]);

    useEffect(() => {
        socket.emit("join_specific_room", localStorage.getItem("roomCode"));
    }, []);

    useEffect(() => {
        const matches = generateMatchUps(players, questionAmount);
        const [playerQuestionsArray, games]: [PlayerQuestions[], GameClass[]]
            = generateRoundOneQuestions(matches, players);
        setGames(games);
        socket.emit("send_round_one_questions", playerQuestionsArray);
    }, [players, questionAmount]);
    
    useSocketOnHook(socket, "receive_response", (data) => {
        const updatedGames = games.map(game => {
            if (game.getQuestion() === data.question) {
                const clonedGame = game.cloneGame();
                clonedGame.addResponse(data.username, data.response);
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
        <Paper elevation={3} style={card}>
            <div style={{ display: 'flex', alignItems: 'center', padding: 2 }}>
                <RoundTimer
                    top={16}
                    left={16}
                    initialTime={questionTime}
                    onTimeEnd={handleTimeEnd}
                />
                <Typography ml={2} sx={{paddingLeft: 3}}>Answer the questions on your device</Typography>
            </div>

            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {games.map((game: GameClass) => (
                    <ListItem key={game.getQuestion()}>
                        {game.getQuestion()}
                        {game.getPlayerResponses()[0].username}: {game.getPlayerResponses()[0].response}
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default RoundQuestions;
