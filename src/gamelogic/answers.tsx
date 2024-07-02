import {Game, Player, PlayerResponse} from "../types/Player";

const getPlayersNotInGame = (game: Game, playerResponses: PlayerResponse[], players: Player[]) : Player[] => {
    // const playersInResponse: string[]  = playerResponses.map(playerResponse => playerResponse.username);
    // return players.filter(player => (!playersInResponse.includes(player.name)));

    return players; // temporary testing
}

export { getPlayersNotInGame }
