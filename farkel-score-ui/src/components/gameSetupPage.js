import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import { DEFAULT_WIN_NUMBER } from "../constants";

import "./gameSetupPage.css";

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

function PlayerEntry(props) {
  function deletePlayer() {
    // Copy lists
    const newPlayers = [...props.players];
    const newPlayerColors = [...props.playerColors];

    // Find index of player in props.players
    const index = props.players.indexOf(props.name);

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
      <span>{props.name}</span>
      <span
        className="color-dot"
        style={{ backgroundColor: props.color }}
      ></span>
    </div>
  );
}

function PlayerList(props) {
  return (
    <div className="player-list">
      {props.players.map((player, index) => (
        <PlayerEntry
          name={player}
          key={index.toString()}
          color={props.playerColors[index]}
          players={props.players}
          playerColors={props.playerColors}
          setPlayers={props.setPlayers}
          setPlayerColors={props.setPlayerColors}
        />
      ))}
    </div>
  );
}

function PlayerInput(props) {
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
    props.setPlayerColors([...props.playerColors, "#ddd"]);
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
        <PlayerList
          players={props.players}
          playerColors={props.playerColors}
          setPlayers={props.setPlayers}
          setPlayerColors={props.setPlayerColors}
        />
      </div>
    </div>
  );
}

function GameSetupPage(props) {
  const [localWinNumber, setLocalWinNumber] = useState(
    DEFAULT_WIN_NUMBER.toString()
  );

  function startGame() {
    // Add the first turn of scores to the list
    props.setTurnScores([[]]);

    // Set up total scores array
    props.setTotalScores(new Array(props.players.length).fill(0));

    // Save the points needed to win
    props.setWinNumber(
      parseInt(document.getElementsByName("win-number-input")[0].value) ||
        DEFAULT_WIN_NUMBER
    );

    // Hide/Show elements
    document.getElementById("game-setup").style.display = "none";
    document.getElementById("main-game-page").style.display = "flex";
  }

  return (
    <Container id="game-setup">
      <div id="game-setup-stack">
        <h1>Game Setup</h1>
        <WinNumberInput
          localWinNumber={localWinNumber}
          setLocalWinNumber={setLocalWinNumber}
        />
        <PlayerInput
          players={props.players}
          playerColors={props.playerColors}
          setPlayers={props.setPlayers}
          setPlayerColors={props.setPlayerColors}
        />
        <Button disabled={props.players.length <= 0} onClick={startGame}>
          Start
        </Button>
      </div>
    </Container>
  );
}

export default GameSetupPage;
