import Container from "react-bootstrap/Container";

import CumSumGraph from "./cumSumGraph";
import PostGameStatTable from "./postGameStatTable";

import "./postGamePage.css";
import { ResponsiveContainer } from "recharts";

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
      <ResponsiveContainer>
        <CumSumGraph
          players={props.players}
          colors={colors.slice(0, props.players.length)}
          winNumber={props.winNumber}
          turnScores={props.turnScores}
        />
      </ResponsiveContainer>
      <PostGameStatTable
        players={props.players}
        turnScores={props.turnScores}
        totalScores={props.totalScores}
      />
    </Container>
  );
}

export default PostGamePage;
