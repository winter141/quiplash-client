import React from "react";
import {Paper} from "@mui/material";
import {titleImage} from "../../styling/styles";
import {AnimatedDivTop} from "../../styling/animations";

interface TitleImageProps {
    titleName: string,
    sx?: any
}
const TitleImage: React.FC<TitleImageProps> = ({ titleName, sx }) => {
    return (
        <AnimatedDivTop style={sx}>
            <Paper
                elevation={12}
                component="img"
                src={require(`../../images/titles/${titleName}.png`)}
                alt="image not found"
                style={titleImage}
                key={titleName}
            />
        </AnimatedDivTop>
    )
}

export default TitleImage;
