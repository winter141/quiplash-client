interface PlayerResponse  {
    username: string;
    votes: string[]; // List of usernames of the votes for this response,
}

interface LashQuipResponse extends PlayerResponse  {
    response: string;
    safetyQuip: boolean;
}

interface MediaResponse extends PlayerResponse {
    imageTitle: string;
    dataUrl: string | null;
}

interface LashQuipScoreFromRound {
    playerResponse: LashQuipResponse;
    quiplashBonus: number;
    scoreFromRound: number;
}

interface MediaScoreFromRound {
    playerResponse: MediaResponse;
    scoreFromRound: number;
}

export type { PlayerResponse, LashQuipResponse, MediaResponse, LashQuipScoreFromRound, MediaScoreFromRound }