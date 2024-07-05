import React, {useEffect, useState} from "react";
import {Grid, Typography, Badge} from '@mui/material';
import {ThisOrThatProps} from "../../../types/RoundProps";
import {card, padding, questionWrapper, votesContainer} from "../../../styling/styles";
import {AnimatedPaper} from "../../../styling/animations";
import {io} from "socket.io-client";
import {getPlayersNotInGame} from "../../../gamelogic/answers";
import RoundTimer from "../subcomponents/RoundTimer";
import {GameClass} from "../../../types/GameClass";
import {PlayerScoreFromRound} from "../../../types/Player";
import AnimateVotes from "../subcomponents/AnimateVotes"

const socket = io("http://localhost:3001").connect();

const ThisOrThat: React.FC<ThisOrThatProps> = ({ players, onDone, game, votingTime, maxScore }) => {
    const [gameState, setGameState] = useState<GameClass>(game);
    const [isThisResponseShown, setIsThisResponseShown] = useState(false);
    const [isThatResponseShown, setIsThatResponseShown] = useState(false);
    const [playerScoresFromRound, setPlayerScoresFromRound] = useState<PlayerScoreFromRound[]>([]);
    const [isResultsShown, setIsResultsShown] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [receivedUserVotes, setReceivedUserVotes] = useState<string[]>([]);

    console.log("GAME: ///");
    console.log(game);

    const responses = game.getPlayerResponses();

    const messages = [
        game.getQuestion(),
        responses[0].response,
        responses[1].response
    ];

    console.log(gameState);
    console.log(players);

    useEffect(() => {
        socket.emit("join_specific_room", localStorage.getItem("roomCode"));
    }, []);

    useEffect(() => {
        socket.on("receive_vote", (data) => {
            console.log("GOT");
            console.log(receivedUserVotes);
            if (!receivedUserVotes.includes(data.voterUsername)) {
                setGameState(prevState => newGameState(prevState, data));
            }
        })
    }, [socket, receivedUserVotes]);

    const newGameState = (initialGameState: GameClass, data: any) => {
        initialGameState.addVote(data.voterUsername, data.response);
        setReceivedUserVotes([...receivedUserVotes, data.voterUsername]);
        return initialGameState;
    }

    useEffect(() => {
        let messageIndex = 0;
        let isSpeaking = false;

        const speakMessage = () => {
            if (!isSpeaking && messageIndex < messages.length) {
                isSpeaking = true;
                const message = new SpeechSynthesisUtterance(messages[messageIndex]);
                message.onend = () => {
                    isSpeaking = false;
                    if (messageIndex === 1) setIsThisResponseShown(true);
                    if (messageIndex === 2) setIsThatResponseShown(true);
                    if (messageIndex < messages.length) {
                        speakMessage();
                    } else {
                        socket.emit("begin_voting", { game: game, players: getPlayersNotInGame(game, responses, players) });
                        setShowTimer(true);
                    }
                };
                messageIndex += 1;

                window.speechSynthesis.speak(message);
            }
        };

        speakMessage();

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const handleTimeEnd = () => {
        if (isResultsShown) return;

        const [newPlayers, playerScoresFromRound] = game.addScoreToPlayers(maxScore, players);
        localStorage.setItem("players", JSON.stringify(newPlayers));
        setPlayerScoresFromRound(playerScoresFromRound);
        setIsResultsShown(true);
        setTimeout(() => {
            onDone();
        }, 6500);
    }

    const animateVotes = (response: string) => {
        const foundPlayerScoreFromRound = playerScoresFromRound
            .find(player => player.response === response);

        if (!foundPlayerScoreFromRound) return null;

        return (
            <AnimateVotes playerScoreFromRound={foundPlayerScoreFromRound} players={players}/>
        );
    }

    return (
        <div style={card}>
            <AnimatedPaper elevation={3} style={questionWrapper}>
                <Typography variant="h5">{game.getQuestion()}</Typography>
            </AnimatedPaper>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    {isThisResponseShown && (
                        <AnimatedPaper elevation={3} style={padding}>
                            <Typography variant="body1">{responses[0].response}</Typography>
                            {isResultsShown && animateVotes(responses[0].response)}
                        </AnimatedPaper>
                    )}
                </Grid>
                <Grid item xs={6}>
                    {isThatResponseShown && (
                        <AnimatedPaper elevation={3} style={padding}>
                            <Typography variant="body1">{responses[1].response}</Typography>
                            {isResultsShown && animateVotes(responses[1].response)}
                        </AnimatedPaper>
                    )}
                </Grid>
            </Grid>

            {showTimer && (
                <RoundTimer
                    top={16}
                    left={16}
                    initialTime={votingTime}
                    onTimeEnd={handleTimeEnd}
                />
            )}
        </div>
    )
}

export {ThisOrThat}