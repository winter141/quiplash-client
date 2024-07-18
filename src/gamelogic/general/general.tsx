import {PlayerResponse} from "../../types/Responses";
import {Player} from "../../types/Player";
import {Game} from "../gameClasses/Game";

const getPlayersNotInGame = (playerResponses: PlayerResponse[], players: Player[]) : Player[] => {
    const playersInResponse: string[]  = playerResponses.map(playerResponse => playerResponse.username);
    return players.filter(player => (!playersInResponse.includes(player.name)));
}

const generateMatchUps = (players: Player[], questionAmount: number): Player[][] => {
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

const shuffleArray = (array: any[]): any[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Count all responses (in order to move on to next scene earlier than timer end)
 * @param games All Games
 */
const getAllResponsesCount = (games: Game[]) => {
    return games.reduce((sum, game) => sum + game.getPlayerResponses().length, 0);
}

const getLastPlace = (players: Player[]): Player => {
    return players.reduce((minPlayer, player) =>
        player.score < minPlayer.score ? player : minPlayer, players[0]);
}

export { getPlayersNotInGame, generateMatchUps, getAllResponsesCount, shuffleArray, getLastPlace }

