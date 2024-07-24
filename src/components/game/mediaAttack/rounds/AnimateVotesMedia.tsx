import React, {useEffect, useState} from "react";
import {votesContainer} from "../../../../styling/styles";
import {AnimatedChip, AnimatedDiv, AnimatedTypography} from "../../../../styling/animations";
import {Typography} from "@mui/material";
import ConstructionIcon from '@mui/icons-material/Construction';
import {getBlackOrWhiteFromImageNum, getHexColorFromImageNum} from "../../../../gamelogic/general/imageColors";
import {Player} from "../../../../types/Player";
import {LashQuipResponseData, PlayerScoreFromRound} from "../../../../types/Responses";

interface AnimateVotesProps {
    playerScoreFromRound: PlayerScoreFromRound;
    players: Player[];
}

const SCORE_TIMEOUT = 1000;
const QUIPLASH_TIMEOUT = 1000;

const AnimateVotesMedia: React.FC<AnimateVotesProps> = ({ playerScoreFromRound, players}) => {
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

        if (playerScoreFromRound.quiplashBonus && playerScoreFromRound.quiplashBonus > 0) {
            setTimeout(() => {
                setShowQuiplashBonus(true);
            }, SCORE_TIMEOUT + QUIPLASH_TIMEOUT);
        }
    }, [playerScoreFromRound.quiplashBonus]);

    return (
        <React.Fragment>
            <div style={{display: "inline-block", float: "left"}}>
                <Typography
                    sx={{
                        color: getHexColorFromImageNum(usernameImageNumMap[playerScoreFromRound.playerResponse.username]),
                        fontWeight: "bold",
                        float: "left"
                    }}>
                    Artist: {playerScoreFromRound.playerResponse.username}
                </Typography>
                <Typography
                    sx={{
                        color: getHexColorFromImageNum(usernameImageNumMap[playerScoreFromRound.playerResponse.partner ? playerScoreFromRound.playerResponse.partner : "black"]),
                        fontWeight: "bold",
                        fontSize: "0.8rem"
                    }}>
                    Captioner: {playerScoreFromRound.playerResponse.partner}
                </Typography>
            </div>
            <br/><br/><br/>
            <div style={votesContainer}>
                {playerScoreFromRound.playerResponse.votes.map((username: string, index: number) => (
                    <AnimatedChip key={index}
                                  label={username}
                                  size="small"
                                  sx={{
                                      color: getBlackOrWhiteFromImageNum(usernameImageNumMap[username]),
                                      backgroundColor: getHexColorFromImageNum(usernameImageNumMap[username]),
                                      fontWeight: "bold"
                                  }}
                    />
                ))}
            </div>

            {(playerScoreFromRound.scoreFromRound > 0 && showRoundScore) && (
                <>
                    <AnimatedTypography sx={{fontWeight: "bold"}}>
                        + {playerScoreFromRound.scoreFromRound} Artist
                    </AnimatedTypography>
                    <AnimatedTypography sx={{fontWeight: "bold", fontSize: "0.9rem"}}>
                        + {playerScoreFromRound.scoreFromRound / 2} Captioner
                    </AnimatedTypography>
                </>
            )}
        </React.Fragment>
    );
};

export default AnimateVotesMedia