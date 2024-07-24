import React, {useState} from "react";
import {
    LashQuipResponseData,
    MediaResponseData,
    PlayerResponse,
    PlayerScoreFromRound
} from "../../../../types/Responses";
import {MediaGame} from "../../../../gamelogic/gameClasses/MediaGame";
import DisplayDrawing from "./DisplayDrawing";
import testingData from "../../../../data/testingdatamedia.json";
import testingData1 from "../../../../data/testingdata.json";
import {Card, Grid, Paper} from "@mui/material";
import {card} from "../../../../styling/styles";
import RoundTimer from "../../../subcomponents/RoundTimer";
import LinearTimer from "../../../subcomponents/LinearTimer";
import AnimateVotesMedia from "./AnimateVotesMedia";
const { MEDIA_RESPONSE_DATA } = testingData;
const { PLAYERS }= testingData1;


interface DisplayAllDrawingsProps {
    game: MediaGame;
    onDone: () => void;
}

const VOTING_TIME = 15;

const DisplayAllDrawings: React.FC<DisplayAllDrawingsProps> = ({ game, onDone}) => {
    const [currentResponseIndex, setCurrentResponseIndex] = useState(0);

    const playerResponses = game.getPlayerResponses();

    const samplePlayerScoreFromRound = {
            scoreFromRound: 50,
        playerResponse: {
            username: "Alice",
            partner: "Steve",
            votes: ["Stevenson", "Tim", "Jimmy"],
            responseData: {
                dataUrl: "aa",
                imageTitle: "abb"
            }}
        }
    const animateVotes = (foundPlayerScoreFromRound: PlayerScoreFromRound) => {
        return (
            <AnimateVotesMedia playerScoreFromRound={foundPlayerScoreFromRound} players={PLAYERS}/>
        );
    }
    const testingResponses: MediaResponseData[] = MEDIA_RESPONSE_DATA;
    const isResultsShown = true;
    return (
        <>
        <Paper elevation={10} style={card}>
            <h2>
                PICK YOUR FAVOURITE
            </h2>
            <Grid container spacing={2}>
                {testingResponses.map((testingResponse: MediaResponseData, index: number) => (
                    <Grid item xs={4} sm={3} md={2} lg={1.5} key={index}>
                        <div>
                            <DisplayDrawing
                                responseData={testingResponse}
                                /*
                                                    responseData={playerResponse.responseData as MediaResponseData}
                                */
                                onDone={() => {}}
                                key={currentResponseIndex}
                                hideTimer={true}
                                sx={{
                                    width: "100%", // Use percentage to make it responsive
                                    height: "auto" // Adjust height dynamically
                                }}
                            />
                            {isResultsShown && animateVotes(samplePlayerScoreFromRound as PlayerScoreFromRound)}
                        </div>
                    </Grid>
                ))}
            </Grid>
            <RoundTimer
             initialTime={VOTING_TIME}
             onTimeEnd={onDone}
            />
        </Paper>
    <LinearTimer
        initialTime={VOTING_TIME}
        onTimeEnd={onDone}
    />
    </>
    )
}

export default DisplayAllDrawings;