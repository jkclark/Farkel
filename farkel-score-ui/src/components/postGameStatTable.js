import Table from "react-bootstrap/Table";

function PostGameStatTable(props) {
  function prepareTableRows() {
    const rows = [];

    props.players.forEach((player, playerIndex) => {
      rows.push([]);
      rows[playerIndex].push(playerIndex);
      rows[playerIndex].push(player);
      rows[playerIndex].push(props.totalScores[playerIndex]);
    });

    console.log(rows);

    return rows;
  }

  const headers = ["Order", "Name", "Score"];

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
