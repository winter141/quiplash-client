import React, {useState} from 'react';
import {RoundProps} from "../../../types/RoundProps";
import {RoundScenes} from "../../../types/Scenes";
import RoundQuestions from "./RoundQuestions";
import RoundAnswers from "./RoundAnswers";
import {Game} from "../../../types/Player";
import testingData from '../../../data/testingdata.json';
import RoundResults from "./RoundResults";
const { PLAYERS, PLAYER_QUESTIONS, GAMES } = testingData;

const QUESTION_TIME = 15;
const QUESTION_AMOUNT = 2;
const MAX_SCORE = 1000;
const VOTING_TIME = 10;
const RESULTS_TIME = 5;

const RoundManager: React.FC<RoundProps> = ({players, onDone}) => {
    const [currentScene, setCurrentScene] = useState<RoundScenes>(RoundScenes.QUESTIONS);
    const [games, setGames] = useState<Game[]>([]);

    const handleChangeScene = () => {
        switch (currentScene) {
            case RoundScenes.QUESTIONS:
                console.log("attempting to switch to games (answers) scene");
                try {
                    const storedGames: Game[] = getGames();
                    setGames(storedGames);
                    console.log("switching to games (answers) scene");
                    console.log(storedGames);
                    setCurrentScene(RoundScenes.ANSWERS);
                } catch (e) {
                    console.log("OH NOOOO: AN ERROR HAPPENED");
                    console.error(e);
                }
                break;
            case RoundScenes.ANSWERS:
                setCurrentScene(RoundScenes.RESULTS);
                break;
            case RoundScenes.RESULTS:
                onDone();
                break;
            default:
                setCurrentScene(RoundScenes.QUESTIONS);
                break;
        }
    }

    const getGames = (): Game[] => {
        const storedGames = localStorage.getItem('games');
        if (!storedGames) {
            throw new Error("NO GAMES");
        }
        return JSON.parse(storedGames);
    }

    switch (currentScene) {
        case RoundScenes.QUESTIONS:
            return (
                <RoundQuestions
                    questionTime={QUESTION_TIME}
                    questionAmount={QUESTION_AMOUNT}
                    players={players}
                    onDone={handleChangeScene}
                />
            );
        case RoundScenes.ANSWERS:
            return (
                <RoundAnswers
                    games={games}
                    players={players}
                    onDone={handleChangeScene}
                    maxScore={MAX_SCORE}
                    votingTime={VOTING_TIME}
                />
            );
        case RoundScenes.RESULTS:
            return (
                <RoundResults
                    players={players}
                    onDone={handleChangeScene}
                    sceneTime={RESULTS_TIME}
                />
            );
        default:
            return null;
    }
};

export default RoundManager;
