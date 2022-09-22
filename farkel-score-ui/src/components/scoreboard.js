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

  // Taken from https://stackoverflow.com/a/5624139/3801865
  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  function getGradientStyle(color) {
    const rgb = hexToRgb(color);
    const rgbaColorString = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`;
    return `linear-gradient(to top, ${rgbaColorString}, ${rgbaColorString})`;
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
    }

    // At least one person is in, so calculate the leader(s) normally
    else {
      let max = Number.NEGATIVE_INFINITY;

      for (let index = 0; index < props.totalScores.length; index++) {
        if (props.totalScores[index] > max) {
          max = props.totalScores[index];
          leaderIndices = [index];
        } else if (props.totalScores[index] === max) {
          leaderIndices.push(index);
        }
      }
    }

    // Nobody is leading if everyone is tied
    if (leaderIndices.length === props.totalScores.length) {
      return [];
    }

    return leaderIndices;
  }

  return (
    <Table bordered>
      <colgroup>
        <col></col>
        {props.totalScores.map((score, index) => (
          <col
            key={index}
            className="scoreboard-col"
            style={{
              backgroundImage: getGradientStyle(props.playerColors[index]),
              backgroundSize: `100% ${(score / props.winNumber) * 100}%`,
            }}
          ></col>
        ))}
      </colgroup>
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
            {Array(props.players.length)
              .fill(0)
              .map((_, playerIndex) => (
                <ScoreCell
                  score={
                    Number.isInteger(oneTurnScores[playerIndex])
                      ? oneTurnScores[playerIndex]
                      : ""
                  }
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
            >
              <b>{score}</b>
            </td>
          ))}
        </tr>
      </tfoot>
    </Table>
  );
}

export default Scoreboard;
