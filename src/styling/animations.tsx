import {keyframes} from "@emotion/react";
import styled from "@emotion/styled";
import {Chip, Paper, Typography} from "@mui/material";

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const AnimatedPaper = styled(Paper)`
  animation: ${fadeIn} 1s ease-out forwards;
`;

export const AnimatedChip = styled(Chip)`
  animation: ${fadeIn} 0.5s ease-out forwards;
`;

export const AnimatedTypography = styled(Typography)`
    animation: ${fadeIn} 0.2s;
`;

export const AnimatedDiv = styled('div')`
    animation: ${fadeIn} 0.2s;
`;