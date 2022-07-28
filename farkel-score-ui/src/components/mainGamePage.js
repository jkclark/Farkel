import Container from "react-bootstrap/Container";

import Scoreboard from "./scoreboard";

import "./mainGamePage.css";

function MainGamePage(props) {
  return (
    <Container id="main-game-page">
      <div id="main-game-page-stack">
        <Scoreboard players={props.players} turnScores={props.turnScores} />
      </div>
    </Container>
  );
}

export default MainGamePage;
