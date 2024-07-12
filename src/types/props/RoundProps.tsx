import {Player} from "../types/Player";
import {GameClass} from "../classes/GameClass";

export interface RoundProps {
    players: Player[]
    onDone: () => void;
}

export interface RoundManagerProps extends RoundProps {
    roundNumber: number
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
    votingTime: number,
    maxScore: number
}

export interface ResultsProps extends RoundProps {
    sceneTime: number,
    messages: string[]
}
