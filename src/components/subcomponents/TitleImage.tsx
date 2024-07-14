import React from "react";
import {Paper} from "@mui/material";
import {titleImage} from "../../styling/styles";
import {AnimatedDivTitleImage} from "../../styling/animations";
import CSS from "csstype";

interface TitleImageProps {
    titleName: string,
    sx?: any,
    style?: CSS.Properties
}
const TitleImage: React.FC<TitleImageProps> = ({ titleName, sx, style }) => {
    return (
        <AnimatedDivTitleImage style={sx}>
            <Paper
                elevation={12}
                component="img"
                src={require(`../../images/titles/${titleName}.png`)}
                alt="image not found"
                style={style ? style : titleImage}
            />
        </AnimatedDivTitleImage>
    )
}

export default TitleImage;
