import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import "./playerEntry.css";

function PlayerEntry(props) {
  function checkPlayerInput(event) {
    if (event.nativeEvent.data === ",") {
      // Prevent duplicate names
      const nameWithoutComma = event.target.value.slice(0, -1);
      if (props.players.includes(nameWithoutComma)) {
        event.target.value = nameWithoutComma;
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

  return (
    <Container id="player-entry">
      <div id="player-entry-stack">
        <div>
          <label
            id="player-entry-label"
            className="form-label"
            htmlFor="player-names"
          >
            Enter player names:
          </label>
          <input
            type="text"
            className="form-control"
            name="player-names"
            onInput={checkPlayerInput}
            aria-describedby="player-entry-help-text"
          ></input>
          <div id="player-entry-help-text" className="form-text">
            Comma separated
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
        <Button disabled={props.players.length <= 0}>Start</Button>
      </div>
    </Container>
  );
}

export default PlayerEntry;
