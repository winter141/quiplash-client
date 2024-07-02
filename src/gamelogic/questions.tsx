import {Player, PlayerQuestions} from "../types/Player";
import questions from '../data/prompts.json';
const { ROUND_ONE_PROMPTS } = questions;

const generateMatchUps = (players: Player[], questionAmount: number) => {
    const n = players.length;
    players = shuffleArray(players);

    if ((n * questionAmount) % 2 !== 0) {
        throw new Error("Number of Players and questions amount can't both be odd");
    }

    const playerCounts: number[] = new Array(n).fill(0);
    let matchUps = [];
    let i = 0

    while (playerCounts.some(count => count < questionAmount)) {
        if (playerCounts[i] < questionAmount) {
            const candidate = players[i];
            let j = (i + 1) % n;
            while (playerCounts[j % n] >= questionAmount) {
                j++;
            }
            matchUps.push([candidate, players[j]]);
            playerCounts[i] += 1;
            playerCounts[j] += 1;
        }
        i = (i + 1) % n
    }

    return matchUps;
}

function shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const generateRoundOneQuestions = (matchUps: Player[][], players: Player[]): PlayerQuestions[] => {
    const prompts = shuffleArray(ROUND_ONE_PROMPTS);
    let i = 0;
    let playerQuestions: PlayerQuestions[] = players.map((player: Player) => ({
        player: player,
        questions: []
        }))

    matchUps.forEach((matchUp) => {
        const question = ROUND_ONE_PROMPTS[i];
        playerQuestions = addQuestionToPlayers(playerQuestions, question, matchUp);
        i++;
    })

    return playerQuestions;
}

function addQuestionToPlayers(playerQuestions: PlayerQuestions[], question: string, players: Player[]): PlayerQuestions[] {
    for (const player of players) {
        playerQuestions.find(item => item.player.name === player.name)?.questions.push(question);
    }
    return playerQuestions;
}

export { generateMatchUps, generateRoundOneQuestions }