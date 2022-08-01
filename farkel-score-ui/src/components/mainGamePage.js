import { useState } from "react";
import Container from "react-bootstrap/Container";

import Scoreboard from "./scoreboard";
import TurnInput from "./turnInput";

import "./mainGamePage.css";

function MainGamePage(props) {
  const [gameOver, setGameOver] = useState(false);

  return (
    <Container id="main-game-page">
      <div id="main-game-page-stack">
        <h4>Points to win: {props.winNumber}</h4>
        <TurnInput
          players={props.players}
          turnScores={props.turnScores}
          setTurnScores={props.setTurnScores}
          currentPlayer={props.currentPlayer}
          setCurrentPlayer={props.setCurrentPlayer}
          totalScores={props.totalScores}
          setTotalScores={props.setTotalScores}
        />
        <Scoreboard
          players={props.players}
          winNumber={props.winNumber}
          turnScores={props.turnScores}
          totalScores={props.totalScores}
          setGameOver={props.setGameOver}
        />
      </div>
    </Container>
  );
}

export default MainGamePage;
