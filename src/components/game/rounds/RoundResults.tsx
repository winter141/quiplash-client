import React, {useEffect} from "react";
import {ResultsProps} from "../../../types/RoundProps";
import {Card, CardContent, Paper, Table, TableCell, TableContainer, TableRow, Typography} from "@mui/material";
import {card} from "../../../styling/styles";
import {Player} from "../../../types/Player";
import ImageCharacter from "../subcomponents/ImageCharacter";
import '../../../styling/podiumResults.css'

const RoundResults: React.FC<ResultsProps> = ({players, onDone, sceneTime}) => {

    useEffect(() => {
        setTimeout(() => {
            onDone();
        }, 5000);
    }, []);

    const getPodium = () => {
        const sortedPlayers = players.sort((player1, player2) => player2.score - player1.score);

        const topThree = sortedPlayers.slice(0, 3);
        const others = sortedPlayers.slice(3);

        return (
            <div className="round-results">
                <div className="podium">
                    {topThree.length > 1 && (
                        <div className="podium-item second">
                            <ImageCharacter imageNum={topThree[1]?.imageNum}/>
                            <div className="player-name">{topThree[1]?.name}</div>
                            <div className="player-score">{topThree[1]?.score}</div>
                        </div>
                    )}
                    {topThree.length > 0 && (
                        <div className="podium-item first">
                            <ImageCharacter imageNum={topThree[0]?.imageNum}/>
                            <div className="player-name">{topThree[0]?.name}</div>
                            <div className="player-score">{topThree[0]?.score}</div>
                        </div>
                )}
                    {topThree.length > 2 && (
                        <div className="podium-item third">
                            <ImageCharacter imageNum={topThree[2]?.imageNum} />
                            <div className="player-name">{topThree[2]?.name}</div>
                            <div className="player-score">{topThree[2]?.score}</div>
                        </div>
                    )}
                </div>
                <div className="other-players">
                    {others.map((player, index) => (
                        <Card className="player-card" key={index}>
                            <CardContent>
                                <div className="image-wrapper">
                                    <ImageCharacter imageNum={player.imageNum}/>
                                </div>
                                <Typography variant="h6" component="div">{player.name}</Typography>
                                <Typography variant="body2" color="text.secondary">{player.score}</Typography>
                                <Typography sx={{fontWeight: 'bold'}}>{index + 4}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <Paper elevation={3} style={card}>
            {/*<TableContainer sx={{ maxHeight: 440 }}>
                <Table>
                    {getPlayerRows()}
                </Table>
            </TableContainer>*/}

            {getPodium()}
        </Paper>
    );
}

export default RoundResults;
