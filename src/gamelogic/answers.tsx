import {Player, PlayerResponse} from "../types/types/Player";
import {GameClass} from "../types/classes/GameClass";

const getPlayersNotInGame = (game: GameClass, playerResponses: PlayerResponse[], players: Player[]) : Player[] => {
    // const playersInResponse: string[]  = playerResponses.map(playerResponse => playerResponse.username);
    // return players.filter(player => (!playersInResponse.includes(player.name)));

    return players; // temporary testing
}

export { getPlayersNotInGame }
