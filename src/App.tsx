import React from 'react';
import './App.css';
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import JoinRoom from "./components/user/JoinRoom";
import NotFound from "./components/NotFound";
import Lobby from "./components/game/Lobby";
import UserScreen from "./components/user/UserScreenManager";
import GameMenu from "./components/game/GameMenu";
import GameManager from "./components/game/GameManager";
import {ThisOrThat} from "./components/game/rounds/ThisOrThat";
import testingData from './data/testingdata.json';
import RoundAnswers from "./components/game/rounds/RoundAnswers";
import Round from './components/game/rounds/RoundManager';
import RoundResults from "./components/game/rounds/RoundResults";
import {convertJsonToGameClasses} from "./types/classes/GameClass";
import IntroToScene from "./components/subcomponents/IntroToScene";
import {ThemeProvider} from "@mui/material";
import { theme } from './styling/theme';
import UserQuestions from "./components/user/UserQuestions";

const { PLAYERS, PLAYER_QUESTIONS, GAMES } = testingData;

const baseUrl = '/quiplash-client'

function App() {
    return (
    <div className="App">
        <ThemeProvider theme={theme}>
            <Router basename={baseUrl}>
                <Routes>
                    <Route path="/" element={<Navigate to="/join" />} />
                    <Route path="/join" element={<JoinRoom/>}/>
                    <Route path="/user" element={<UserScreen/>}/>
                    <Route path="/game/lobby" element={<Lobby/>}/>
                    <Route path="/game/menu" element={<GameMenu/>}/>
                    <Route path="/game/play" element={<GameManager/>}/>

                    <Route path="/r1" element={<Round
                        onDone={() => {}}
                        players={PLAYERS}
                        roundNumber={1}
                    />}
                    />

                    <Route path="/ra" element={<RoundAnswers
                        games={convertJsonToGameClasses(GAMES)}
                        maxScore={1000}
                        onDone={() => {}}
                        players={PLAYERS}
                        votingTime={3}/>}
                    />

                    <Route path="/tot" element={<ThisOrThat
                        game={convertJsonToGameClasses(GAMES)[0]}
                        onDone={() => {}}
                        players={PLAYERS}
                        votingTime={1}
                        maxScore={1000}
                    />}/>

                    <Route path="/rr" element={<RoundResults
                        onDone={() => {}}
                        players={PLAYERS}
                        sceneTime={5}
                        messages={[
                            "", "Third", "Second", "", "First, Congrats Champ",
                            "      and the rest of ya",
                            "Thanks for playing!"]}
                    />}/>

                    <Route path="/intro" element={<IntroToScene
                        onDone={() => {}}
                        speechMessages={["YO yo", "Yo?"]}
                        imageTitle={"round1"}
                    />}/>

                    <Route path="/user/q" element={<UserQuestions
                        onDone={() => {}}
                        imageNum={1}
                     questions={["poop?"]} roomCode={"DSFD"} username={"JIMMY"}/>}/>

                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Router>
        </ThemeProvider>
    </div>
    );
}

export default App;
