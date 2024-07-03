import {PlayerQuestions, PlayerResponse} from "./Player";

class GameClass {
    private readonly question: string;
    private readonly playerResponses: PlayerResponse[];
    private readonly DEFAULT_RESPONSE: string = "[NO ANSWER]";

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
                    votes: []})
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
        return this.playerResponses;
    }

    public cloneGame() {
        return new GameClass(this.question, [], this.playerResponses);
    }

    /**
     * Add response, ensuring it is unique.
     * @param username
     * @param response
     */
    public addResponse(username: string, response: string) {
        response = this.getUniqueResponse(response);
        const foundPlayerResponse = this.findPlayerResponseByUsername(username);
        if (foundPlayerResponse) foundPlayerResponse.response = response;
    }

    public addVote(voterUsername: string, response: string) {
        const foundPlayerResponse = this.findPlayerResponseByResponse(response);
        if (foundPlayerResponse && !foundPlayerResponse.votes.includes(voterUsername)) {
            foundPlayerResponse.votes.push(voterUsername);
        }
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