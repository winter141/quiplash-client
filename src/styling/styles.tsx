import CSS from "csstype";

const card: CSS.Properties = {
    padding: "10px",
    margin: "20px",
}

const colorCard: CSS.Properties = {
    padding: "10px",
    margin: "20px",
    backgroundColor: "#FBE590"
}

const questionWrapper: CSS.Properties ={
    padding: '20px',
    marginBottom: '20px'
}

const votesContainer: CSS.Properties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "12px"
}

const padding: CSS.Properties = {
    padding: '20px'
}

const animatedText: CSS.Properties = {
    fontSize: "2rem",
    animation: "bounce 1.5s infinite"
};

const paragraph: CSS.Properties = {
    marginTop: "20px",
    animation: "fadeIn 3s ease-in-out",
};

const characterImage: CSS.Properties = {
    width: "7rem",
    height: "7rem"
}

const titleImage: CSS.Properties = {
    width: "30rem",
    height: "30rem",
}

export {card, colorCard, animatedText, paragraph, questionWrapper, votesContainer, padding, characterImage, titleImage };