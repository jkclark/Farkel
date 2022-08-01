import { useState } from "react";

import GameSetup from "./components/gameSetup";
import MainGamePage from "./components/mainGamePage";
import Welcome from "./components/welcome";

import "./App.css";

function App() {
  const [players, setPlayers] = useState([]);
  const [winNumber, setWinNumber] = useState(10000);
  const [turnScores, setTurnScores] = useState([]);
  const [totalScores, setTotalScores] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);

  return (
    <>
      <Welcome />
      <GameSetup
        players={players}
        setWinNumber={setWinNumber}
        setPlayers={setPlayers}
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
    </>
  );
}

export default App;
