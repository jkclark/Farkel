import Container from "react-bootstrap/Container";

import Scoreboard from "./scoreboard";

import "./mainGamePage.css";

function MainGamePage(props) {
  return (
    <Container id="main-game-page">
      <Scoreboard players={props.players} />
    </Container>
  );
}

export default MainGamePage;
