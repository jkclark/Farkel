import Table from "react-bootstrap/Table";

function PostGameStatTable(props) {
  function getPlayerTurnScores(playerIndex, turnScores) {
    const playerScores = [];
    turnScores.forEach((scores) => {
      playerScores.push(scores[playerIndex]);
    });

    return playerScores;
  }

  function getPlayerAverageTurnScore(playerTurnScores) {
    // TODO: Do not count turns before the player is in
    return props.turnScores[0]
      ? playerTurnScores.reduce((a, b) => a + b) / playerTurnScores.length
      : 0;
  }

  function prepareTableRows() {
    const rows = [];

    props.players.forEach((player, playerIndex) => {
      const playerTurnScores = getPlayerTurnScores(
        playerIndex,
        props.turnScores
      );

      rows.push([]);
      rows[playerIndex].push(playerIndex);
      rows[playerIndex].push(player);
      rows[playerIndex].push(props.totalScores[playerIndex]);
      rows[playerIndex].push(getPlayerAverageTurnScore(playerTurnScores));
      rows[playerIndex].push(Math.max(...playerTurnScores) || 0);
    });

    return rows;
  }

  const headers = [
    "Order",
    "Name",
    "Score",
    "Average Points per Turn",
    "Highest Turn",
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
