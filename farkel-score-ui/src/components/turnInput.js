import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";

import "./turnInput.css";

function TurnInput(props) {
  const [gameToEnd, setGameToEnd] = useState(false);

  function getGameWinner(scores) {
    const winner = scores.indexOf(Math.max(...scores));
    return winner;
  }

  function incrementCurrentPlayer(updatedTotalScores) {
    if (props.currentPlayer === props.players.length - 1) {
      // Loop back around to the first player
      props.setCurrentPlayer(0);

      if (gameToEnd) {
        // Passing scores here is required because the update to props.totalScores
        // (in recordTurnScore) hasn't necessarily gone through yet for the last person's turn.
        props.setGameWinner(getGameWinner(updatedTotalScores));
        return;
      }

      // Add a new (empty) turn of scores to the list
      const newTurnScores = [...props.turnScores];
      newTurnScores.push([]);
      props.setTurnScores(newTurnScores);
    } else {
      props.setCurrentPlayer(props.currentPlayer + 1);
    }
  }

  function recordTurnScore(score) {
    const newTurnScores = [...props.turnScores];
    newTurnScores[newTurnScores.length - 1].push(score);
    props.setTurnScores(newTurnScores);

    if (score > 0) {
      const newTotalScores = [...props.totalScores];
      newTotalScores[props.currentPlayer] += score;
      props.setTotalScores(newTotalScores);

      if (newTotalScores[props.currentPlayer] >= props.winNumber) {
        setGameToEnd(true);
      }

      return newTotalScores;
    }

    return props.totalScores;
  }

  function handleYesClick() {
    recordTurnScore(-2);
    incrementCurrentPlayer();
  }

  function handleNoClick() {
    recordTurnScore(-1);
    incrementCurrentPlayer();
  }

  function handleScoreInput(event) {
    // NOTE: This line hides the "form submission canceled because the form is
    //       not connected" warning, which we don't care about.
    event.preventDefault();

    const scoreInput = document.getElementsByClassName("score-input")[0];
    const score = parseInt(scoreInput.value);
    const totalScores = recordTurnScore(score);
    incrementCurrentPlayer(totalScores);

    if (props.gameWinner === -1) {
      scoreInput.focus();
    }
  }

  function YesNoButtons() {
    return (
      <div className="yes-no-stack">
        <div>
          Did <b>{props.players[props.currentPlayer]}</b> get in?
        </div>
        <Button variant="success" onClick={handleYesClick}>
          Yes
        </Button>
        <Button variant="danger" onClick={handleNoClick}>
          No
        </Button>
      </div>
    );
  }

  // TODO: Allow only numbers in text input
  // TODO: Don't allow empty input
  function ScoreInput() {
    const inputRef = useRef(null);

    // Give this element focus when it is rendered
    useEffect(() => {
      inputRef.current.focus();
    });

    return (
      <form action="" className="score-input-stack">
        <label className="turn-score-input-label" htmlFor="turn-score">
          Enter <b>{props.players[props.currentPlayer]}'s</b> score:
        </label>
        <input
          type="text"
          className="form-control score-input"
          pattern="[0-9]"
          name="turn-score"
          ref={inputRef}
        ></input>
        <Button type="submit" onClick={handleScoreInput}>
          Enter
        </Button>
      </form>
    );
  }

  // If player is not in yet, show buttons
  if (
    props.turnScores.length === 0 || // Nobody has played
    (props.turnScores.length === 1 && // Still everybody's first turn
      props.turnScores[0].length < props.players.length) ||
    props.turnScores[props.turnScores.length - 2][props.currentPlayer] === -1 // Not in yet
  ) {
    return <YesNoButtons />;
  } else {
    return <ScoreInput />;
  }
}

export default TurnInput;
