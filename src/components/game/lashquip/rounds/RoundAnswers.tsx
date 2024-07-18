import React, {useState} from "react";
import {ThisOrThat} from "./ThisOrThat";
import {LashQuipAnswerProps} from "../../../../types/props/RoundProps";

const RoundAnswers: React.FC<LashQuipAnswerProps> = ({players, onDone, maxScore, votingTime, games}) => {
    const [currentGameIndex, setCurrentGameIndex] = useState(0);

    const handleGameComplete = () => {
        if (currentGameIndex < games.length - 1) {
            setCurrentGameIndex(currentGameIndex + 1);
        } else {
            onDone();
        }
    }

    return (
            <ThisOrThat
                game={games[currentGameIndex]}
                players={players}
                votingTime={votingTime}
                maxScore={maxScore}
                onDone={handleGameComplete}
                key={currentGameIndex}
            />
    );
}

export default RoundAnswers;
