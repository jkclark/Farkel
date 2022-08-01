import { useState } from "react";
import Container from "react-bootstrap/Container";

import Scoreboard from "./scoreboard";
import TurnInput from "./turnInput";

import "./mainGamePage.css";

function MainGamePage(props) {
  const [gameOver, setGameOver] = useState(false);

  function getGameWinner() {
    const totalScores = [...props.totalScores];
    const winner = totalScores.indexOf(Math.max(...totalScores));
    return winner;
  }

  return (
    <Container id="main-game-page">
      <div id="main-game-page-stack">
        {gameOver && <h4>{props.players[getGameWinner()]} wins!</h4>}
        <h4>Points to win: {props.winNumber}</h4>
        {!gameOver && (
          <TurnInput
            players={props.players}
            winNumber={props.winNumber}
            turnScores={props.turnScores}
            setTurnScores={props.setTurnScores}
            currentPlayer={props.currentPlayer}
            setCurrentPlayer={props.setCurrentPlayer}
            totalScores={props.totalScores}
            setTotalScores={props.setTotalScores}
            setGameOver={setGameOver}
          />
        )}
        <Scoreboard
          players={props.players}
          winNumber={props.winNumber}
          turnScores={props.turnScores}
          totalScores={props.totalScores}
          gameOver={gameOver}
        />
      </div>
    </Container>
  );
}

export default MainGamePage;
