import React from "react";
import {Paper, Stack, Typography} from '@mui/material';
import {card} from "../../../../styling/styles";
import {MediaGame} from "../../../../gamelogic/gameClasses/MediaGame";
import {MediaResponseData} from "../../../../types/Responses";
import LinearTimer from "../../../subcomponents/LinearTimer";


interface DisplayDrawingProps {
    responseData: MediaResponseData;
    onDone: () => void;
    sx?: any;
}

const TIME_PER_DRAWING = 3;

const DisplayDrawing: React.FC<DisplayDrawingProps> = ({ responseData, onDone, sx}) => {
    let {dataUrl, imageTitle} = responseData;

    const handleDrawingDone = () => {
        onDone();
    }

    return (
        <div style={sx}>
            <Stack
                alignItems="center"
                justifyContent="center"
                spacing={2}
                sx={{ width: '100%', height: '100%' }}
            >
                <Paper elevation={5} style={card}>
                    <Paper
                        elevation={2}
                        component="img"
                        src={dataUrl ? dataUrl : ""}
                        alt="Image Not Submitted :("
                        sx={{ maxWidth: '100%', height: 'auto' }}
                    />
                    <Paper elevation={2}>
                        <Typography sx={{fontSize: "100%"}}>{imageTitle}</Typography>
                    </Paper>
                </Paper>
                <LinearTimer
                    initialTime={TIME_PER_DRAWING}
                    onTimeEnd={handleDrawingDone}
                    sx={{top: 40}}
                />
            </Stack>
        </div>
    )
}

export default DisplayDrawing;