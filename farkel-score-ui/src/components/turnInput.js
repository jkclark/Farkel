import Button from "react-bootstrap/Button";

import "./turnInput.css";

function TurnInput(props) {
  function incrementCurrentPlayer() {
    if (props.currentPlayer === props.players.length - 1) {
      // Loop back around to the first player
      props.setCurrentPlayer(0);

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
  }

  function handleYesClick() {
    recordTurnScore(0);
    incrementCurrentPlayer();
  }

  function handleNoClick() {
    recordTurnScore(-1);
    incrementCurrentPlayer();
  }

  function handleScoreInput() {
    const score = parseInt(
      document.getElementsByClassName("score-input")[0].value
    );
    recordTurnScore(score);
    incrementCurrentPlayer();
  }

  function YesNoButtons() {
    return (
      <div className="yes-no-stack">
        <div>Did *player* get in?</div>
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
  function ScoreInput() {
    return (
      <div className="score-input-stack">
        <label className="turn-score-input-label" htmlFor="turn-score">
          Enter *player*'s score:
        </label>
        <input
          type="text"
          className="form-control score-input"
          pattern="[0-9]"
          name="turn-score"
        ></input>
        <Button onClick={handleScoreInput}>Enter</Button>
      </div>
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
