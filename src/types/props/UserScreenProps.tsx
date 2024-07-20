import {PlayerResponse} from "../Responses";

/**
 * Used to help other types-interfaces extend
 */
export interface UserProps {
    username: string,
    roomCode: string,
    onDone: () => void
}

export interface UserVoteProps extends UserProps {
    question: string,
    responses: PlayerResponse[]
}

export interface UserQuestionsProps extends UserProps {
    imageNum: number,
    questions: string[]
}