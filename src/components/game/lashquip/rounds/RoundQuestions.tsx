import React, {useContext, useEffect, useRef, useState} from 'react';
import {Box, List, ListItem, Paper, Typography} from '@mui/material';
import RoundTimer from "../../../subcomponents/RoundTimer";
import {
    generateQuestions,
 getFinalRoundPrompts, getBasicPrompts
} from "../../../../gamelogic/lashquip/questions";
import {PlayerQuestions} from "../../../../types/Player";
import {card} from "../../../../styling/styles";
import {getSocketConnection, useSocketOnHook} from "../../../../services/socket";
import ImageCharacter from "../../../subcomponents/ImageCharacter";
import {useSpeechSynthesisHook} from "../../../../services/speech";
import { roundContext } from "./RoundManager";
import {generateMatchUps, getAllResponsesCount} from "../../../../gamelogic/general/general";
import {LashQuipQuestionsProps} from "../../../../types/props/RoundProps";
import {LashQuipGame} from "../../../../gamelogic/gameClasses/LashQuipGame";

const socket = getSocketConnection();

const RoundQuestions: React.FC<LashQuipQuestionsProps> = ({players, onDone, questionAmount, questionTime}) => {
    const [games, setGames] = useState<LashQuipGame[]>([]);
    const [showTimer, setShowTimer] = useState(true);
    const [timerText, setTimerText] = useState("Answer the questions on your device");
    const [playerSubmittedResponseImageNums, setPlayerSubmittedResponseImageNums] = useState<number[]>([]);
    const [playerUnSubmittedResponseImageNums, setPlayerUnSubmittedResponseImageNums] = useState<number[]>(players.map(player => player.imageNum));

    const playersSubmittedResponseCount = useRef(0);
    const allResponsesCount = useRef(0);

    const context = useContext(roundContext);

    const triggerSpeech = useRef(false);
    const onDoneMessages = ["Okie Dokie, Let's see the responses"];

    useEffect(() => {
        socket.emit("join_specific_room", localStorage.getItem("roomCode"));
    }, []);

    useEffect(() => {
        const matches = generateMatchUps(players, questionAmount);
        const prompts = !(context && context.isFinalRound)
            ? getBasicPrompts() : getFinalRoundPrompts();

        const [playerQuestionsArray, games]: [PlayerQuestions[], LashQuipGame[]]
            = generateQuestions(matches, players, prompts);

        allResponsesCount.current = getAllResponsesCount(games);
        setGames(games);
        socket.emit("send_round_questions", playerQuestionsArray);
    }, [players, questionAmount]);
    
    useSocketOnHook(socket, "receive_response", (data) => {

        if (data.allSubmitted) {
            setPlayerSubmittedResponseImageNums([...playerSubmittedResponseImageNums, data.imageNum]);
            setPlayerUnSubmittedResponseImageNums(playerUnSubmittedResponseImageNums
                                                    .filter(imageNum => imageNum !== data.imageNum));
        }

        const updatedGames = games.map(game => {
            if (game.getQuestion() === data.question) {
                playersSubmittedResponseCount.current++;
                const clonedGame = game.cloneGame();
                clonedGame.addResponse(data.username, data.response, data.safetyQuip);

                if (allResponsesCount.current <= playersSubmittedResponseCount.current) {
                    handleTimeEnd();
                }

                return clonedGame;
            }
            return game;
        });
        setGames(updatedGames);
    })

    useSpeechSynthesisHook(onDoneMessages, ()=> {}, onDone, triggerSpeech.current)

    const handleTimeEnd = () => {
        socket.emit("time_end", localStorage.getItem("roomCode"));
        localStorage.setItem("games", JSON.stringify(games.map(game => game.getGameJson())));
        setShowTimer(false);
        setTimerText(onDoneMessages[0])
        triggerSpeech.current = true;
    }

    return (
        <>
            <Paper elevation={3} style={card}>
                <div style={{ display: 'flex', alignItems: 'center', padding: 3 }}>
                    {showTimer && (
                        <RoundTimer
                            initialTime={questionTime}
                            onTimeEnd={handleTimeEnd}
                        />
                    )}
                    <Typography ml={5} variant="h5">{timerText}</Typography>
                </div>
            </Paper>
            <Paper elevation={3} style={card}>

                {/*Done Players*/}
                <Box display="flex" flexDirection="row" sx={
                    {background: "linear-gradient(to bottom, lightyellow 40%, lightblue 100%);", minHeight: "100px"}
                }>
                    <List sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', p: 0 }}>
                        {playerSubmittedResponseImageNums.map((playerImageNum) => (
                            <ListItem key={playerImageNum} sx={{ width: 'auto', p: 0 }}>
                                <ImageCharacter imageNum={playerImageNum} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <div style={{height: "50px", backgroundColor: "lightblue"}}></div>
                {/*Waiting on Players*/}
                <Box display="flex" flexDirection="row" sx={
                    {background: "linear-gradient(to bottom, lightblue 50%, green 100%);",
                    minHeight: "100px"}
                }>
                    <List sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', p: 0 }}>
                        {playerUnSubmittedResponseImageNums.map((playerImageNum) => (
                            <ListItem key ={playerImageNum} sx={{ width: 'auto', p: 0 }}>
                                <ImageCharacter imageNum={playerImageNum} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Paper>
        </>
    );
};

export default RoundQuestions;
