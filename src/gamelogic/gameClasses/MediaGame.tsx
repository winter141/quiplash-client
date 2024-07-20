import {PlayerResponse, PlayerScoreFromRound} from "../../types/Responses";
import {Game} from "./Game";
import {Player} from "../../types/Player";

class MediaGame extends Game {

    constructor(question: string, players: string[], playerResponses: PlayerResponse[] = []) {
        const initializedResponses = playerResponses.length > 0 ? playerResponses : players.map(player => ({
            username: player,
            votes: [],
            responseData: {
                dataUrl: "",
                imageTitle: ""
            }
        }));

        super(question, initializedResponses);
    }

    /**
     * Add response
     * @param username
     * @param dataUrl
     * @param imageTitle
     */
    public addResponse(username: string, dataUrl: string, imageTitle: string) {
        const foundPlayerResponse = this.findPlayerResponseByUsername(username);
        if (foundPlayerResponse) {
            foundPlayerResponse.responseData = {
                dataUrl: dataUrl,
                imageTitle: imageTitle
            };
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

        for (const mediaResponse of this.playerResponses) {
            const foundPlayer = players.find(player => player.name === mediaResponse.username);
            if (foundPlayer) {
                let scoreFromRound = 0;

                const votesForPlayer = mediaResponse.votes.length;
                if (votesForPlayer > 0) {
                    scoreFromRound = Math.round((votesForPlayer / totalVotes) * maxScore);
                }
                foundPlayer.score += scoreFromRound;

                playerScoreFromRounds.push({
                    playerResponse: mediaResponse,
                    scoreFromRound: scoreFromRound
                })
            }
        }
        return [players, playerScoreFromRounds];
    }
}

export { MediaGame }