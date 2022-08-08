import Container from "react-bootstrap/Container";

import CumSumGraph from "./cumSumGraph";

import "./postGamePage.css";

function PostGamePage(props) {
  const colors = [
    "darkblue",
    "darkmagenta",
    "darkgoldenrod",
    "darkgreen",
    "darkorange",
    "darkred",
    "deeppink",
    "deepskyblue",
  ];

  return (
    <Container id="post-game-page">
      <CumSumGraph
        players={props.players}
        colors={colors.slice(0, props.players.length)}
        winNumber={props.winNumber}
        turnScores={props.turnScores}
      />
    </Container>
  );
}

export default PostGamePage;
