enum GameScenes {
    RULES = "RULES",
    ROUND_ONE = "ROUND ONE",
    ROUND_TWO = "ROUND TWO",
    ROUND_THREE = "ROUND THREE",
    FINAL_ROUND = "FINAL ROUND"
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