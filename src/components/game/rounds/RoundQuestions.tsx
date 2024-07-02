import React, {useEffect, useState} from 'react';
import {List, ListItem, Paper, Typography} from '@mui/material';
import RoundTimer from "../subcomponents/RoundTimer";
import {QuestionsProps, RoundProps} from "../../../types/RoundProps";
import {io} from "socket.io-client";
import {generateMatchUps, generateRoundOneQuestions} from "../../../gamelogic/questions";
import {Game, PlayerQuestions, PlayerResponse} from "../../../types/Player";
import {card} from "../../../styling/styles";

const socket = io("http://localhost:3001").connect();

const RoundQuestions: React.FC<QuestionsProps> = ({players, onDone, questionAmount, questionTime}) => {

    const [games, setGames] = useState<Game[]>([]);
    const username = localStorage.getItem("username");

    useEffect(() => {
        socket.emit("join_specific_room", localStorage.getItem("roomCode"));
    }, [socket]);


    useEffect(() => {
        const matches = generateMatchUps(players, questionAmount);
        const playerQuestionsArray: PlayerQuestions[] = generateRoundOneQuestions(matches, players);
        socket.emit("send_round_one_questions", playerQuestionsArray);
    }, [socket]);

    useEffect(() => {
        socket.on("receive_response", (data) => {
            console.log(`received response`);
            console.log(data);
            const foundGame = games.find(game => game.question === data.question);
            const playerResponse: PlayerResponse = {username: data.username, response: data.response};
            if (foundGame) {
                if (!foundGame.responses.find(response => response.username === username)) {
                    foundGame.responses.push(playerResponse)
                }
            } else {
                games.push({ question: data.question, responses: [playerResponse, {username: "temp", response: "temp"}] });
            }
            setGames([...games]);
        })
    }, [socket]);

    const handleTimeEnd = () => {
        localStorage.setItem("games", JSON.stringify(games));
        console.log("AMOUNT OF GAMES: " + games.length);
        console.log("games");
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
                {games.map((game: Game) => (
                    <ListItem key={game.question}>
                        {game.question}
                        {game.responses[0].username}: {game.responses[0].response}
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default RoundQuestions;
