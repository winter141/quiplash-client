import {Button, Paper, Grid, List, ListItem, ListItemText, Typography} from "@mui/material";
import React, {useState} from "react";
import {colorCard} from "../../styling/styles";
import {useNavigate} from "react-router-dom";
import {getSocketConnection, useSocketOnHook} from "../../services/socket";
import TitleImage from "../subcomponents/TitleImage";

const socket = getSocketConnection();

const StartGame = () => {
    const [imageTitle, setImageTitle] = useState("partypack1");
    const [gameColor, setGameColor] = useState("black");
    const navigate = useNavigate();

    useSocketOnHook(socket, "init_game_room_success", (roomCode) => {
        localStorage.setItem("roomCode", roomCode);
        navigate('/game/lobby');
    })

    const startGame = () => {
        localStorage.clear();
        socket.emit("init_game_room");
    }

    const onGameHoverOn = () => {
        setImageTitle("lashquip");
        setGameColor("white");
    }

    const onGameHoverOff = () => {
        setImageTitle("partypack1");
        setGameColor("black");
    }

    return (
            <Paper elevation={10} style={colorCard}>
                <Typography variant="h3" sx={{padding: "15px"}}>Select Game:</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <List sx={{marginLeft: "30px"}}>
                            <ListItem key={1}>
                                <Button
                                    onClick={startGame}
                                    onMouseEnter={onGameHoverOn}
                                    onMouseLeave={onGameHoverOff}
                                >
                                    <Typography variant="h4" sx={{color: gameColor}}>LashQuip</Typography>
                                </Button>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={9}>
                        <TitleImage titleName={imageTitle} sx={{marginLeft: "10rem", padding:"2.5rem"}}/>
                    </Grid>
                </Grid>
            </Paper>
    );
}

export default StartGame;