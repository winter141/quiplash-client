import {PlayerResponse} from "../../types/Responses";

class Game {
    private readonly question: string;
    protected playerResponses: PlayerResponse[];

    constructor(question: string, playerResponses: PlayerResponse[]) {
        this.question = question;
        this.playerResponses = playerResponses;
    }

    public getQuestion(): string {
        return this.question;
    }

    public getGameJson() {
        return {
            question: this.question,
            responses: this.playerResponses
        };
    }

    public getPlayerResponses() {
        return this.playerResponses
            .sort((a, b) =>
                a.username.localeCompare(b.username));
    }

    public addVote(voterUsername: string, responseUsername: string) {
        const foundPlayerResponse = this.findPlayerResponseByUsername(responseUsername);
        if (foundPlayerResponse && !foundPlayerResponse.votes.includes(voterUsername)) {
            foundPlayerResponse.votes.push(voterUsername);
        }
    }

    public getWinnerPlayerResponse(): PlayerResponse | undefined {
        return this.playerResponses.sort((a, b) => b.votes.length - a.votes.length)[0];
    }

    protected findPlayerResponseByUsername(username: string): PlayerResponse | undefined {
        return this.playerResponses.find(response => response.username === username);
    }

    protected getTotalVotes(): number {
        return this.playerResponses
            .map(playerResponse => playerResponse.votes.length)
            .reduce((acc, curr) => acc + curr, 0);
    }
}

export { Game }