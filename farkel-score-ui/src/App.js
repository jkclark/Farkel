import { useState } from "react";

import PlayerEntry from "./components/playerEntry";
import MainGamePage from "./components/mainGamePage";
import Welcome from "./components/welcome";

import "./App.css";

function App() {
  const [players, setPlayers] = useState([]);
  const [turnScores, setTurnScores] = useState([
    [100, 200, 300],
    [200, 300, 500],
  ]);

  return (
    <>
      <Welcome />
      <PlayerEntry
        players={players}
        setPlayers={setPlayers}
        setTurnScores={setTurnScores}
      />
      <MainGamePage players={players} turnScores={turnScores} />
    </>
  );
}

export default App;
