import Table from "react-bootstrap/Table";

function Scoreboard(props) {
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
          {props.totalScores.map((score, index) => (
            <td key={index}>{score}</td>
          ))}
        </tr>
      </tfoot>
    </Table>
  );
}

export default Scoreboard;
