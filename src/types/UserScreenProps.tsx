/**
 * Used to help other types extend
 */
export interface UserProps {
    username: string,
    roomCode: string,
    onDone: () => void
}

export interface UserVoteProps extends UserProps {
    question: string,
    responses: string[]
}

export interface UserQuestionsProps extends UserProps {
    questions: string[]
}