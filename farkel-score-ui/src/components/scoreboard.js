import Table from "react-bootstrap/Table";

function Scoreboard(props) {
  function accumulateScores() {
    if (props.turnScores.length === 0 || props.turnScores[0].length === 0) {
      return [];
    }

    const totals = new Array(props.players.length).fill(0);
    if (props.turnScores.length > 1) {
      // Start at index 1 because you cannot accumulate score on turn 0
      props.turnScores.slice(1).forEach((oneTurnScores) => {
        oneTurnScores.forEach((score, playerIndex) => {
          // Don't count -1 or -2 (or 0)
          if (score > 0) {
            totals[playerIndex] += score;
          }
        });
      });
    }

    return totals;
  }

  const checkMark = String.fromCodePoint("0x2705");
  const crossMark = String.fromCodePoint("0x274C");
  function ScoreCell(props) {
    if (props.score === -2) {
      return <td>{checkMark}</td>;
    }

    if (props.score === -1) {
      return <td>{crossMark}</td>;
    }

    return <td>{props.score}</td>;
  }

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
              <ScoreCell score={score} key={index} />
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
