import { cloneNode } from "@babel/types";
import Table from "react-bootstrap/Table";

function Scoreboard(props) {
  function accumulateScores() {
    if (props.turnScores.length === 0 || props.turnScores[0].length === 0) {
      return [];
    }

    const totals = [...props.turnScores[0]];
    if (props.turnScores.length > 1) {
      props.turnScores.slice(1).forEach((oneTurnScores) => {
        oneTurnScores.forEach((score, playerIndex) => {
          totals[playerIndex] += score;
        });
      });
    }

    return totals;
  }

  const cumulativeScores = [];
  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>Turn #</th>
          {props.players.map((player) => (
            <th key={player}>{player}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.turnScores.map((oneTurnScores, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            {oneTurnScores.map((score, index) => (
              <td key={index}>{score}</td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td>Total</td>
          {accumulateScores().map((score, index) => (
            <td key={index}>{score}</td>
          ))}
        </tr>
      </tfoot>
    </Table>
  );
}

export default Scoreboard;
