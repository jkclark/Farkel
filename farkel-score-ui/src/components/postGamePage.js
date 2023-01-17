import Container from "react-bootstrap/Container";

import CumSumGraph from "./cumSumGraph";
import PostGameStatTable from "./postGameStatTable";

import "./postGamePage.css";
import { ResponsiveContainer } from "recharts";

function PostGamePage(props) {
  return (
    <Container id="post-game-page">
      {/* This ResponsiveContainer makes the legend appear in the right place.
         This produces an error, and I can't seem to figure out why.
         I'm just going to leave this here for now because it works.
     */}
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
