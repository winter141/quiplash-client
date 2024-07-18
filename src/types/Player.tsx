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


export type { Player, PlayerQuestions }