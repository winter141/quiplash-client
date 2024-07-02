import {Paper} from "@mui/material";
import React from "react";
import {card} from "../styling/styles";

const NotFound = () => {
    return (
        <Paper elevation={3} style={card}>
            <h1>Not Found</h1>
        </Paper>
    );
}

export default NotFound;