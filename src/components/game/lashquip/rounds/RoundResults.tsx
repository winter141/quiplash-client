import React, {useContext, useEffect, useRef, useState} from "react";
import {ResultsProps} from "../../../../types/props/RoundProps";
import {Button, Card, CardContent, Paper, Typography} from "@mui/material";
import {card} from "../../../../styling/styles";
import {Player} from "../../../../types/Player";
import ImageCharacter from "../../../subcomponents/ImageCharacter";
import '../../../../styling/podiumResults.css'
import {roundContext} from "./RoundManager";
import {useSpeechSynthesisHook} from "../../../../services/speech";
import {useNavigate} from "react-router-dom";
import {AnimatedDivGrow, AnimatedDivSwing} from "../../../../styling/animations";

const RoundResults: React.FC<ResultsProps> = ({players, onDone, sceneTime, messages}) => {
    const context = useContext(roundContext);
    const isFinalRound = context && context.isFinalRound;
    const [podiumNumber, setPodiumNumber] = useState<number>(4);
    const [showPlayAgainBtn, setShowPlayAgainBtn] = useState(false);
    const navigate = useNavigate();

    const onMessageEnd = (messageIndex: number) => {
        setPodiumNumber(3 - messageIndex);
    }

    const handleDone = () => {
        if (!isFinalRound) return onDone();
        setShowPlayAgainBtn(true);
    }

    useSpeechSynthesisHook(
        messages,
        onMessageEnd, handleDone
    );

    const showPlayer = (position: number) => {
        if (!isFinalRound) return true;
        return podiumNumber <= position;
    }

    const showPodium = (topThree: Player[]) => {
        return (
            <div className="podium">
                {topThree.length > 1 && showPlayer(2) && (
                    <AnimatedDivGrow>
                        <div className="podium-item second">
                            <ImageCharacter imageNum={topThree[1]?.imageNum}/>
                            <div className="player-name">{topThree[1]?.name}</div>
                            <div className="player-score">{topThree[1]?.score}</div>
                        </div>
                    </AnimatedDivGrow>
                )}
                {topThree.length > 0 && showPlayer(1) && (
                    <AnimatedDivGrow>
                        <div className="podium-item first">
                            <ImageCharacter imageNum={topThree[0]?.imageNum}/>
                            <div className="player-name">{topThree[0]?.name}</div>
                            <div className="player-score">{topThree[0]?.score}</div>
                        </div>
                    </AnimatedDivGrow>
                )}
                {topThree.length > 2 && showPlayer(3) && (
                    <AnimatedDivGrow>
                        <div className="podium-item third">
                            <ImageCharacter imageNum={topThree[2]?.imageNum}/>
                            <div className="player-name">{topThree[2]?.name}</div>
                            <div className="player-score">{topThree[2]?.score}</div>
                        </div>
                    </AnimatedDivGrow>
                )}
            </div>
        );
    }

    const playerCard = (player: Player, index: number) => {
        return (
            <AnimatedDivSwing>
                <Card className="player-card">
                    <CardContent>
                        <div className="image-wrapper">
                            <ImageCharacter imageNum={player.imageNum}/>
                        </div>
                        <Typography variant="h6" component="div">{player.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{player.score}</Typography>
                        <Typography sx={{fontWeight: 'bold'}}>{index + 4}</Typography>
                    </CardContent>
                </Card>
            </AnimatedDivSwing>
        )
    }

    const showOtherPlayers = (others: Player[]) => {
        return (
            <div className="round-results">
                <div className="other-players">
                    {others.map((player, index) => (
                        <div key={index}>
                            {playerCard(player, index)}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const showAllResults = () => {
        const sortedPlayers = players.sort((player1, player2) => player2.score - player1.score);

        const topThree = sortedPlayers.slice(0, 3);
        const others = sortedPlayers.slice(3);

        return (
            <>
                {showPodium(topThree)}
                {showPlayer(-1) && showOtherPlayers(others)}
            </>
        )
    }

    const playAgain = () => {
        navigate('/game/menu');
    }

    return (
        <>
            <Paper elevation={3} style={card}>
                {showAllResults()}
            </Paper>
            {showPlayAgainBtn && (
                <Button variant="contained" onClick={playAgain}>Back to menu</Button>
            )}
        </>
    );
}

export default RoundResults;
