import {Box, Grid, ListItem, Paper} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {card, cardLobby} from "../../styling/styles";
import {useNavigate} from "react-router-dom";
import {Player} from "../../types/Player";
import {getSocketConnection, useSocketOnHook} from "../../services/socket";
import {AnimatedChip} from "../../styling/animations";
import ImageCharacter from "../subcomponents/ImageCharacter";
import {getBlackOrWhiteFromImageNum, getHexColorFromImageNum} from "../../gamelogic/general/imageColors";

const socket = getSocketConnection();
type PlayerWithVIP = Player & { VIP: boolean };

const Lobby = () => {
    const [players, setPlayers] = useState<PlayerWithVIP[]>([]);
    const navigate = useNavigate();
    const playersRef = useRef(players); // Create a ref to store the latest players state
    const roomCode = localStorage.getItem("roomCode") || "";
    const gameSelected = localStorage.getItem("gameSelected");

    useEffect(() => {
        playersRef.current = players;
        socket.emit("join_specific_room", roomCode);
    }, [players, roomCode]);

    useSocketOnHook(socket, "user_joined", (data) => {
        if (!data.rejoin) {
            setPlayers(players.concat([{name: data.username, score: 0, likes: 0, imageNum: data.imageNum, VIP: data.VIP}]));
        }
    })

    useSocketOnHook(socket, "start_game", (data) => {
        localStorage.setItem("players", JSON.stringify(playersRef.current));
        if (gameSelected) {
            navigate(`/game/play/${gameSelected}`);
        }
    })

    const displayLobby = () => {
        return (
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {players.map((player: PlayerWithVIP) => (
                <Grid item xs={4} key={player.name}>
                    <ListItem>
                        {player.VIP && (
                            <Box sx={{position: "absolute", top: 0}}>
                                <AnimatedChip
                                    label={"VIP"}
                                    size="small"
                                    sx={{backgroundColor: "gold",
                                        fontWeight: "bold",
                                        border: "2px solid black",
                                    }}
                                />
                            </Box>
                        )}
                        <ImageCharacter imageNum={player.imageNum}/>
                        <AnimatedChip
                            label={player.name}
                            size="medium"
                            sx={{color: getBlackOrWhiteFromImageNum(player.imageNum),
                                backgroundColor: getHexColorFromImageNum(player.imageNum),
                                fontWeight: "bold"}}
                        />
                    </ListItem>
                </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Paper elevation={3} style={card}>
            <h1>LashQuip Lobby</h1>
            <h2>Code: {roomCode}</h2>
            <Grid item xs={3}>
                <Box style={cardLobby}>{displayLobby()}</Box>
            </Grid>
        </Paper>
    );
}

export default Lobby;