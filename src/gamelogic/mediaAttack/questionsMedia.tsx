import {shuffleArray} from "../general/general";
import questions from '../../data/mediaprompts.json';
import {Player, PlayerQuestions} from "../../types/Player";
import {MediaGame} from "../gameClasses/MediaGame";
const { PROFILE_PICTURE_PROMPTS } = questions;


const getProfilePicturePrompts = (): string[] => {
    return shuffleArray(PROFILE_PICTURE_PROMPTS);
}

/**
 * Generate questions to send out to players as well as an Empty gameClasses array that can then be added to
 *
 * @param matchUps List of Player lists representing the match ups
 * @param players All Players
 */
const generateMediaQuestions = (players: Player[], prompts: string[]): [PlayerQuestions[], MediaGame[]] => {
    let i = 0;
    let playerQuestions: PlayerQuestions[] = players.map((player: Player) => ({
        player: player,
        questions: []
    }))

    let games: MediaGame[] = [];

    const question = prompts[i];
    playerQuestions = addQuestionToPlayers(playerQuestions, question, players);
    games.push(new MediaGame(question, players.map(player => player.name)))

    return [playerQuestions, games];
}

function addQuestionToPlayers(playerQuestions: PlayerQuestions[], question: string, players: Player[]): PlayerQuestions[] {
    for (const player of players) {
        playerQuestions.find(item => item.player.name === player.name)?.questions.push(question);
    }
    return playerQuestions;
}

export {getProfilePicturePrompts, generateMediaQuestions}