import React, {useEffect, useState} from "react";
import {Grid, Typography} from '@mui/material';
import {ThisOrThatProps} from "../../../types/props/RoundProps";
import {card, padding, questionWrapper} from "../../../styling/styles";
import {AnimatedPaper} from "../../../styling/animations";
import {getPlayersNotInGame} from "../../../gamelogic/answers";
import RoundTimer from "../../subcomponents/RoundTimer";
import {GameClass} from "../../../types/classes/GameClass";
import {PlayerScoreFromRound} from "../../../types/types/Player";
import AnimateVotes from "../../subcomponents/AnimateVotes"
import {getSocketConnection, useSocketOnHook} from "../../../services/socket";
import {useSpeechSynthesisHook} from "../../../services/speech";

const socket = getSocketConnection();
const COMPONENT_WAIT = 6500; // How long to wait before component is "done"

const ThisOrThat: React.FC<ThisOrThatProps> = ({ players, onDone, game, votingTime, maxScore }) => {
    const [gameState, setGameState] = useState<GameClass>(game);
    const [isThisResponseShown, setIsThisResponseShown] = useState(false);
    const [isThatResponseShown, setIsThatResponseShown] = useState(false);
    const [playerScoresFromRound, setPlayerScoresFromRound] = useState<PlayerScoreFromRound[]>([]);
    const [isResultsShown, setIsResultsShown] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [receivedUserVotes, setReceivedUserVotes] = useState<string[]>([]);

    const responses = game.getPlayerResponses();

    const messages = [
        game.getQuestion(),
        responses[0].response,
        responses[1].response
    ];

    useEffect(() => {
        socket.emit("join_specific_room", localStorage.getItem("roomCode"));
    }, []);

    const newGameState = (initialGameState: GameClass, data: any) => {
        initialGameState.addVote(data.voterUsername, data.response);
        setReceivedUserVotes([...receivedUserVotes, data.voterUsername]);
        return initialGameState;
    }

    useSocketOnHook(socket, "receive_vote", (data) => {
            if (!receivedUserVotes.includes(data.voterUsername)) {
                setGameState(prevState => newGameState(prevState, data));
            }
        },
    );

    const onEndSpeech = (messageIndex: number) => {
        if (messageIndex === 0) setIsThisResponseShown(true);
        if (messageIndex === 1) setIsThatResponseShown(true);
    }

    const onDoneSpeech = () => {
        socket.emit("begin_voting", { game: game, players: getPlayersNotInGame(game, responses, players) });
        setShowTimer(true);
    }

    useSpeechSynthesisHook(
        messages,
        onEndSpeech,
        onDoneSpeech
    )

    const handleTimeEnd = () => {
        if (isResultsShown) return;

        const [newPlayers, playerScoresFromRound] = game.addScoreToPlayers(maxScore, players);
        localStorage.setItem("players", JSON.stringify(newPlayers));
        setPlayerScoresFromRound(playerScoresFromRound);
        setIsResultsShown(true);
        setTimeout(() => {
            onDone();
        }, COMPONENT_WAIT);
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