import React from "react";
import {Paper, Stack, Typography} from '@mui/material';
import {card} from "../../../../styling/styles";


interface DisplayDrawingProps {
    dataUrl: string;
    imageTitle: string;
    onDone: () => void;
    sx?: any;
}

const DisplayDrawings: React.FC<DisplayDrawingProps> = ({ dataUrl, imageTitle, onDone, sx}) => {
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
                        src={dataUrl}
                        alt="image not found"
                        sx={{ maxWidth: '100%', height: 'auto' }}
                    />
                    <Paper elevation={2}>
                        <Typography sx={{fontSize: "100%"}}>{imageTitle}</Typography>
                    </Paper>
                </Paper>
            </Stack>
        </div>
    )
}

export default DisplayDrawings;