import {Game} from "./Game";
import {LashQuipResponse, LashQuipScoreFromRound, PlayerResponse} from "../../types/Responses";
import {Player} from "../../types/Player";

class LashQuipGame extends Game {
    private lashQuipResponses: LashQuipResponse[];
    private readonly DEFAULT_RESPONSE: string = "[NO ANSWER]";
    private readonly QUIPLASH_BONUS_PERCENT = 0.2;
    private readonly SAFETY_QUIP_PERCENT = 0.5;
    private readonly NO_ANSWER_PERCENT = 0.25;

    constructor(question: string, players: string[], lashQuipResponses: LashQuipResponse[] = []) {
        let playerResponses: PlayerResponse[];

        if (lashQuipResponses.length > 0) {
            playerResponses = lashQuipResponses;
        } else {
            playerResponses = players.map(player => ({
                username: player,
                votes: [],
                response: "",
                safetyQuip: false
            }));
        }

        super(question, playerResponses);
        this.lashQuipResponses = playerResponses as LashQuipResponse[];
    }

    /**
     * Used for deserializing data received from localstorage into GameClass Objects
     * @param json List of gameClasses in JSON
     */
    static fromJson(json: any): LashQuipGame {
        if (json instanceof LashQuipGame) return json;
        return new LashQuipGame(json.question, json.responses);
    }

    public cloneGame() {
        return new LashQuipGame(this.getQuestion(), [], this.lashQuipResponses);
    }

    public getLashQuipResponses() {
        return this.lashQuipResponses
            .sort((a, b) =>
                a.username.localeCompare(b.username));
    }

    /**
     * Add response, ensuring it is unique.
     * @param username
     * @param response
     * @param safetyQuip if safety quip was used
     */
    public addResponse(username: string, response: string, safetyQuip: boolean) {
        response = this.getUniqueResponse(response);
        const foundPlayerResponse: LashQuipResponse | undefined = this.findLashQuipResponseByUsername(username);
        if (foundPlayerResponse) {
            foundPlayerResponse.response = response;
            foundPlayerResponse.safetyQuip = safetyQuip;
        }
    }

    /**
     * Calculate scores and add to Players. Returns updated player list and scores for each player for that game.
     *
     * @param maxScore Max score for round
     * @param players Full list of all players
     */
    public addScoreToPlayers(maxScore: number, players: Player[]): [Player[] , LashQuipScoreFromRound[]] {
        const totalVotes = this.getTotalVotes();

        let lashQuipScoresFromRound: LashQuipScoreFromRound[] = [];

        for (const lashQuipResponse of this.lashQuipResponses) {
            const foundPlayer = players.find(player => player.name === lashQuipResponse.username);
            if (foundPlayer) {
                let quiplashBonus = 0;
                let scoreFromRound = 0;
                const safetyQuipMultiplier = lashQuipResponse.safetyQuip ? this.SAFETY_QUIP_PERCENT : 1;
                const noAnswerMultiplier = lashQuipResponse.response === this.DEFAULT_RESPONSE ? this.NO_ANSWER_PERCENT : 1;

                const votesForPlayer = lashQuipResponse.votes.length;
                if (votesForPlayer > 0) {
                    scoreFromRound = Math.round((votesForPlayer / totalVotes) * maxScore * safetyQuipMultiplier * noAnswerMultiplier);
                }

                if (votesForPlayer > 0 && votesForPlayer === totalVotes && noAnswerMultiplier === 1) {
                    quiplashBonus += Math.round(maxScore * this.QUIPLASH_BONUS_PERCENT * safetyQuipMultiplier);
                }

                foundPlayer.score += scoreFromRound + quiplashBonus;
                lashQuipScoresFromRound.push({
                    playerResponse: lashQuipResponse,
                    quiplashBonus: quiplashBonus,
                    scoreFromRound: scoreFromRound
                })
            }
        }
        return [players, lashQuipScoresFromRound];
    }

    private getUniqueResponse(responseInput: string): string {
        if (!this.findLashQuipResponseByResponse(responseInput)) {
            return responseInput
        }
        return this.getUniqueResponse(responseInput + 1);
    }

    private findLashQuipResponseByResponse(responseInput: string) {
        return this.lashQuipResponses.find(response => response.response === responseInput);
    }

    private findLashQuipResponseByUsername(username: string): LashQuipResponse | undefined {
        return this.lashQuipResponses.find(response => response.username === username);
    }
}

const convertJsonToLashQuipGameClasses = (jsonArray: any[]): LashQuipGame[]  => {
    return jsonArray.map(json => LashQuipGame.fromJson(json));
};

export { LashQuipGame, convertJsonToLashQuipGameClasses }
