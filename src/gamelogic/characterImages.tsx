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

const getBlackOrWhiteFromImageNum = (imageNum: number): string => {
    if (!imageNum || imageNum < 2 || imageNum > 10) {
        return "black";
    }
    const luminance = getLuminance(imageColoursHex[imageNum - 2]);
    return luminance > 0.25 ? 'black' : 'white';
}

function getLuminance(hexCode: string): number {
    hexCode = hexCode.replace(/^#/, '');

    let r = parseInt(hexCode.slice(0, 2), 16) / 255;
    let g = parseInt(hexCode.slice(2, 4), 16) / 255;
    let b = parseInt(hexCode.slice(4, 6), 16) / 255;

    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export { getHexColorFromImageNum, getBlackOrWhiteFromImageNum }
