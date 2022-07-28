import Table from "react-bootstrap/Table";

function Scoreboard(props) {
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
      <tbody></tbody>
    </Table>
  );
}

export default Scoreboard;
