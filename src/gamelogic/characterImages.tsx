const imageColoursHex = [
    "FF914D",
    "00BF63",
    "FF5757",
    "A4A4A4",
    "FFBD59",
    "545454",
    "5CE1E6",
    "FF66C4",
    "8C52FF"
]

const getHexColorFromImageNum = (imageNum: number): string => {
    if (!imageNum || imageNum < 2 || imageNum > 10) {
        return "black";
    }
    return "#" + imageColoursHex[imageNum - 2]
}

export { getHexColorFromImageNum }