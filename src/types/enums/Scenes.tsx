enum GameScenes {
    RULES = "RULES",
    ROUND_ONE = "ROUND ONE",
    ROUND_TWO = "ROUND TWO",
    ROUND_THREE = "ROUND THREE",
    FINAL_ROUND = "FINAL ROUND",
}

enum RoundScenes {
    BEFORE_QUESTIONS,
    QUESTIONS,
    ANSWERS,
    BEFORE_RESULTS,
    RESULTS
}

enum UserScenes {
    INITIAL,
    WAITING,
    QUESTIONS,
    VOTING
}

export { GameScenes, RoundScenes, UserScenes }