import React, {useState} from "react";
import {MediaResponseData} from "../../../../types/Responses";
import {MediaGame} from "../../../../gamelogic/gameClasses/MediaGame";
import DisplayDrawing from "./DisplayDrawing";


interface DisplayEachDrawingProps {
    game: MediaGame;
    onDone: () => void;
}

const DisplayEachDrawing: React.FC<DisplayEachDrawingProps> = ({ game, onDone}) => {
    const [currentResponseIndex, setCurrentResponseIndex] = useState(0);

    const playerResponses = game.getPlayerResponses();

    const handleResponseComplete = () => {
        if (currentResponseIndex < playerResponses.length - 1) {
            setCurrentResponseIndex(currentResponseIndex + 1);
        } else {
            onDone();
        }
    }


    return (
        <DisplayDrawing
            responseData={playerResponses[currentResponseIndex].responseData as MediaResponseData}
            onDone={handleResponseComplete}
            key={currentResponseIndex}
        />
    )
}

export default DisplayEachDrawing;