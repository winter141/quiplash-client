import {Player, PlayerResponse} from "../types/types/Player";
import questions from "../data/prompts.json";
const { PROMPTS, FINAL_ROUND_SAFETY_QUIPS } = questions;

const getPlayersNotInGame = (playerResponses: PlayerResponse[], players: Player[]) : Player[] => {
    const playersInResponse: string[]  = playerResponses.map(playerResponse => playerResponse.username);
    return players.filter(player => (!playersInResponse.includes(player.name)));
}

/**
 * Add a Player Response to local storage.
 * This is used in the final round ie: Write question given response
 * @param playerResponse Single Player Response
 */
const addPlayerResponseToLocalStorage = (playerResponse: PlayerResponse) => {
    const storedResponsesRaw = localStorage.getItem("playerResponses");
    const storedResponses = storedResponsesRaw ? JSON.parse(storedResponsesRaw) : [];
    if (!storedResponses.includes(playerResponse)) storedResponses.push(playerResponse)
    localStorage.setItem("playerResponses", JSON.stringify(storedResponses));
}

const getBeforeResultsMessages = (roundNumber: number) => {
    return roundNumber === 4 ? ["Lets see the final results..."] : [""];
}

const getSafetyQuipResponse = (question: string): string => {
    const prompt = PROMPTS.find(prompt => prompt.prompt === question);
    const safetyQuips =  prompt ? prompt.safetyQuips : FINAL_ROUND_SAFETY_QUIPS;
    return safetyQuips[Math.floor(Math.random() * safetyQuips.length)];
}

export { getPlayersNotInGame, addPlayerResponseToLocalStorage, getBeforeResultsMessages, getSafetyQuipResponse}
