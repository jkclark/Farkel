import Container from "react-bootstrap/Container";

import CumSumGraph from "./cumSumGraph";

import "./postGamePage.css";

function PostGamePage(props) {
  return (
    <Container id="post-game-page">
      <CumSumGraph
        players={props.players}
        winNumber={props.winNumber}
        turnScores={props.turnScores}
      />
    </Container>
  );
}

export default PostGamePage;
