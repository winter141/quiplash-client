import React, {createContext, useEffect, useState} from 'react';
import {RoundManagerProps} from "../../../../types/props/RoundProps";
import {RoundScenes} from "../../../../types/enums/Scenes";
import {getBeforeResultsMessages, getRoundMultiplier} from "../../../../gamelogic/lashquip/answers";
import {convertJsonToMediaGameClasses, MediaGame} from "../../../../gamelogic/gameClasses/MediaGame";
import {convertJsonToLashQuipGameClasses, LashQuipGame} from "../../../../gamelogic/gameClasses/LashQuipGame";
import IntroToScene from "../../../subcomponents/IntroToScene";
import RoundQuestions from "../../lashquip/rounds/RoundQuestions";
import RoundAnswers from "../../lashquip/rounds/RoundAnswers";
import RoundResults from "../../lashquip/rounds/RoundResults";
import {getResultMessages} from "../../../../gamelogic/lashquip/results";
import { getBeforeQuestionsMessages } from '../../../../gamelogic/lashquip/questions';
import DisplayAllDrawings from './DisplayAllDrawings';
import RoundQuestionsMedia from "./RoundQuestionsMedia";

const QUESTION_TIME = 80;
const QUESTION_AMOUNT = 1;
const MAX_SCORE = 1000;
const VOTING_TIME = 20;
const RESULTS_TIME = 5;
const FINAL_ROUND_NUMBER = 4;

export const roundContext = createContext<{ isFinalRound: boolean } | null>(null);

const RoundManagerMedia: React.FC<RoundManagerProps> = ({players, onDone, roundNumber}) => {
    const [currentScene, setCurrentScene] = useState<RoundScenes>(RoundScenes.BEFORE_QUESTIONS);
    const [games, setGames] = useState<MediaGame[]>([]);
    const isFinalRound = roundNumber === FINAL_ROUND_NUMBER;

    const roundMultiplier = getRoundMultiplier(roundNumber);

    useEffect(() => {
        resetRound();
    }, [roundNumber]);

    const resetRound = () => {
        setCurrentScene(RoundScenes.BEFORE_QUESTIONS);
        setGames([]);
    };

    const handleChangeScene = () => {
        switch (currentScene) {
            case RoundScenes.BEFORE_QUESTIONS:
                setCurrentScene(RoundScenes.QUESTIONS);
                break;
            case RoundScenes.QUESTIONS:
                try {
                    const storedGames: MediaGame[] = getGames();
                    setGames(storedGames);
                    setCurrentScene(RoundScenes.ANSWERS);
                } catch (e) {
                    console.error("OH NO: AN ERROR HAPPENED");
                    console.error(e);
                }
                break;
            case RoundScenes.ANSWERS:
                isFinalRound ? setCurrentScene(RoundScenes.BEFORE_RESULTS) : setCurrentScene(RoundScenes.RESULTS);
                break;
            case RoundScenes.BEFORE_RESULTS:
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

    const getGames = (): MediaGame[] => {
        const storedGames = localStorage.getItem('games');
        if (!storedGames) {
            throw new Error("NO GAMES");
        }
        return convertJsonToMediaGameClasses(JSON.parse(storedGames));
    }

    const showScene = () => {
        switch (currentScene) {
            case RoundScenes.BEFORE_QUESTIONS:
                return (
                    <IntroToScene
                        speechMessages={getBeforeQuestionsMessages(roundNumber)}
                        imageTitle={"round" + roundNumber}
                        onDone={handleChangeScene}
                    />
                )
            case RoundScenes.QUESTIONS:
                return (
                    <RoundQuestionsMedia
                        questionTime={QUESTION_TIME}
                        questionAmount={QUESTION_AMOUNT}
                        players={players}
                        onDone={handleChangeScene}
                    />
                )
            case RoundScenes.ANSWERS:
                return (
                    <DisplayAllDrawings
                        game={games[0]}
                        onDone={handleChangeScene}
                    />
                );
            case RoundScenes.BEFORE_RESULTS:
                return (
                    <IntroToScene
                        speechMessages={getBeforeResultsMessages(roundNumber)}
                        onDone={handleChangeScene}
                    />
                )
            case RoundScenes.RESULTS:
                return (
                    <RoundResults
                        players={players}
                        onDone={handleChangeScene}
                        sceneTime={RESULTS_TIME}
                        messages={getResultMessages(players, roundNumber)}
                    />
                );
            default:
                return null;
        }
    }

    return (
        <roundContext.Provider value={{isFinalRound}}>
            {showScene()}
        </roundContext.Provider>
    )
};

export default RoundManagerMedia;
