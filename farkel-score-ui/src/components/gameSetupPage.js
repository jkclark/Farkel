import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

import { DEFAULT_WIN_NUMBER, INITIAL_COLORS, MAX_PLAYERS } from "../constants";
import deleteIcon from "../img/x.svg";
import ColorPicker, { RandomizeColorsButton } from "./colorPicker";

import "./gameSetupPage.css";

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

  if (props.index >= props.players.length) {
    return (
      <tr className="player-entry">
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );
  }

  return (
    <tr className="player-entry">
      <td>
        <img
          src={deleteIcon}
          className="delete-icon"
          onClick={deletePlayer}
          alt="Delete"
          title="Remove player"
        ></img>
      </td>
      <td>{props.name}</td>
      <td>
        <div
          className="color-dot"
          style={{ backgroundColor: props.color }}
          // TODO: I think this makes this feature unusable on mobile
          onMouseOver={() => {
            props.setCurrentPlayerColorIndex(props.index);
          }}
        >
          <div className="color-picker-hover-gap">
            <ColorPicker
              currentPlayerColorIndex={props.currentPlayerColorIndex}
              disabledColors={props.disabledColors}
              playerColors={props.playerColors}
              setDisabledColors={props.setDisabledColors}
              setPlayerColors={props.setPlayerColors}
            />
          </div>
        </div>
      </td>
    </tr>
  );
}

function PlayerList(props) {
  const [currentPlayerColorIndex, setCurrentPlayerColorIndex] = useState(null);

  return (
    <Table className="player-list-table">
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
            <span className="player-input-table-color-col-header-text">
              Color
            </span>
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
        {Array(MAX_PLAYERS)
          .fill(null)
          .map((_, index) => (
            <PlayerEntry
              currentPlayerColorIndex={currentPlayerColorIndex}
              disabledColors={props.disabledColors}
              name={props.players[index]}
              index={index}
              key={index.toString()}
              color={props.playerColors[index]}
              players={props.players}
              playerColors={props.playerColors}
              setCurrentPlayerColorIndex={setCurrentPlayerColorIndex}
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

    // Give player a color
    const newDisabledColors = [...disabledColors];
    const newPlayerColorIndex = newDisabledColors.indexOf(false);
    newDisabledColors[newPlayerColorIndex] = true;

    // Set props
    props.setPlayers([...props.players, nameInput.value]);
    props.setPlayerColors([
      ...props.playerColors,
      INITIAL_COLORS[newPlayerColorIndex],
    ]);
    setDisabledColors(newDisabledColors);

    nameInput.value = "";
  }

  function handleAddPlayerClick(event) {
    event.preventDefault(); // Page refreshes if we don't do this

    if (props.players.length < MAX_PLAYERS && checkPlayerNameInput()) {
      addPlayer();
    }
  }

  return (
    <>
      <form action="" className="player-name-input-stack">
        <input
          type="text"
          className="form-control player-name-input"
          name="player-name-input"
          placeholder="Player name"
        ></input>
        <Button
          type="submit"
          disabled={props.players.length >= MAX_PLAYERS}
          onClick={handleAddPlayerClick}
        >
          Add Player
        </Button>
      </form>
      <div className="player-input-body">
        <PlayerList
          disabledColors={disabledColors}
          players={props.players}
          playerColors={props.playerColors}
          setDisabledColors={setDisabledColors}
          setPlayers={props.setPlayers}
          setPlayerColors={props.setPlayerColors}
        />
      </div>
    </>
  );
}

function WinNumberInput(props) {
  function checkWinNumberInput(event) {
    // Get rid of the commas inserted by toLocaleString
    const winNumber = event.target.value.replaceAll(",", "");

    const allowedChars = [...Array(10).keys()].map((x) => x.toString());
    allowedChars.push(null);
    if (props.localWinNumber === "") {
      // If input is empty, do not allow 0
      allowedChars.shift();
    }

    if (allowedChars.includes(event.nativeEvent.data)) {
      props.setLocalWinNumber(
        winNumber === "" ? "" : parseInt(winNumber).toLocaleString("en")
      );
    }
  }

  return (
    <div className="win-number-input-stack">
      <label htmlFor="win-number-input">Points required to win: </label>
      <input
        type="text"
        className="form-control"
        name="win-number-input"
        value={props.localWinNumber}
        onInput={checkWinNumberInput}
        placeholder={DEFAULT_WIN_NUMBER.toLocaleString("en")}
      ></input>
    </div>
  );
}

function GameSetupPage(props) {
  // This variable is a string
  const [localWinNumber, setLocalWinNumber] = useState("");

  function startGame() {
    // Add the first turn of scores to the list
    props.setTurnScores([[]]);

    // Set up total scores array
    props.setTotalScores(new Array(props.players.length).fill(0));

    // Save the points needed to win
    props.setWinNumber(
      parseInt(
        document
          .getElementsByName("win-number-input")[0]
          .value.replaceAll(",", "")
      ) || DEFAULT_WIN_NUMBER
    );

    // TODO: Set player colors if any are still default

    // Hide/Show elements
    document.getElementById("game-setup").style.display = "none";
    document.getElementById("main-game-page").style.display = "flex";
  }

  return (
    <Container id="game-setup">
      <h1>Game Setup</h1>
      <PlayerInput
        players={props.players}
        playerColors={props.playerColors}
        setPlayers={props.setPlayers}
        setPlayerColors={props.setPlayerColors}
      />
      <div className="game-setup-footer">
        <WinNumberInput
          localWinNumber={localWinNumber}
          setLocalWinNumber={setLocalWinNumber}
        />
        <Button
          className="start-button"
          variant="success"
          disabled={props.players.length <= 0}
          onClick={startGame}
        >
          Start
        </Button>
      </div>
    </Container>
  );
}

export default GameSetupPage;
