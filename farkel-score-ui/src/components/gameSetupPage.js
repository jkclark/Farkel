import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

import { DEFAULT_WIN_NUMBER, INITIAL_COLORS, MAX_PLAYERS } from "../constants";
import deleteIcon from "../img/x.svg";
import ColorPicker, { RandomizeColorsButton } from "./colorPicker";

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
    const newDisabledColors = [...props.disabledColors];

    // Find index of player in props.players
    const index = props.players.indexOf(props.name);

    if (index > -1) {
      // Enable color in disabled-color list
      newDisabledColors[INITIAL_COLORS.indexOf(newPlayerColors[index])] = false;

      // Remove player from player list
      newPlayers.splice(index, 1);

      // Remove color from player-color list
      newPlayerColors.splice(index, 1);
    }

    // Set props
    props.setPlayers(newPlayers);
    props.setPlayerColors(newPlayerColors);
    props.setDisabledColors(newDisabledColors);
  }

  return (
    <tr>
      <td>
        <img
          src={deleteIcon}
          className="delete-icon"
          onClick={deletePlayer}
          alt="Delete"
        ></img>
      </td>
      <td>{props.name}</td>
      <td>
        <div
          className="color-dot"
          style={{ backgroundColor: props.color }}
          onClick={() => {
            props.setCurrentPlayerColorIndex(props.index);
          }}
        ></div>
      </td>
    </tr>
  );
}

function PlayerList(props) {
  return (
    <Table borderless className="player-input-table">
      <colgroup>
        <col span="1" className="player-input-table-delete-col"></col>
        <col span="1"></col>
        <col span="1"></col>
      </colgroup>
      <thead>
        <tr>
          <th></th>
          <th>Player</th>
          <th>
            Color
            <RandomizeColorsButton
              disabledColors={props.disabledColors}
              playerColors={props.playerColors}
              setDisabledColors={props.setDisabledColors}
              setPlayerColors={props.setPlayerColors}
            />
          </th>
        </tr>
      </thead>
      <tbody>
        {props.players.map((player, index) => (
          <PlayerEntry
            disabledColors={props.disabledColors}
            name={player}
            index={index}
            key={index.toString()}
            color={props.playerColors[index]}
            players={props.players}
            playerColors={props.playerColors}
            setCurrentPlayerColorIndex={props.setCurrentPlayerColorIndex}
            setDisabledColors={props.setDisabledColors}
            setPlayers={props.setPlayers}
            setPlayerColors={props.setPlayerColors}
          />
        ))}
      </tbody>
    </Table>
  );
}

function PlayerInput(props) {
  const [currentPlayerColorIndex, setCurrentPlayerColorIndex] = useState(null);
  const [disabledColors, setDisabledColors] = useState(
    Array(INITIAL_COLORS.length).fill(false)
  );

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

  function handleAddPlayerClick(event) {
    event.preventDefault(); // Page refreshes if we don't do this

    if (props.players.length < MAX_PLAYERS && checkPlayerNameInput()) {
      addPlayer();
    }
  }

  return (
    <div className="player-input-stack">
      <div className="player-input-header">
        <form action="" className="player-name-input-stack">
          <input
            type="text"
            className="form-control"
            name="player-name-input"
            placeholder="Player name"
          ></input>
          <Button type="submit" onClick={handleAddPlayerClick}>
            Add Player
          </Button>
        </form>
      </div>
      <div className="player-input-body"></div>
      <PlayerList
        disabledColors={disabledColors}
        players={props.players}
        playerColors={props.playerColors}
        setCurrentPlayerColorIndex={setCurrentPlayerColorIndex}
        setDisabledColors={setDisabledColors}
        setPlayers={props.setPlayers}
        setPlayerColors={props.setPlayerColors}
      />
      <ColorPicker
        currentPlayerColorIndex={currentPlayerColorIndex}
        disabledColors={disabledColors}
        playerColors={props.playerColors}
        setDisabledColors={setDisabledColors}
        setPlayerColors={props.setPlayerColors}
      />
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

    // TODO: Set player colors if any are still default

    // Hide/Show elements
    document.getElementById("game-setup").style.display = "none";
    document.getElementById("main-game-page").style.display = "flex";
  }

  return (
    <Container id="game-setup">
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
    </Container>
  );
}

export default GameSetupPage;
