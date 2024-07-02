import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
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
import UserVote from "./components/user/UserVote";
import RoundResults from "./components/game/rounds/RoundResults";
const { PLAYERS, PLAYER_QUESTIONS, GAMES } = testingData;

function App() {

    return (
    <div className="App">
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/join" />} />
                <Route path="/join" element={<JoinRoom/>}/>
                <Route path="/user" element={<UserScreen/>}/>
                <Route path="/game/lobby" element={<Lobby/>}/>
                <Route path="/game/menu" element={<GameMenu/>}/>
                <Route path="/game/play" element={<GameManager/>}/>

                <Route path="/r1" element={<Round
                    onDone={() => {}}
                    players={PLAYERS}/>}
                />

                <Route path="/ra" element={<RoundAnswers
                    games={GAMES}
                    maxScore={1000}
                    onDone={() => {}}
                    players={PLAYERS}
                    votingTime={20}/>}
                />

                <Route path="/tot" element={<ThisOrThat
                 game={GAMES[0]}
                 onDone={() => {}}
                 players={PLAYERS}
                 votingTime={1}
                />}/>

                <Route path="/rr" element={<RoundResults
                    onDone={() => {}}
                    players={PLAYERS}
                    sceneTime={5}
                />}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </Router>
    </div>
    );
}

export default App;
