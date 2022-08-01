import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import "./gameSetup.css";

// TODO: Ask for number being played to
function GameSetup(props) {
  function checkPlayerInput(event) {
    if (event.nativeEvent.data === ",") {
      // Prevent duplicate names
      const nameWithoutComma = event.target.value.slice(0, -1);
      event.target.value = nameWithoutComma;

      if (!nameWithoutComma || props.players.includes(nameWithoutComma)) {
        event.target.classList.add("is-invalid");
        return;
      }

      event.target.classList.remove("is-invalid");

      props.setPlayers([...props.players, nameWithoutComma]);
      event.target.value = "";
    }
  }

  function removePlayer(player) {
    const newPlayers = [...props.players];
    const index = newPlayers.indexOf(player);
    if (index > -1) {
      newPlayers.splice(index, 1);
      props.setPlayers(newPlayers);
    }
  }

  const [winNumberIsValid, setWinNumberIsValid] = useState(true);
  function checkWinNumberInput() {
    const winNumberInput = document.getElementById("win-number-input");
    const winNumber = parseInt(winNumberInput.value);
    if (winNumberInput.value !== "" && (isNaN(winNumber) || winNumber <= 0)) {
      winNumberInput.classList.add("is-invalid");
      setWinNumberIsValid(false);
    } else {
      winNumberInput.classList.remove("is-invalid");
      setWinNumberIsValid(true);
    }
  }

  function startGame() {
    // Add the first turn of scores to the list
    props.setTurnScores([[]]);

    // Save the points needed to win
    if (document.getElementById("win-number-input").value !== "") {
      props.setWinNumber(
        parseInt(document.getElementById("win-number-input").value)
      );
    }

    document.getElementById("game-setup").style.display = "none";
    document.getElementById("main-game-page").style.display = "flex";
  }

  return (
    <Container id="game-setup">
      <div id="game-setup-stack">
        <div>
          <label
            id="player-input-label"
            className="form-label"
            htmlFor="player-names-input"
          >
            Enter player names (in play order):
          </label>
          <input
            type="text"
            className="form-control"
            name="player-names-input"
            onInput={checkPlayerInput}
            aria-describedby="player-input-help-text"
          ></input>
          <div id="player-input-help-text" className="form-text">
            Enter a comma to save player
          </div>
        </div>
        <div id="player-tags">
          {props.players.map((player, index) => (
            <Button
              className="player-tag"
              variant="secondary"
              key={index.toString()}
              onClick={() => removePlayer(player)}
              title="Remove player"
            >
              {player}
            </Button>
          ))}
        </div>
        <div>
          <label
            id="win-number-input-label"
            className="form-label"
            htmlFor="win-number-input"
          >
            Enter points needed to win:
          </label>
          <input
            id="win-number-input"
            type="text"
            className="form-control"
            name="win-number-input"
            onInput={checkWinNumberInput}
            aria-describedby="win-number-input-help-text"
          ></input>
          <div id="win-number-input-help-text" className="form-text">
            Leave blank for 10,000
          </div>
        </div>
        <Button
          disabled={props.players.length <= 0 || !winNumberIsValid}
          onClick={startGame}
        >
          Start
        </Button>
      </div>
    </Container>
  );
}

export default GameSetup;
