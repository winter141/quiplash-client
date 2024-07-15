import {Box, LinearProgress} from "@mui/material";
import React, {useEffect, useState} from "react";

interface LinearTimerProps {
    initialTime: number;
    onTimeEnd: () => void;
    sx?: any;
}

const LinearTimer: React.FC<LinearTimerProps> = ({ initialTime, onTimeEnd, sx }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (timeLeft === 0) {
            setTimeout(() => {
                onTimeEnd();
            }, 500);
        }
        const timerId = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 0.25 : 0));
        }, 250);

        return () => clearInterval(timerId);
    }, [timeLeft, onTimeEnd]);

    return (
        <Box
            position="relative"
            sx={sx} // Apply sx prop here
            display="inline-flex"
            alignItems="center"
        >
            <Box

                sx={{ width: '20rem', height: '3rem' }} // Styling for the overlay Box
            >
                <LinearProgress
                    variant="determinate"
                    value={100 - (timeLeft / initialTime) * 100}
                    sx={{ height: '100%', borderRadius: '2rem' }} // Styling for the LinearProgress
                />
            </Box>
        </Box>
    )
}

export default LinearTimer;