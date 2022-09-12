import Table from "react-bootstrap/Table";

function PostGameStatTable(props) {
  function formatValue(value) {
    if (typeof value === "number") {
      return new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(
        value
      );
    }

    return value;
  }

  function getPlayerTurnScores(playerIndex, turnScores) {
    const playerScores = [];
    turnScores.forEach((scores) => {
      if (playerIndex < scores.length) {
        playerScores.push(scores[playerIndex]);
      }
    });

    return playerScores;
  }

  function getTurnsToGetIn(playerTurnScores) {
    if (playerTurnScores.length === 0) {
      return 0;
    }

    let turnsToGetIn = 0;
    let turn = 0;
    while (turn < playerTurnScores.length && playerTurnScores[turn] < 0) {
      turnsToGetIn += 1;
      turn += 1;
    }

    return turnsToGetIn;
  }

  function getAverageTurnScore(playerTurnScores) {
    let scoreTurns = 0;
    let totalScore = 0;
    playerTurnScores.forEach((score) => {
      // Do not count turns before the player is in
      if (score > 0) {
        scoreTurns += 1;
        totalScore += score;
      }
    });

    return scoreTurns === 0 ? 0 : totalScore / scoreTurns;
  }

  function getBustTurns(playerTurnScores) {
    return playerTurnScores.filter((score) => score === 0).length;
  }

  function prepareTableRows() {
    const rows = [];

    props.players.forEach((player, playerIndex) => {
      const playerTurnScores = getPlayerTurnScores(
        playerIndex,
        props.turnScores
      );

      // Prepare array of values
      const rowValues = [
        playerIndex,
        player,
        props.totalScores[playerIndex],
        getTurnsToGetIn(playerTurnScores),
        getAverageTurnScore(playerTurnScores),
        Math.max(...playerTurnScores, 0),
        getBustTurns(playerTurnScores),
      ];

      // Format numbers in output
      const formattedRow = [];
      rowValues.forEach((value) => {
        formattedRow.push(formatValue(value));
      });

      rows.push(formattedRow);
    });

    return rows;
  }

  const headers = [
    "Order",
    "Name",
    "Score",
    "Turns to get in",
    "Average Points per Turn",
    "Highest Turn",
    "Bust Turns",
  ];

  return (
    <Table>
      <thead>
        <tr>
          {headers.map((header, headerIndex) => (
            <th key={headerIndex}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {prepareTableRows().map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((col, colIndex) => (
              <td key={colIndex}>{col}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default PostGameStatTable;
