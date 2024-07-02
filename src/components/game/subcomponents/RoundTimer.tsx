import React, { useState, useEffect } from 'react';
import {Box, CircularProgress, Typography} from "@mui/material";

interface RoundTimerProps {
    top: number;
    left: number;
    initialTime: number;
    onTimeEnd: () => void;
}
const RoundTimer: React.FC<RoundTimerProps> = ({ top, left, initialTime, onTimeEnd }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (timeLeft === 0) {
            onTimeEnd();
        }
        const timerId = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, onTimeEnd]);

    return (
        <Box
            position="relative"
            top={top}
            left={left}
            display="inline-flex"
            alignItems="center"
        >
            <CircularProgress variant="determinate" value={(timeLeft / initialTime) * 100} size={100} />
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
                <Typography variant="caption" component="div" color="textSecondary">
                    {timeLeft}
                </Typography>
            </Box>
        </Box>
    );
};

export default RoundTimer;
