import {Game, Player, PlayerResponse} from "./Player";

export interface RoundProps {
    players: Player[]
    onDone: () => void;
}

export interface QuestionsProps extends RoundProps {
    questionTime: number,
    questionAmount: number,
}

export interface AnswerProps extends RoundProps{
    games: Game[],
    votingTime: number,
    maxScore: number,
}

export interface ThisOrThatProps extends RoundProps {
    game: Game,
    votingTime: number
}

export interface ResultsProps extends RoundProps {
    sceneTime: number
}
