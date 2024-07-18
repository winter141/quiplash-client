import {Player} from "../Player";
import {LashQuipGame} from "../../gamelogic/gameClasses/LashQuipGame";

export interface RoundProps {
    players: Player[]
    onDone: () => void;
}

export interface RoundManagerProps extends RoundProps {
    roundNumber: number
}

export interface LashQuipQuestionsProps extends RoundProps {
    questionTime: number,
    questionAmount: number,
}

export interface LashQuipAnswerProps extends RoundProps{
    games: LashQuipGame[],
    votingTime: number,
    maxScore: number,
}

export interface ThisOrThatProps extends RoundProps {
    game: LashQuipGame,
    votingTime: number,
    maxScore: number
}

export interface ResultsProps extends RoundProps {
    sceneTime: number,
    messages: string[]
}
