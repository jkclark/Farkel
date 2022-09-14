import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { CirclePicker } from "react-color";

import { DEFAULT_WIN_NUMBER } from "../constants";

import "./gameSetupPage.css";

/*
function OGGameSetupPage(props) {
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
    // TODO: Maximum number of players?

    // Add the first turn of scores to the list
    props.setTurnScores([[]]);

    // Set up total scores array
    props.setTotalScores(new Array(props.players.length).fill(0));

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
            defaultValue="10000"
          ></input>
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
*/

function WinNumberInput(props) {
  function checkWinNumberInput(event) {
    const winNumber = event.target.value;

    const allowedChars = [...Array(10).keys()].map((x) => x.toString());
    allowedChars.push(null);
    if (props.localWinNumber === "") {
      // If input is empty, do not allow 0
      allowedChars.shift();
    }

    if (allowedChars.includes(event.nativeEvent.data)) {
      props.setLocalWinNumber(winNumber);
    }
  }

  return (
    <div>
      <div className="win-number-input-stack">
        <label htmlFor="win-number-input">Points required to win: </label>
        <input
          type="text"
          className="form-control"
          name="win-number-input"
          value={props.localWinNumber}
          onInput={checkWinNumberInput}
        ></input>
      </div>
    </div>
  );
}

function GameSetupPage(props) {
  function PlayerEntry(playerEntryProps) {
    function deletePlayer() {
      // Copy lists
      const newPlayers = [...props.players];
      const newPlayerColors = [...props.playerColors];

      // Find index of player in props.players
      const index = props.players.indexOf(playerEntryProps.name);

      // Remove player and color from lists
      if (index > -1) {
        newPlayers.splice(index, 1);
        newPlayerColors.splice(index, 1);
      }

      // Set props
      props.setPlayers(newPlayers);
      props.setPlayerColors(newPlayerColors);
    }

    return (
      <div className="player-entry">
        <Button variant="danger" onClick={deletePlayer}>
          Delete
        </Button>
        <span>{playerEntryProps.name}</span>
        <span
          className="color-dot"
          style={{ backgroundColor: playerEntryProps.color }}
        ></span>
      </div>
    );
  }

  function PlayerList() {
    return (
      <div className="player-list">
        {props.players.map((player, index) => (
          <PlayerEntry
            name={player}
            key={index.toString()}
            color={props.playerColors[index] || "purple"}
          />
        ))}
      </div>
    );
  }

  function PlayerInput() {
    function checkPlayerNameInput() {
      const nameInput = document.getElementsByName("player-name-input")[0];
      const nameInputValue = nameInput.value;

      if (!nameInputValue || props.players.includes(nameInputValue)) {
        nameInput.classList.add("is-invalid");
        return false;
      }

      nameInput.classList.remove("is-invalid");

      return true;
    }

    function addPlayer() {
      const nameInput = document.getElementsByName("player-name-input")[0];
      props.setPlayers([...props.players, nameInput.value]);
      nameInput.value = "";
    }

    function handleAddPlayerClick() {
      if (checkPlayerNameInput()) {
        addPlayer();
      }
    }

    return (
      <div className="player-input-stack">
        <div className="title-and-input-stack">
          <h4>Players</h4>
          <input
            type="text"
            name="player-name-input"
            placeholder="Player name"
          ></input>
          <Button onClick={handleAddPlayerClick}>Add Player</Button>
        </div>
        <hr />
        <div className="player-list-and-color-stack">
          <PlayerList />
          <CirclePicker />
        </div>
      </div>
    );
  }

  function startGame() {
    // Add the first turn of scores to the list
    props.setTurnScores([[]]);

    // Set up total scores array
    props.setTotalScores(new Array(props.players.length).fill(0));

    console.log(document.getElementsByName("win-number-input")[0].value);

    // Save the points needed to win
    props.setWinNumber(
      parseInt(document.getElementsByName("win-number-input")[0].value) ||
        DEFAULT_WIN_NUMBER
    );

    // Hide/Show elements
    document.getElementById("game-setup").style.display = "none";
    document.getElementById("main-game-page").style.display = "flex";
  }

  const [localWinNumber, setLocalWinNumber] = useState(
    DEFAULT_WIN_NUMBER.toString()
  );

  return (
    <Container id="game-setup">
      <div id="game-setup-stack">
        <h1>Game Setup</h1>
        <WinNumberInput
          localWinNumber={localWinNumber}
          setLocalWinNumber={setLocalWinNumber}
        />
        <PlayerInput />
        <Button disabled={props.players.length <= 0} onClick={startGame}>
          Start
        </Button>
      </div>
    </Container>
  );
}

export default GameSetupPage;
