type Player = {
    name: string,
    score: number,
    likes: number,
    imageNum: number
}

type PlayerQuestions = {
    player: Player,
    questions: string[]
}

type PlayerResponse = {
    username: string,
    response: string,
    votes: string[] // List of usernames of the votes for this response
}

export type { Player, PlayerQuestions, PlayerResponse }