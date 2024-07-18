import {Player} from "../../types/Player";
import {getLastPlace} from "../general/general";

const getResultMessages = (players: Player[], roundNumber: number) => {
    const lastPlacePlayer = getLastPlace(players);
    const lastPlaceMessage1 = lastPlacePlayer ? `${lastPlacePlayer.name}! You are in last place, get better` : '';
    const lastPlaceMessage2 = lastPlacePlayer ? `except for ${lastPlacePlayer.name}!     dead last` : '';

    switch (roundNumber) {
        case 1:
            return ["here are the results after round one   "]
        case 2:
            return [`Nice work team!`, lastPlaceMessage2];
        case 3:
            return ['Keep your laughing hat on!', lastPlaceMessage1];
        case 4:
            return [
                "", "Third", "Second", "", "First, Congrats Champ",
                players.length > 3 ? "      and the rest of ya" : "",
                "Thanks for playing!"]
        default:
            return ["Let's have a look at the results", lastPlaceMessage1];
    }
}

export {getResultMessages}