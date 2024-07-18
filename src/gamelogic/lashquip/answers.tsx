import questions from "../../data/prompts.json";
import {PlayerResponse} from "../../types/Responses";
const { PROMPTS, FINAL_ROUND_SAFETY_QUIPS } = questions;

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

const getRoundMultiplier = (roundNumber: number): number => {
    if (roundNumber === 1) return 1;
    return roundNumber < 4 ? 2 : 3;
}

export { addPlayerResponseToLocalStorage, getBeforeResultsMessages, getSafetyQuipResponse,
    getRoundMultiplier}
