import { useState } from "react";

import GameSetupPage from "./components/gameSetupPage";
import MainGamePage from "./components/mainGamePage";
import PostGamePage from "./components/postGamePage";
import WelcomePage from "./components/welcomePage";

import { DEFAULT_WIN_NUMBER } from "./constants";

import "./App.css";

function App() {
  const [players, setPlayers] = useState([]);
  const [playerColors, setPlayerColors] = useState([]);
  const [winNumber, setWinNumber] = useState(DEFAULT_WIN_NUMBER);
  const [turnScores, setTurnScores] = useState([]);
  const [totalScores, setTotalScores] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);

  return (
    <>
      <WelcomePage />
      <GameSetupPage
        players={players}
        playerColors={playerColors}
        setWinNumber={setWinNumber}
        setPlayers={setPlayers}
        setPlayerColors={setPlayerColors}
        setTurnScores={setTurnScores}
        setTotalScores={setTotalScores}
      />
      <MainGamePage
        players={players}
        winNumber={winNumber}
        currentPlayer={currentPlayer}
        setCurrentPlayer={setCurrentPlayer}
        turnScores={turnScores}
        setTurnScores={setTurnScores}
        totalScores={totalScores}
        setTotalScores={setTotalScores}
      />
      <PostGamePage
        players={players}
        winNumber={winNumber}
        turnScores={turnScores}
        totalScores={totalScores}
      />
    </>
  );
}

export default App;
