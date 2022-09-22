import Table from "react-bootstrap/Table";

import { GOT_IN, NOT_GOT_IN } from "../constants";
import crownIcon from "../img/crown.svg";

import "./scoreboard.css";

function Scoreboard(props) {
  const winHighlightClass = "table-primary";
  const checkMark = String.fromCodePoint("0x2705");
  const crossMark = String.fromCodePoint("0x274C");
  function ScoreCell(cellProps) {
    let textValue;
    if (cellProps.score === GOT_IN) {
      textValue = checkMark;
    } else if (cellProps.score === NOT_GOT_IN) {
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

  function getLeaderIndices() {
    // Return an array of all players' indexes who are in the lead

    // If no turns have happened, nobody is leading
    // If we haven't played a full turn yet, don't indicate any leader(s)
    if (
      !props.turnScores.length ||
      props.turnScores[0].length < props.players.length
    ) {
      return [];
    }

    let leaderIndices = [];

    // If nobody has a real score yet, anyone who is in is winning
    if (props.totalScores.every((score) => score === 0)) {
      // Find each player's most recent score. If they got in (or got 0), add them to the output.
      const in_scores = [0, GOT_IN];
      for (
        let playerIndex = 0;
        playerIndex < props.players.length;
        playerIndex++
      ) {
        // The most recent turn might not contain everyone's most recent score
        // If this player played this turn, use that score
        if (playerIndex < props.turnScores.at(-1).length) {
          if (in_scores.includes(props.turnScores.at(-1)[playerIndex])) {
            leaderIndices.push(playerIndex);
          }
          continue;
        }

        // Since this player doesn't have a score in the most recent turn, use last turn's score
        if (in_scores.includes(props.turnScores.at(-2)[playerIndex])) {
          leaderIndices.push(playerIndex);
        }
      }

      return leaderIndices;
    }

    // At least one person is in, so calculate the leader(s) normally
    let max = Number.NEGATIVE_INFINITY;

    for (let index = 0; index < props.totalScores.length; index++) {
      if (props.totalScores[index] > max) {
        max = props.totalScores[index];
        leaderIndices = [index];
      } else if (props.totalScores[index] === max) {
        leaderIndices.push(index);
      }
    }

    // Nobody is leading if everyone is tied
    if (leaderIndices.length === props.totalScores.length) {
      return [];
    }

    return leaderIndices;
  }

  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>Turn #</th>
          {props.players.map((player, index) => (
            <th
              key={player}
              className={
                "scoreboard-header-cell" +
                (shouldBeHighlighted(index) ? winHighlightClass : "")
              }
            >
              <span>{player}</span>
              {getLeaderIndices().includes(index) && (
                <img src={crownIcon} className="leader-icon" alt="Leader"></img>
              )}
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
