import React, {useContext, useEffect, useRef, useState} from "react";
import {Grid, Typography} from '@mui/material';
import {ThisOrThatProps} from "../../../../types/props/RoundProps";
import {card, displayResponse, questionWrapper} from "../../../../styling/styles";
import {AnimatedPaper} from "../../../../styling/animations";
import {addPlayerResponseToLocalStorage} from "../../../../gamelogic/lashquip/answers";
import RoundTimer from "../../../subcomponents/RoundTimer";
import AnimateVotes from "./AnimateVotes"
import {getSocketConnection, useSocketOnHook} from "../../../../services/socket";
import {useSpeechSynthesisHook} from "../../../../services/speech";
import { roundContext} from "./RoundManager";
import LinearTimer from "../../../subcomponents/LinearTimer";
import {LashQuipGame} from "../../../../gamelogic/gameClasses/LashQuipGame";
import {getPlayersNotInGame} from "../../../../gamelogic/general/general";
import {LashQuipResponseData, PlayerScoreFromRound} from "../../../../types/Responses";

const socket = getSocketConnection();
const COMPONENT_WAIT = 4; // How long to wait before component is "done" in seconds

const ThisOrThat: React.FC<ThisOrThatProps> = ({ players, onDone, game, votingTime, maxScore }) => {
    const [gameState, setGameState] = useState<LashQuipGame>(game);
    const [isThisResponseShown, setIsThisResponseShown] = useState(false);
    const [isThatResponseShown, setIsThatResponseShown] = useState(false);
    const [playerScoresFromRound, setPlayerScoresFromRound] = useState<PlayerScoreFromRound[]>([]);
    const [isResultsShown, setIsResultsShown] = useState(false);
    const [showRoundTimer, setShowRoundTimer] = useState(false);
    const [showLinearTimer, setShowLinearTimer] = useState(false);
    const [receivedUserVotes, setReceivedUserVotes] = useState<string[]>([]);
    const playersVoted = useRef(0);

    const context = useContext(roundContext);

    const responses = game.getPlayerResponses();
    const response1 = (responses[0].responseData as LashQuipResponseData).response;
    const response2 = (responses[1].responseData as LashQuipResponseData).response

    const messages = [
        game.getQuestion(),
        response1,
        response2
    ];

    useEffect(() => {
        socket.emit("join_specific_room", localStorage.getItem("roomCode"));
    }, []);

    const addVoteToNewGameState = (initialGameState: LashQuipGame, data: any) => {
        playersVoted.current++;
        initialGameState.addVote(data.voterUsername, data.response.username);
        setReceivedUserVotes([...receivedUserVotes, data.voterUsername]);

        if (playersVoted.current >= getPlayersNotInGame(responses, players).length) {
            if (!(context && context.isFinalRound)) {
                const winnerPlayerResponse = game.getWinnerPlayerResponse();
                if (winnerPlayerResponse) addPlayerResponseToLocalStorage(winnerPlayerResponse);
            }
            handleTimeEnd();
        }

        return initialGameState;
    }

    useSocketOnHook(socket, "receive_vote", (data) => {
            if (!receivedUserVotes.includes(data.voterUsername)) {
                setGameState(prevState => addVoteToNewGameState(prevState, data));
            }
        },
    );

    const onEndSpeech = (messageIndex: number) => {
        if (messageIndex === 0) setIsThisResponseShown(true);
        if (messageIndex === 1) setIsThatResponseShown(true);
    }

    const onDoneSpeech = () => {
        socket.emit("begin_voting", { game: game, players: getPlayersNotInGame(responses, players) });
        setShowRoundTimer(true);
    }

    useSpeechSynthesisHook(
        messages,
        onEndSpeech,
        onDoneSpeech
    )

    const handleTimeEnd = () => {
        if (isResultsShown) return;
        socket.emit("time_end", localStorage.getItem("roomCode"));

        setShowRoundTimer(false);

        const [newPlayers, playerScoresFromRound] = game.addScoreToPlayers(maxScore, players);
        localStorage.setItem("players", JSON.stringify(newPlayers));
        setPlayerScoresFromRound(playerScoresFromRound);
        setIsResultsShown(true);

        setTimeout(() => {
            setShowRoundTimer(false);
            setShowLinearTimer(true);
        }, 1000)
    }

    const handleComponentDone = () => {
        onDone();
    }

    const animateVotes = (response: string) => {
        const foundPlayerScoreFromRound = playerScoresFromRound
            .find(player =>
                (player.playerResponse.responseData as LashQuipResponseData).response === response);

        if (!foundPlayerScoreFromRound) return null;

        return (
            <AnimateVotes playerScoreFromRound={foundPlayerScoreFromRound} players={players}/>
        );
    }

    return (
        <div style={card}>
            <AnimatedPaper elevation={3} style={questionWrapper}>
                <Typography variant="h4">{game.getQuestion()}</Typography>
            </AnimatedPaper>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    {isThisResponseShown && (
                        <AnimatedPaper elevation={3} style={displayResponse}>
                            <Typography variant="h3">{response1}</Typography>
                            {isResultsShown && animateVotes(response1)}
                        </AnimatedPaper>
                    )}
                </Grid>
                <Grid item xs={6}>
                    {isThatResponseShown && (
                        <AnimatedPaper elevation={3} style={displayResponse}>
                            <Typography variant="h3">{response2}</Typography>
                            {isResultsShown && animateVotes(response2)}
                        </AnimatedPaper>
                    )}
                </Grid>
            </Grid>

            {showRoundTimer && (
                <RoundTimer
                    initialTime={votingTime}
                    onTimeEnd={handleTimeEnd}
                    sx={{top: 16}}
                />
            )}

            {showLinearTimer && (
                <LinearTimer
                    initialTime={COMPONENT_WAIT}
                    onTimeEnd={handleComponentDone}
                    sx={{top: 40}}
                />
            )}
        </div>
    )
}

export {ThisOrThat}