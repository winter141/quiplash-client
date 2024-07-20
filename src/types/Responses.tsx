interface PlayerResponse  {
    username: string;
    votes: string[]; // List of usernames of the votes for this response,
    responseData: LashQuipResponseData | MediaResponseData;
}

interface LashQuipResponseData  {
    response: string;
    safetyQuip: boolean;
}

interface MediaResponseData {
    imageTitle: string;
    dataUrl: string | null;
}

interface PlayerScoreFromRound {
    playerResponse: PlayerResponse;
    scoreFromRound: number;
    quiplashBonus?: number;
}

export type { PlayerResponse, LashQuipResponseData, MediaResponseData, PlayerScoreFromRound };
