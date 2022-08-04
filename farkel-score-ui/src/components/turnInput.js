import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";

import "./turnInput.css";

function TurnInput(props) {
  const [gameToEnd, setGameToEnd] = useState(false);

  function getGameWinner(scores) {
    const winner = scores.indexOf(Math.max(...scores));
    return winner;
  }

  function endGame(scores) {
    props.setGameWinner(getGameWinner(scores));
  }

  function incrementCurrentPlayer(updatedTotalScores) {
    if (props.currentPlayer === props.players.length - 1) {
      // Loop back around to the first player
      props.setCurrentPlayer(0);

      if (gameToEnd) {
        // Passing scores here is required because the update to props.totalScores
        // (in recordTurnScore) hasn't necessarily gone through yet for the last person's turn.
        endGame(updatedTotalScores);
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

  function scoreShouldCount(score) {
    return score !== -1 && score !== -2;
  }

  function accumulateScores(scores) {
    const totalScores = new Array(props.players.length).fill(0);
    scores.forEach((turnScores, turnIndex) => {
      turnScores.forEach((score, playerIndex) => {
        if (scoreShouldCount(score)) {
          totalScores[playerIndex] += Math.abs(score);
        }
      });
    });

    return totalScores;
  }

  function editTurnScore(score) {
    const newTurnScores = [...props.turnScores];

    let endGameNow = false;
    // Check if game should end (either now or end of turn)
    if (
      props.totalScores[props.editingPlayer] -
        props.turnScores[props.editingTurn][props.editingPlayer] +
        score >=
      props.winNumber
    ) {
      setGameToEnd(true);

      // End game now if this edit has resulted in a winner
      if (props.editingTurn < props.turnScores.length - 1) {
        newTurnScores.pop(); // Remove last turn (which shouldn't have been played)
        endGameNow = true;
      }
    }

    // Update turn scores
    newTurnScores[props.editingTurn][props.editingPlayer] = -1 * score;
    props.setTurnScores(newTurnScores);

    // Update total scores
    const updatedTotalScores = accumulateScores(newTurnScores);
    props.setTotalScores(updatedTotalScores);

    if (endGameNow) {
      endGame(updatedTotalScores);
    }

    // Reset editing turn and player
    props.setEditingTurn(null);
    props.setEditingPlayer(null);
  }

  function recordTurnScore(score) {
    // Entering a new score
    const newTurnScores = [...props.turnScores];
    newTurnScores[newTurnScores.length - 1].push(score);
    props.setTurnScores(newTurnScores);

    if (scoreShouldCount(score)) {
      const newTotalScores = [...props.totalScores];
      newTotalScores[props.currentPlayer] += Math.abs(score);
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
    // TODO: What to do about negative numbers? Prevent them somehow...
    if (props.editingTurn !== null && props.editingPlayer !== null) {
      editTurnScore(score);
    } else {
      incrementCurrentPlayer(recordTurnScore(score));
    }

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

    // If a cell is clicked on, set the input's value to that turn/player's score
    useEffect(() => {
      if (props.editingTurn !== null && props.editingPlayer !== null) {
        inputRef.current.value = Math.abs(
          props.turnScores[props.editingTurn][props.editingPlayer]
        );
      } else {
        inputRef.current.value = "";
      }
    });

    return (
      <form action="" className="score-input-stack">
        <label className="turn-score-input-label" htmlFor="turn-score">
          {"Enter "}
          <b>
            {props.players[props.editingPlayer || props.currentPlayer]}'s
          </b>{" "}
          score:
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
