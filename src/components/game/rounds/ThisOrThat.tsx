import React, {useEffect, useState} from "react";
import {Grid, Typography} from '@mui/material';
import {ThisOrThatProps} from "../../../types/RoundProps";
import {card, padding, questionWrapper, votesContainer} from "../../../styling/styles";
import {AnimatedChip, AnimatedPaper} from "../../../styling/animations";
import {io} from "socket.io-client";
import {getPlayersNotInGame} from "../../../gamelogic/answers";
import RoundTimer from "../subcomponents/RoundTimer";
import {GameClass} from "../../../types/GameClass";

const socket = io("http://localhost:3001").connect();

const ThisOrThat: React.FC<ThisOrThatProps> = ({ players, onDone, game, votingTime }) => {
    const [gameState, setGameState] = useState<GameClass>(game);
    const [isThisResponseShown, setIsThisResponseShown] = useState(false);
    const [isThatResponseShown, setIsThatResponseShown] = useState(false);
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
        setIsResultsShown(true);
        setTimeout(() => {
            onDone();
        }, 5000);
    }

    const animateVotes = (responseIndex: number) => {
        const foundVotes = game.getPlayerResponses()[responseIndex].votes;
        if (!foundVotes || foundVotes.length === 0) return null;
        const foundVotesSet = new Set<string>(foundVotes);
        if (!foundVotesSet) return null;
        return (
            <AnimateVotes usernames={Array.from(foundVotesSet)}/>
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
                            {isResultsShown && animateVotes(0)}
                        </AnimatedPaper>
                    )}
                </Grid>
                <Grid item xs={6}>
                    {isThatResponseShown && (
                        <AnimatedPaper elevation={3} style={padding}>
                            <Typography variant="body1">{responses[1].response}</Typography>
                            {isResultsShown && animateVotes(1)}
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

interface AnimateVotesProps {
    usernames: string[];
}

const AnimateVotes: React.FC<AnimateVotesProps> = ({ usernames }) => {
    return (
        <div style={votesContainer}>
            {usernames.map((username: string, index: number) => (
                <AnimatedChip key={index} label={username} size="small" />
            ))}
        </div>
    );
};


export {ThisOrThat}