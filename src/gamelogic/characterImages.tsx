const getRandomImageNum = () => {
    return getRandomNumber(2, 10);
}

const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export { getRandomImageNum }