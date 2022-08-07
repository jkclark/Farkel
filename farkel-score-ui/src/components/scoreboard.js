import Table from "react-bootstrap/Table";

import "./scoreboard.css";

function Scoreboard(props) {
  const winHighlightClass = "table-primary";
  const checkMark = String.fromCodePoint("0x2705");
  const crossMark = String.fromCodePoint("0x274C");
  function ScoreCell(cellProps) {
    let textValue;
    if (cellProps.score === -2) {
      textValue = checkMark;
    } else if (cellProps.score === -1) {
      textValue = crossMark;
    } else if (cellProps.score < -2) {
      // Negative score indicates edited value
      textValue = "*" + -1 * cellProps.score;
    } else {
      textValue = cellProps.score;
    }

    function handleClick() {
      if (props.gameWinner === -1) {
        props.setEditingTurn(cellProps.turnIndex);
        props.setEditingPlayer(cellProps.playerIndex);
      }
    }

    let highlightClass;
    if (shouldBeHighlighted(cellProps.playerIndex)) {
      highlightClass = winHighlightClass;
    } else if (
      props.editingTurn === cellProps.turnIndex &&
      props.editingPlayer === cellProps.playerIndex
    ) {
      highlightClass = "editing-cell";
    } else {
      highlightClass = "";
    }

    return (
      <td className={"score-cell " + highlightClass} onClick={handleClick}>
        {textValue}
      </td>
    );
  }

  function shouldBeHighlighted(index) {
    return props.gameWinner !== -1 && props.gameWinner === index;
  }

  function getGradientStyle(score) {
    const scorePercentage = (score * 100) / props.winNumber;
    return (
      "linear-gradient(to right, rgba(0, 0, 0, 0.25) " +
      scorePercentage +
      "%, white " +
      scorePercentage +
      "%)"
    );
  }

  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>Turn #</th>
          {props.players.map((player, index) => (
            <th
              key={player}
              className={shouldBeHighlighted(index) ? winHighlightClass : ""}
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
                turnIndex={index}
                playerIndex={playerIndex}
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
              className={shouldBeHighlighted(index) ? winHighlightClass : ""}
              // Only show gradient for non-winners
              style={
                props.gameWinner === index
                  ? {}
                  : { background: getGradientStyle(score) }
              }
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
