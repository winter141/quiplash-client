import React from 'react';
import './App.css';
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import JoinRoom from "./components/user/JoinRoom";
import NotFound from "./components/NotFound";
import Lobby from "./components/game/Lobby";
import UserScreen from "./components/user/lashquip/UserScreenManager";
import UserScreenMedia from "./components/user/mediaAttack/UserScreenManagerMedia";
import GameMenu from "./components/game/GameMenu";
import GameManager from "./components/game/lashquip/GameManager";
import GameManagerMedia from "./components/game/mediaAttack/GameManagerMedia";
import {ThemeProvider} from "@mui/material";
import { theme } from './styling/theme';
import DrawingCanvas from "./components/user/mediaAttack/DrawingCanvas";
import DisplayAllDrawings from "./components/game/mediaAttack/rounds/DisplayAllDrawings";
import {MediaGame} from "./gamelogic/gameClasses/MediaGame";

const baseUrl = '/quiplash-client'

function App() {
    return (
    <div className="App">
        <ThemeProvider theme={theme}>
            <Router basename={baseUrl}>
                <Routes>
                    <Route path="/" element={<Navigate to="/join" />} />
                    <Route path="/join" element={<JoinRoom/>}/>
                    <Route path="/game/menu" element={<GameMenu/>}/>
                    <Route path="/game/lobby" element={<Lobby/>}/>

                    <Route path="/game/play/lashquip" element={<GameManager/>}/>
                    <Route path="/user/lashquip" element={<UserScreen/>}/>

                    <Route path="/game/play/mediaattack" element={<GameManagerMedia/>}/>
                    <Route path="/user/mediaattack" element={<UserScreenMedia/>}/>

                    <Route path="/canvas" element={<DrawingCanvas
                        onDone={()=>{}}
                        question="Yo?"
                    />}/>

                    <Route path="/dr" element={<DisplayAllDrawings
                        onDone={()=>{}}
                        game={new MediaGame("a", [])}
                    />}/>


                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Router>
        </ThemeProvider>
    </div>
    );
}

export default App;
