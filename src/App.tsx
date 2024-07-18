import React from 'react';
import './App.css';
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import JoinRoom from "./components/user/JoinRoom";
import NotFound from "./components/NotFound";
import Lobby from "./components/game/Lobby";
import UserScreen from "./components/user/lashquip/UserScreenManager";
import GameMenu from "./components/game/GameMenu";
import GameManager from "./components/game/lashquip/GameManager";
import {ThemeProvider} from "@mui/material";
import { theme } from './styling/theme';

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
                    <Route path="/game/menu" element={<GameMenu/>}/>
                    <Route path="/game/lobby" element={<Lobby/>}/>

                    <Route path="/game/play/lashquip" element={<GameManager/>}/>

                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Router>
        </ThemeProvider>
    </div>
    );
}

export default App;
