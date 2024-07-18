import React, {useEffect, useState} from "react";
import {votesContainer} from "../../../../styling/styles";
import {AnimatedChip, AnimatedDiv, AnimatedTypography} from "../../../../styling/animations";
import {Typography} from "@mui/material";
import ConstructionIcon from '@mui/icons-material/Construction';
import {LashQuipScoreFromRound} from "../../../../types/Responses";
import {getBlackOrWhiteFromImageNum, getHexColorFromImageNum} from "../../../../gamelogic/general/imageColors";
import {Player} from "../../../../types/Player";

interface AnimateVotesProps {
    playerScoreFromRound: LashQuipScoreFromRound;
    players: Player[];
}

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
    }, [playerScoreFromRound.quiplashBonus]);

    return (
        <React.Fragment>
            <div style={votesContainer}>
                {playerScoreFromRound.playerResponse.votes.map((username: string, index: number) => (
                    <AnimatedChip key={index}
                                  label={username}
                                  size="medium"
                                  sx={{color: getBlackOrWhiteFromImageNum(usernameImageNumMap[username]),
                                      backgroundColor: getHexColorFromImageNum(usernameImageNumMap[username]),
                                      fontWeight: "bold"}}
                    />
                ))}
            </div>

            {playerScoreFromRound.playerResponse.safetyQuip && (
                <AnimatedDiv style={{fontWeight: "bold", color: "orange"}}>
                    <Typography>SAFETY QUIPPED</Typography>
                    <ConstructionIcon/>
                </AnimatedDiv>
            )}
            {playerScoreFromRound.scoreFromRound > 0 && showRoundScore && (
                <AnimatedTypography sx={{fontWeight: "bold"}}>+ {playerScoreFromRound.scoreFromRound}</AnimatedTypography>
            )}
            {playerScoreFromRound.quiplashBonus > 0 && showQuiplashBonus && (
                <AnimatedTypography sx={{fontWeight: "bold"}}>+ {playerScoreFromRound.quiplashBonus} QUIPLASH BONUS</AnimatedTypography>
            )}
            <Typography
                sx={{color: getHexColorFromImageNum(usernameImageNumMap[playerScoreFromRound.playerResponse.username]),
                    fontWeight: "bold",
                    position: "absolute",
                    bottom: 3,
                    right: 10
                }}>
                {playerScoreFromRound.playerResponse.username}
            </Typography>
        </React.Fragment>
    );
};

export default AnimateVotes