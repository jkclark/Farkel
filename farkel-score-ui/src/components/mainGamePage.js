import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import Scoreboard from "./scoreboard";
import TurnInput from "./turnInput";

import "./mainGamePage.css";

// TODO: Throughout scoreboard.js and turnInput.js, we use -1 and -2 to indicate
//       a "got in"/"did not get in" turn. Instead of using magic numbers, we should
//       define constants for them and use them everywhere.
function MainGamePage(props) {
  const [gameWinner, setGameWinner] = useState(-1);

  // TODO: Considering coupling these two values together, we are always modifying
  //       them in tandem.
  const [editingTurn, setEditingTurn] = useState(null);
  const [editingPlayer, setEditingPlayer] = useState(null);

  function goToPostGame() {
    document.getElementById("main-game-page").style.display = "none";
    document.getElementById("post-game-page").style.display = "flex";
  }

  return (
    <Container id="main-game-page">
      <div id="main-game-page-stack">
        {gameWinner !== -1 && <Button onClick={goToPostGame}>See stats</Button>}
        {gameWinner !== -1 && <h4>{props.players[gameWinner]} wins!</h4>}
        <h4>Points to win: {props.winNumber.toLocaleString()}</h4>
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
            editingTurn={editingTurn}
            setEditingTurn={setEditingTurn}
            editingPlayer={editingPlayer}
            setEditingPlayer={setEditingPlayer}
            gameWinner={gameWinner}
            setGameWinner={setGameWinner}
          />
        )}
        <div style={{ display: "flex" }}>
          <Scoreboard
            players={props.players}
            winNumber={props.winNumber}
            turnScores={props.turnScores}
            totalScores={props.totalScores}
            editingTurn={editingTurn}
            setEditingTurn={setEditingTurn}
            editingPlayer={editingPlayer}
            setEditingPlayer={setEditingPlayer}
            gameWinner={gameWinner}
          />
        </div>
      </div>
    </Container>
  );
}

export default MainGamePage;
