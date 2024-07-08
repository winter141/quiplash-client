import {Player, PlayerScoreFromRound} from "../../types/types/Player";
import React, {useEffect, useState} from "react";
import {votesContainer} from "../../styling/styles";
import {AnimatedChip, AnimatedTypography} from "../../styling/animations";
import {getBlackOrWhiteFromImageNum, getHexColorFromImageNum} from "../../gamelogic/characterImages";
import {Typography} from "@mui/material";

interface AnimateVotesProps {
    playerScoreFromRound: PlayerScoreFromRound;
    players: Player[];
};

const SCORE_TIMEOUT = 1000;
const QUIPLASH_TIMEOUT = 1000;

const AnimateVotes: React.FC<AnimateVotesProps> = ({ playerScoreFromRound, players}) => {
    const [showRoundScore, setShowRoundScore] = useState(false);
    const [showQuiplashBonus, setShowQuiplashBonus] = useState(false);

    type ImageNumMap = { [key: string]: number };

    const usernameImageNumMap: ImageNumMap = players.reduce((acc: ImageNumMap, player) => {
        acc[player.name] = player.imageNum;
        return acc;
    }, {});

    useEffect(() => {
        setTimeout(() => {
            setShowRoundScore(true);
        }, SCORE_TIMEOUT);

        if (playerScoreFromRound.quiplashBonus > 0) {
            setTimeout(() => {
                setShowQuiplashBonus(true);
            }, SCORE_TIMEOUT + QUIPLASH_TIMEOUT);
        }
    }, []);

    return (
        <React.Fragment>
            <div style={votesContainer}>
                {playerScoreFromRound.voterUsernames.map((username: string, index: number) => (
                    <AnimatedChip key={index}
                                  label={username}
                                  size="medium"
                                  sx={{color: getBlackOrWhiteFromImageNum(usernameImageNumMap[username]),
                                      backgroundColor: getHexColorFromImageNum(usernameImageNumMap[username]),
                                      fontWeight: "bold"}}
                    />
                ))}
            </div>

            {playerScoreFromRound.scoreFromRound > 0 && showRoundScore && (
                <AnimatedTypography sx={{fontWeight: "bold"}}>+ {playerScoreFromRound.scoreFromRound}</AnimatedTypography>
            )}
            {playerScoreFromRound.quiplashBonus > 0 && showQuiplashBonus && (
                <AnimatedTypography sx={{fontWeight: "bold"}}>+ {playerScoreFromRound.quiplashBonus} QUIPLASH BONUS</AnimatedTypography>
            )}
            <Typography
                sx={{color: getHexColorFromImageNum(usernameImageNumMap[playerScoreFromRound.username]),
                    fontWeight: "bold",
                    position: "absolute",
                    bottom: 3,
                    right: 10
                }}>
                {playerScoreFromRound.username}
            </Typography>
        </React.Fragment>
    );
};

export default AnimateVotes