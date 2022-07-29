import { useState } from "react";

import PlayerEntry from "./components/playerEntry";
import MainGamePage from "./components/mainGamePage";
import Welcome from "./components/welcome";

import "./App.css";

function App() {
  const [players, setPlayers] = useState([]);
  const [turnScores, setTurnScores] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);

  return (
    <>
      <Welcome />
      <PlayerEntry
        players={players}
        setPlayers={setPlayers}
        setTurnScores={setTurnScores}
      />
      <MainGamePage
        players={players}
        currentPlayer={currentPlayer}
        setCurrentPlayer={setCurrentPlayer}
        turnScores={turnScores}
        setTurnScores={setTurnScores}
      />
    </>
  );
}

export default App;
