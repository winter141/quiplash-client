import {Player} from "./Player";
import {GameClass} from "./GameClass";

export interface RoundProps {
    players: Player[]
    onDone: () => void;
}

export interface QuestionsProps extends RoundProps {
    questionTime: number,
    questionAmount: number,
}

export interface AnswerProps extends RoundProps{
    games: GameClass[],
    votingTime: number,
    maxScore: number,
}

export interface ThisOrThatProps extends RoundProps {
    game: GameClass,
    votingTime: number
}

export interface ResultsProps extends RoundProps {
    sceneTime: number
}
