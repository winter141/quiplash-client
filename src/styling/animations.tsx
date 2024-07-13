import {keyframes} from "@emotion/react";
import styled from "@emotion/styled";
import {Chip, Paper, Typography} from "@mui/material";

export const fadeInFromTop = keyframes`
  from {
    opacity: 0;
    transform: translateY(-60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInFromBottom = keyframes`
  from {
    opacity: 0;
    transform: translateY(150px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;


export const grow = keyframes`
  from {
    transform: scaleY(0%);
    transform-origin: bottom;

  }
  to {
      transform: scaleY(100%);
      transform-origin: bottom;
  }
`;

export const swing = keyframes`
    from {
        transform: translateX(800px);
    }
    to {
        transform: translateY(0);
    }
`;

export const AnimatedPaper = styled(Paper)`
  animation: ${fadeInFromTop} 1s ease-out forwards;
`;

export const AnimatedChip = styled(Chip)`
  animation: ${fadeInFromTop} 0.5s ease-out forwards;
`;

export const AnimatedTypography = styled(Typography)`
    animation: ${fadeInFromTop} 0.2s;
`;

export const AnimatedDiv = styled('div')`
    animation: ${fadeInFromTop} 0.2s;
`;

export const AnimatedDivTop = styled('div')`
    animation: ${fadeInFromBottom} 0.8s;
`;

export const AnimatedDivGrow = styled('div')`
    animation: ${grow} 1.9s;
`;

export const AnimatedDivSwing = styled('div')`
    animation: ${swing} 1.5s;
`;