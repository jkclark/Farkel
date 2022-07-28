import { useState } from "react";

import PlayerEntry from "./components/playerEntry";
import Scorekeeper from "./components/scorekeeper";
import Welcome from "./components/welcome";

import "./App.css";

function App() {
  const [players, setPlayers] = useState([]);

  return (
    <>
      <Welcome />
      <PlayerEntry players={players} setPlayers={setPlayers} />
      <Scorekeeper players={players} />
    </>
  );
}

export default App;
