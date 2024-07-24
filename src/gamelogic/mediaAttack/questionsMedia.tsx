import {shuffleArray} from "../general/general";
import questions from '../../data/mediaprompts.json';
import {Player, PlayerQuestions} from "../../types/Player";
import {MediaGame} from "../gameClasses/MediaGame";
import {MediaResponseData, PlayerResponse} from "../../types/Responses";
const { PROFILE_PICTURE_PROMPTS, POST_PICTURE_PROMPTS } = questions;


const getProfilePicturePrompts = (): string[] => {
    return shuffleArray(PROFILE_PICTURE_PROMPTS);
}

const getPostPicturePrompts = (): string[] => {
    return shuffleArray(POST_PICTURE_PROMPTS);
}

/**
 * Generate questions to send out to players as well as an Empty gameClasses array that can then be added to.
 * Only generates ONE game, with all users in it.
 *
 * @param prompts
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

/**
 * Create different prompts for each user. For submitting picture.
 *
 * @param players
 * @param prompts
 */
const generatePostMediaQuestions = (players: Player[], prompts: string[]): [PlayerQuestions[], MediaGame[]] => {
    let singleQuestionGames: MediaGame[] = [];
    let playerQuestions: PlayerQuestions[] = [];

    let i = 0;
    for (const player of players) {
        const question = prompts[i];
        singleQuestionGames.push(new MediaGame(question, [player.name]));
        playerQuestions.push({ player: player, questions: [question]});
        i += 1;
    }

    return [playerQuestions, singleQuestionGames];
}

/**
 * Assign picture to each user
 *
 * @param previousPlayerResponses
 * @param players
 */
const assignPicturesToUsers = (previousPlayerResponses: PlayerResponse[], players: Player[]): PlayerResponse[] => {
    let newPlayerResponses: PlayerResponse[] = [];
    const sortedPreviousResponses = previousPlayerResponses.sort((a, b) => a.username.localeCompare(b.username));
    const sortedPlayers = players.sort((a, b) => a.name.localeCompare(b.name));


    for (let i = 0; i < sortedPlayers.length; i++) {
        const previousResponseIndex = i < sortedPlayers.length - 1 ? i + 1 : 0;
        const previousResponse = sortedPreviousResponses[previousResponseIndex];
        newPlayerResponses.push({
            username: sortedPlayers[i].name,
            partner: previousResponse.username,
            votes: [],
            responseData: {
                dataUrl: (previousResponse.responseData as MediaResponseData).dataUrl,
                imageTitle: ""
            }
        });
    }

    return newPlayerResponses;
}

function addQuestionToPlayers(playerQuestions: PlayerQuestions[], question: string, players: Player[]): PlayerQuestions[] {
    for (const player of players) {
        playerQuestions.find(item => item.player.name === player.name)?.questions.push(question);
    }
    return playerQuestions;
}

export {getProfilePicturePrompts, generateMediaQuestions}