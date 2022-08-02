import { useState } from "react";
import Container from "react-bootstrap/Container";

import Scoreboard from "./scoreboard";
import TurnInput from "./turnInput";

import "./mainGamePage.css";

function MainGamePage(props) {
  const [gameWinner, setGameWinner] = useState(-1);

  return (
    <Container id="main-game-page">
      <div id="main-game-page-stack">
        {gameWinner !== -1 && <h4>{props.players[gameWinner]} wins!</h4>}
        <h4>Points to win: {props.winNumber}</h4>
        {gameWinner === -1 && (
          <TurnInput
            players={props.players}
            winNumber={props.winNumber}
            turnScores={props.turnScores}
            setTurnScores={props.setTurnScores}
            currentPlayer={props.currentPlayer}
            setCurrentPlayer={props.setCurrentPlayer}
            totalScores={props.totalScores}
            setTotalScores={props.setTotalScores}
            gameWinner={gameWinner}
            setGameWinner={setGameWinner}
          />
        )}
        <Scoreboard
          players={props.players}
          winNumber={props.winNumber}
          turnScores={props.turnScores}
          totalScores={props.totalScores}
          gameWinner={gameWinner}
        />
      </div>
    </Container>
  );
}

export default MainGamePage;
