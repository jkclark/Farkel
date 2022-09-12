import { useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";

import "./turnInput.css";

function TurnInput(props) {
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

      // End game if someone has won
      if (updatedTotalScores.some((score) => score >= props.winNumber)) {
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
    if (score !== props.turnScores[props.editingTurn][props.editingPlayer]) {
      const newTurnScores = [...props.turnScores];

      let endGameNow = false;
      // Check if game should end right now
      if (
        props.totalScores[props.editingPlayer] -
          props.turnScores[props.editingTurn][props.editingPlayer] +
          score >=
        props.winNumber
      ) {
        // End game now if this edit means a player won during a previous turn
        if (props.editingTurn < props.turnScores.length - 1) {
          newTurnScores.pop(); // Remove last turn (which shouldn't have been played)
          endGameNow = true;
        }
      }

      // Update turn scores
      newTurnScores[props.editingTurn][props.editingPlayer] =
        -1 * Math.abs(score);
      props.setTurnScores(newTurnScores);

      // Update total scores
      const updatedTotalScores = accumulateScores(newTurnScores);
      props.setTotalScores(updatedTotalScores);

      if (endGameNow) {
        endGame(updatedTotalScores);
      }
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

      return newTotalScores;
    }

    return props.totalScores;
  }

  function handleYesNoClick(score) {
    if (props.editingTurn !== null && props.editingPlayer !== null) {
      editTurnScore(score);
    } else {
      incrementCurrentPlayer(recordTurnScore(score));
    }
  }

  function handleScoreInput(event) {
    // NOTE: This line hides the "form submission canceled because the form is
    //       not connected" warning, which we don't care about.
    event.preventDefault();

    const scoreInput = document.getElementsByClassName("score-input")[0];
    const score = parseInt(scoreInput.value);

    // TODO: Handle this better in the UI
    if (isNaN(score)) {
      return;
    }

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

  function YesNoButtons(buttonProps) {
    return (
      <div className="yes-no-stack">
        <Button
          variant="success"
          onClick={() => {
            handleYesNoClick(-2);
          }}
          disabled={buttonProps.disabled}
        >
          Yes
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            handleYesNoClick(-1);
          }}
          disabled={buttonProps.disabled}
        >
          No
        </Button>
      </div>
    );
  }

  // TODO: Allow only numbers in text input
  // TODO: Don't allow empty input
  function ScoreInput(scoreInputProps) {
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
        <input
          type="text"
          className="form-control score-input"
          name="turn-score"
          ref={inputRef}
          disabled={scoreInputProps.disabled}
        ></input>
        <Button
          type="submit"
          onClick={handleScoreInput}
          disabled={scoreInputProps.disabled}
        >
          Enter
        </Button>
      </form>
    );
  }

  /*
  if (props.editingTurn !== null && props.editingPlayer !== null) {
    if (
      [-1, -2].includes(
        props.turnScores[props.editingTurn][props.editingPlayer]
      )
    ) {
      return <YesNoButtons />;
    }

    return <ScoreInput />;
  }
  */

  const playerIn = !(
    props.turnScores.length === 0 || // Nobody has played
    (props.turnScores.length === 1 && // Still everybody's first turn
      props.turnScores[0].length < props.players.length) || // Not in yet
    props.turnScores[props.turnScores.length - 2][props.currentPlayer] === -1
  );

  return (
    <div className="turn-input">
      <h3>{props.players[props.currentPlayer]}'s turn</h3>
      <div className="turn-result-inputs-stack">
        <YesNoButtons disabled={playerIn} />
        <ScoreInput disabled={!playerIn} />
      </div>
    </div>
  );
}

export default TurnInput;
