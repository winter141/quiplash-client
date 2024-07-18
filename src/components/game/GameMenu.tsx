import {Button, Paper, Grid, List, ListItem, Typography} from "@mui/material";
import React, {useState} from "react";
import {colorCard} from "../../styling/styles";
import {useNavigate} from "react-router-dom";
import {getSocketConnection, useSocketOnHook} from "../../services/socket";
import TitleImage from "../subcomponents/TitleImage";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const socket = getSocketConnection();

const games = [
    "partypack1",
    "lashquip",
    "media attack"
]

const StartGame = () => {
    const [gameSelectedIndex, setGameSelectedIndex] = useState(0);
    const navigate = useNavigate();

    useSocketOnHook(socket, "init_game_room_success", (roomCode) => {
        localStorage.clear();
        localStorage.setItem("roomCode", roomCode);
        const gameSelected = games[gameSelectedIndex].replace(" ", "");
        localStorage.setItem("gameSelected", gameSelected)
        navigate(`/game/lobby`);
    })

    const startGame = () => {
        socket.emit("init_game_room");
    }

    const onGameHoverOn = (index: number) => {
        setGameSelectedIndex(index);
    }

    const onGameHoverOff = () => {
        setGameSelectedIndex(0);
    }

    return (
            <Paper elevation={10} style={colorCard}>
                <Typography variant="h3" sx={{padding: "15px"}}>Select Game:</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <List sx={{marginLeft: "30px"}}>
                            {games.slice(1).map((game, index) => (
                                <ListItem key={index}>
                                    <Button
                                        sx={{color: (index + 1) === gameSelectedIndex ? "darkgrey" : "black"}}
                                        onClick={startGame}
                                        onMouseEnter={() => {onGameHoverOn(index + 1)}}
                                        onMouseLeave={onGameHoverOff}
                                    >
                                        <Typography variant="h4">{game}</Typography>
                                        <PlayArrowIcon sx={{paddingLeft: "3px"}}/>
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item xs={9}>
                        <TitleImage titleName={games[gameSelectedIndex].replace(" ", "")}
                                    sx={{marginLeft: "10rem", padding:"2.5rem"}}
                                    key={games[gameSelectedIndex].replace(" ", "")}
                        />
                    </Grid>
                </Grid>
            </Paper>
    );
}

export default StartGame;