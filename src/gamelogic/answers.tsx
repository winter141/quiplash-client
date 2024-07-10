import {Player, PlayerResponse} from "../types/types/Player";
import {GameClass} from "../types/classes/GameClass";

const getPlayersNotInGame = (game: GameClass, playerResponses: PlayerResponse[], players: Player[]) : Player[] => {
    // const playersInResponse: string[]  = playerResponses.map(playerResponse => playerResponse.username);
    // return players.filter(player => (!playersInResponse.includes(player.name)));

    return players; // temporary testing
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

export { getPlayersNotInGame, addPlayerResponseToLocalStorage }
