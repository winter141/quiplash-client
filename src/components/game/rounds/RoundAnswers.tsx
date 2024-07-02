import React, {useEffect, useState} from "react";
import {AnswerProps} from "../../../types/RoundProps";
import {ThisOrThat} from "./ThisOrThat";
import RoundTimer from "../subcomponents/RoundTimer";
import {io} from "socket.io-client";

const socket = io("http://localhost:3001").connect();

const RoundAnswers: React.FC<AnswerProps> = ({players, onDone, maxScore, votingTime, games}) => {
    const [currentGameIndex, setCurrentGameIndex] = useState(0);

    const handleGameComplete = () => {
        if (currentGameIndex < games.length - 1) {
            setCurrentGameIndex(currentGameIndex + 1);
        } else {
            onDone();
        }
    }

    return (
        <React.Fragment>
            <ThisOrThat
                game={games[currentGameIndex]}
                players={players}
                votingTime={votingTime}
                onDone={handleGameComplete} />
        </React.Fragment>
    );
}

export default RoundAnswers;
