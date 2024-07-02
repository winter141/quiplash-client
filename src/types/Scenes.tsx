enum GameScenes {
    RULES = "Rules",
    ROUND_ONE = "Round One",
    ROUND_TWO = "Round Two",
    ROUND_THREE = "Round Three"
}

enum RoundScenes {
    QUESTIONS,
    ANSWERS,
    RESULTS
}

enum UserScenes {
    INITIAL,
    WAITING,
    QUESTIONS,
    VOTING
}

export { GameScenes, RoundScenes, UserScenes }