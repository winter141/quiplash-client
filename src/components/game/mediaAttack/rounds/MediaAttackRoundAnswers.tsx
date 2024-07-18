import React, {useState} from "react";
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

    return (<></>)
}

export default RoundAnswers;
