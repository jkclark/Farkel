import Container from "react-bootstrap/Container";

import CumSumGraph from "./cumSumGraph";
import PostGameStatTable from "./postGameStatTable";

import "./postGamePage.css";
import { ResponsiveContainer } from "recharts";

function PostGamePage(props) {
  return (
    <Container id="post-game-page">
      <ResponsiveContainer>
        <CumSumGraph
          players={props.players}
          colors={props.playerColors}
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
