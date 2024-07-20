import {Game} from "./Game";
import {LashQuipResponseData, PlayerResponse, PlayerScoreFromRound} from "../../types/Responses";
import {Player} from "../../types/Player";

class LashQuipGame extends Game {
    private readonly DEFAULT_RESPONSE: string = "[NO ANSWER]";
    private readonly QUIPLASH_BONUS_PERCENT = 0.2;
    private readonly SAFETY_QUIP_PERCENT = 0.5;
    private readonly NO_ANSWER_PERCENT = 0.25;

    constructor(question: string, players: string[], playerResponses: PlayerResponse[] = []) {
        const initializedResponses = playerResponses.length > 0 ? playerResponses : players.map(player => ({
            username: player,
            votes: [],
            responseData: {
                response: "",
                safetyQuip: false
            }
        }));

        super(question, initializedResponses);
    }

    /**
     * Used for deserializing data received from localstorage into GameClass Objects
     * @param json List of gameClasses in JSON
     */
    static fromJson(json: any): LashQuipGame {
        if (json instanceof LashQuipGame) return json;
        return new LashQuipGame(json.question, [], json.responses);
    }

    public cloneGame() {
        return new LashQuipGame(this.getQuestion(), [], this.playerResponses);
    }

    /**
     * Add response, ensuring it is unique.
     * @param username
     * @param response
     * @param safetyQuip if safety quip was used
     */
    public addResponse(username: string, response: string, safetyQuip: boolean) {
        response = this.getUniqueResponse(response);
        const foundPlayerResponse: PlayerResponse | undefined = this.findPlayerResponseByUsername(username);
        if (foundPlayerResponse) {
            foundPlayerResponse.responseData = {
                response: response,
                safetyQuip: safetyQuip
            }
        }
    }

    /**
     * Calculate scores and add to Players. Returns updated player list and scores for each player for that game.
     *
     * @param maxScore Max score for round
     * @param players Full list of all players
     */
    public addScoreToPlayers(maxScore: number, players: Player[]): [Player[] , PlayerScoreFromRound[]] {
        const totalVotes = this.getTotalVotes();

        let playerScoreFromRounds: PlayerScoreFromRound[] = [];

        for (const playerResponse of this.playerResponses) {
            const foundPlayer = players.find(player => player.name === playerResponse.username);
            if (foundPlayer) {
                const responseData = playerResponse.responseData as LashQuipResponseData;

                let quiplashBonus = 0;
                let scoreFromRound = 0;
                const safetyQuipMultiplier = responseData.safetyQuip ? this.SAFETY_QUIP_PERCENT : 1;
                const noAnswerMultiplier = responseData.response === this.DEFAULT_RESPONSE ? this.NO_ANSWER_PERCENT : 1;

                const votesForPlayer = playerResponse.votes.length;
                if (votesForPlayer > 0) {
                    scoreFromRound = Math.round((votesForPlayer / totalVotes) * maxScore * safetyQuipMultiplier * noAnswerMultiplier);
                }

                if (votesForPlayer > 0 && votesForPlayer === totalVotes && noAnswerMultiplier === 1) {
                    quiplashBonus += Math.round(maxScore * this.QUIPLASH_BONUS_PERCENT * safetyQuipMultiplier);
                }

                foundPlayer.score += scoreFromRound + quiplashBonus;
                playerScoreFromRounds.push({
                    playerResponse: playerResponse,
                    quiplashBonus: quiplashBonus,
                    scoreFromRound: scoreFromRound
                })
            }
        }
        return [players, playerScoreFromRounds];
    }

    private getUniqueResponse(responseInput: string): string {
        if (!this.findLashQuipResponseByResponse(responseInput)) {
            return responseInput
        }
        return this.getUniqueResponse(responseInput + 1);
    }

    private findLashQuipResponseByResponse(responseInput: string) {
        for (const playerResponse of this.playerResponses) {
            const responseData = playerResponse.responseData as LashQuipResponseData;
            if (responseData.response === responseInput) {
                return playerResponse;
            }
        }
        return;
    }
}

const convertJsonToLashQuipGameClasses = (jsonArray: any[]): LashQuipGame[]  => {
    return jsonArray.map(json => LashQuipGame.fromJson(json));
};

export { LashQuipGame, convertJsonToLashQuipGameClasses }
