import {Player, PlayerQuestions} from "../../types/Player";
import questions from '../../data/prompts.json';
import {LashQuipResponseData, PlayerResponse} from "../../types/Responses";
import {shuffleArray} from "../general/general";
import {LashQuipGame} from "../gameClasses/LashQuipGame";
const { PROMPTS } = questions;

/**
 * Generate questions to send out to players as well as an Empty gameClasses array that can then be added to
 *
 * @param matchUps List of Player lists representing the match ups
 * @param players All Players
 */
const generateQuestions = (matchUps: Player[][], players: Player[], prompts: string[]): [PlayerQuestions[], LashQuipGame[]] => {
    let i = 0;
    let playerQuestions: PlayerQuestions[] = players.map((player: Player) => ({
        player: player,
        questions: []
    }))

    let games: LashQuipGame[] = [];

    matchUps.forEach((matchUp: Player[]) => {
        const question = prompts[i];
        playerQuestions = addQuestionToPlayers(playerQuestions, question, matchUp);
        games.push(new LashQuipGame(question, matchUp.map(player => player.name)));
        i++;
    })

    return [playerQuestions, games];
}

function addQuestionToPlayers(playerQuestions: PlayerQuestions[], question: string, players: Player[]): PlayerQuestions[] {
    for (const player of players) {
        playerQuestions.find(item => item.player.name === player.name)?.questions.push(question);
    }
    return playerQuestions;
}

const getFinalRoundPrompts = (): string[] => {
    const storedResponses = localStorage.getItem("playerResponses");
    const playerResponses: PlayerResponse[] = storedResponses ? JSON.parse(storedResponses) : []
    return playerResponses.map((playerResponse) =>
        (playerResponse.responseData as LashQuipResponseData).response + " is the answer, what is the question?");
}

const getBasicPrompts = (): string[] => {
    return shuffleArray(PROMPTS.map(prompt => prompt.prompt));
}

const getBeforeQuestionsMessages = (roundNumber: number): string[] => {
    switch (roundNumber) {
        case 1:
            return ["Let's warmup with Round 1!"]
        case 2:
            return ["Time to shine in Round 2", "Points are now doubled!"];
        case 3:
            return ["Here comes Round Three"];
        case 4:
            return ["And now for the Final showdown!", "Points are now tripled!"]
        default:
            return [""];
    }
}

export { generateQuestions, getBasicPrompts, getFinalRoundPrompts, getBeforeQuestionsMessages }