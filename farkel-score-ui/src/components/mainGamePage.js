import Container from "react-bootstrap/Container";

import Scoreboard from "./scoreboard";
import TurnInput from "./turnInput";

import "./mainGamePage.css";

function MainGamePage(props) {
  return (
    <Container id="main-game-page">
      <div id="main-game-page-stack">
        <h4>Points to win: {props.winNumber}</h4>
        <TurnInput
          players={props.players}
          currentPlayer={props.currentPlayer}
          setCurrentPlayer={props.setCurrentPlayer}
          turnScores={props.turnScores}
          setTurnScores={props.setTurnScores}
        />
        <Scoreboard players={props.players} turnScores={props.turnScores} />
      </div>
    </Container>
  );
}

export default MainGamePage;
