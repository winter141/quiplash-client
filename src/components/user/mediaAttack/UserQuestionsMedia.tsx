import React, {useEffect, useState} from "react";
import {UserQuestionsProps} from "../../../types/props/UserScreenProps";
import {getSocketConnection, useSocketOnHook} from "../../../services/socket";
import DrawingCanvas from "./DrawingCanvas";

const socket = getSocketConnection();

const UserQuestionsMedia: React.FC<UserQuestionsProps> = ({username, roomCode, imageNum, questions, onDone}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const imageTitle = "bla bla";

    useEffect(() => {
        socket.emit("join_specific_rooms", [username, roomCode + "users"]);
    }, [roomCode, username]);

    useSocketOnHook(socket, "receive_time_end", ()=> {
        onDone();
    });

    const submitDrawing = (dataUrl: string) => {
        let allSubmitted = false;
        if (currentQuestionIndex >= questions.length - 1) allSubmitted = true;

        socket.emit("submit_response_media", {
            username: username,
            room: roomCode,
            imageNum: imageNum,
            question: questions[currentQuestionIndex],
            dataUrl: dataUrl,
            imageTitle: imageTitle,
            allSubmitted: allSubmitted
        })

        if (allSubmitted) {
            onDone();
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }

    return (
        <>
            {questions.length > 0 && currentQuestionIndex < questions.length && (
                <div style={{marginBottom: '10px' }}>
                    <DrawingCanvas
                        onDone={submitDrawing}
                    />
                </div>
            )}
        </>
    );
}

export default UserQuestionsMedia;