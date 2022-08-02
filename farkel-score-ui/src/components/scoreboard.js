import Table from "react-bootstrap/Table";

function Scoreboard(props) {
  const highlightClass = "table-primary";
  const checkMark = String.fromCodePoint("0x2705");
  const crossMark = String.fromCodePoint("0x274C");
  function ScoreCell(props) {
    let textValue;
    if (props.score === -2) {
      textValue = checkMark;
    } else if (props.score === -1) {
      textValue = crossMark;
    } else {
      textValue = props.score;
    }

    return (
      <td className={props.highlighted ? highlightClass : ""}>{textValue}</td>
    );
  }

  function shouldBeHighlighted(index) {
    return props.gameWinner !== -1 && props.gameWinner === index;
  }

  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>Turn #</th>
          {props.players.map((player, index) => (
            <th
              key={player}
              className={shouldBeHighlighted(index) ? highlightClass : ""}
            >
              {player}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.turnScores.map((oneTurnScores, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            {oneTurnScores.map((score, playerIndex) => (
              <ScoreCell
                score={score}
                key={playerIndex}
                highlighted={shouldBeHighlighted(playerIndex)}
              />
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td>
            <b>Total</b>
          </td>
          {props.totalScores.map((score, index) => (
            <td
              key={index}
              className={shouldBeHighlighted(index) ? highlightClass : ""}
            >
              <b>{score}</b> ({score > props.winNumber ? "+" : "-"}
              {Math.abs(props.winNumber - score)})
            </td>
          ))}
        </tr>
      </tfoot>
    </Table>
  );
}

export default Scoreboard;
