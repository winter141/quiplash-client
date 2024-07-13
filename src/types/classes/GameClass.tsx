import {Player, PlayerResponse, PlayerScoreFromRound} from "../types/Player";

class GameClass {
    private readonly question: string;
    private readonly playerResponses: PlayerResponse[];
    private readonly DEFAULT_RESPONSE: string = "[NO ANSWER]";
    private readonly QUIPLASH_BONUS_PERCENT = 0.2;

    /**
     * Initialize default Game Object
     * @param question Game question
     * @param players List of player usernames
     * @param playerResponses Optional parameter of the player responses (used for cloning)
     */
    public constructor(question: string, players: string[], playerResponses: PlayerResponse[] = []) {
        this.question  = question;
        if (playerResponses.length > 0) {
            this.playerResponses = playerResponses;
        } else {
            this.playerResponses = [];
            for (const player of players) {
                this.playerResponses.push({
                    username: player,
                    response: this.DEFAULT_RESPONSE,
                    votes: [],
                    safetyQuip: false
                })
            }
        }
    }

    /**
     * Used for deserializing data received from localstorage into GameClass Objects
     * @param json List of games in JSON
     */
    static fromJson(json: any): GameClass {
        if (json instanceof GameClass) return json;
        return new GameClass(json.question, [], json.responses);
    }

    public getGameJson() {
        return {
            question: this.question,
            responses: this.playerResponses
        };
    }

    public getQuestion(): string {
        return this.question;
    }

    public getPlayerResponses() {
        return this.playerResponses
            .sort((a, b) =>
                a.username.localeCompare(b.username));
    }

    public cloneGame() {
        return new GameClass(this.question, [], this.playerResponses);
    }

    /**
     * Add response, ensuring it is unique.
     * @param username
     * @param response
     * @param safetyQuip if safety quip was used
     */
    public addResponse(username: string, response: string, safetyQuip: boolean) {
        response = this.getUniqueResponse(response);
        const foundPlayerResponse = this.findPlayerResponseByUsername(username);
        if (foundPlayerResponse) {
            foundPlayerResponse.response = response;
            foundPlayerResponse.safetyQuip = safetyQuip;
        }
    }

    public addVote(voterUsername: string, response: string) {
        const foundPlayerResponse = this.findPlayerResponseByResponse(response);
        if (foundPlayerResponse && !foundPlayerResponse.votes.includes(voterUsername)) {
            foundPlayerResponse.votes.push(voterUsername);
        }
    }

    /**
     * Calculate scores and add to Players. Returns updated player list and scores for each player for that game.
     *
     * @param maxScore Max score for round
     * @param players Full list of all players
     */
    public addScoreToPlayers(maxScore: number, players: Player[]): [Player[] , PlayerScoreFromRound[]] {

        const totalVotes = this.playerResponses
            .map(playerResponse => playerResponse.votes.length)
            .reduce((acc, curr) => acc + curr, 0);

        let playerScoresFromRound: PlayerScoreFromRound[] = [];

        for (const playerResponse of this.playerResponses) {
            const foundPlayer = players.find(player => player.name === playerResponse.username);
            if (foundPlayer) {
                let quiplashBonus = 0;
                let scoreFromRound = 0;
                const safetyQuipMultiplier = playerResponse.safetyQuip ? 0.5 : 1;

                const votesForPlayer = playerResponse.votes.length;
                if (votesForPlayer > 0) {
                    scoreFromRound = Math.round((votesForPlayer / totalVotes) * maxScore * safetyQuipMultiplier);
                }

                if (votesForPlayer > 0 && votesForPlayer === totalVotes) {
                    quiplashBonus += Math.round(maxScore * this.QUIPLASH_BONUS_PERCENT * safetyQuipMultiplier);
                }

                foundPlayer.score += scoreFromRound + quiplashBonus;
                playerScoresFromRound.push({
                    playerResponse: playerResponse,
                    scoreFromRound: scoreFromRound,
                    quiplashBonus: quiplashBonus
                })
            }
        }
        return [players, playerScoresFromRound];
    }

    /**
     * Get player response with most votes
     */
    public getWinnerPlayerResponse() {
        return this.playerResponses.sort((a, b): number => {
            return b.votes.length - a.votes.length;
        })[0];
    }

    private findPlayerResponseByUsername(username: string) {
        return this.playerResponses.find(response => response.username === username);
    }

    private findPlayerResponseByResponse(responseInput: string) {
        return this.playerResponses.find(response => response.response === responseInput);
    }

    private getUniqueResponse(responseInput: string): string {
        if (!this.findPlayerResponseByResponse(responseInput)) {
            return responseInput
        }
        return this.getUniqueResponse(responseInput + 1);
    }
}

const convertJsonToGameClasses = (jsonArray: any[]): GameClass[] => {
    return jsonArray.map(json => GameClass.fromJson(json));
};

export { GameClass, convertJsonToGameClasses }