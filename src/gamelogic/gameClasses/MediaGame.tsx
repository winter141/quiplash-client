import {LashQuipResponse, MediaResponse, MediaScoreFromRound} from "../../types/Responses";
import {Game} from "./Game";
import {Player} from "../../types/Player";

class MediaGame extends Game {
    private mediaResponses: MediaResponse[];

    constructor(question: string, players: string[], mediaResponses: MediaResponse[] = []) {
        if (mediaResponses.length > 0) {
            super(question, mediaResponses);
            this.mediaResponses = mediaResponses;
        } else {
            for (const player of players) {
                mediaResponses.push({
                    username: player,
                    votes: [],
                    dataUrl: "",
                    imageTitle: ""
                })
            }
            super(question, mediaResponses)
            this.mediaResponses = mediaResponses;
        }
    }

    /**
     * Add response
     * @param username
     * @param response
     * @param safetyQuip if safety quip was used
     */
    public addResponse(username: string, dataUrl: string, imageTitle: string) {
        const foundPlayerResponse = this.findMediaResponseByUsername(username);
        if (foundPlayerResponse) {
            foundPlayerResponse.dataUrl = dataUrl;
            foundPlayerResponse.imageTitle = imageTitle;
        }
    }

    /**
     * Calculate scores and add to Players. Returns updated player list and scores for each player for that game.
     *
     * @param maxScore Max score for round
     * @param players Full list of all players
     */
    public addScoreToPlayers(maxScore: number, players: Player[]): [Player[] , MediaScoreFromRound[]] {
        const totalVotes = this.getTotalVotes();

        let mediaScoresFromRound: MediaScoreFromRound[] = [];

        for (const mediaResponse of this.mediaResponses) {
            const foundPlayer = players.find(player => player.name === mediaResponse.username);
            if (foundPlayer) {
                let scoreFromRound = 0;

                const votesForPlayer = mediaResponse.votes.length;
                if (votesForPlayer > 0) {
                    scoreFromRound = Math.round((votesForPlayer / totalVotes) * maxScore);
                }
                foundPlayer.score += scoreFromRound;

                mediaScoresFromRound.push({
                    playerResponse: mediaResponse,
                    scoreFromRound: scoreFromRound
                })
            }
        }
        return [players, mediaScoresFromRound];
    }


    private findMediaResponseByUsername(username: string): MediaResponse | undefined {
        return this.mediaResponses.find(response => response.username === username);
    }

}

export { MediaGame }