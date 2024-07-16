import React, { useState, useEffect } from 'react';
import {Box, CircularProgress, LinearProgress, Paper, Typography} from "@mui/material";

interface RoundTimerProps {
    initialTime: number;
    onTimeEnd: () => void;
    sx?: any;
}
const RoundTimer: React.FC<RoundTimerProps> = ({ initialTime, onTimeEnd, sx }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (timeLeft === 0) {
            setTimeout(() => {
                onTimeEnd();
            }, 500);
        }
        const timerId = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, onTimeEnd]);

    return (
        <Box
            position="relative"
            sx={sx} // Apply sx prop here
            display="inline-flex"
            alignItems="center"
        >
            <CircularProgress variant="determinate"
                              value={(timeLeft / initialTime) * 100}
                              size={110}
                              thickness={7}
            />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography component="div" color="textSecondary" sx={{fontWeight: 'bold', color: "black"}}>
                    {timeLeft}
                </Typography>
            </Box>
        </Box>
    );
};

export default RoundTimer;
