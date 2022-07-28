import { useState } from "react";

import PlayerEntry from "./components/playerEntry";
import MainGamePage from "./components/mainGamePage";
import Welcome from "./components/welcome";

import "./App.css";

function App() {
  const [players, setPlayers] = useState([]);

  return (
    <>
      <Welcome />
      <PlayerEntry players={players} setPlayers={setPlayers} />
      <MainGamePage players={players} />
    </>
  );
}

export default App;
