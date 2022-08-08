import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

function transformTurnsToCumSums(turnScores) {
  if (turnScores.length === 0) {
    return [];
  }

  if (turnScores.length === 1) {
    return turnScores[0];
  }

  let cumSums = [new Array(turnScores[0].length).fill(0)];

  turnScores.slice(1).forEach((turnScore) => {
    const turnCumSums = [];
    turnScore.forEach((score, index) => {
      score = score < 0 ? 0 : score;
      turnCumSums.push(cumSums[cumSums.length - 1][index] + score);
    });
    cumSums.push(turnCumSums);
  });

  return cumSums;
}

function generateGraphData(turnScores) {
  const data = [];
  const cumSums = transformTurnsToCumSums(turnScores);

  cumSums.forEach((cumSum, index) => {
    data.push({
      index: index,
      cumSums: cumSum,
    });
  });

  return data;
}

function CumSumGraph(props) {
  return (
    <LineChart
      width={500}
      height={500}
      data={generateGraphData(props.turnScores)}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="index" />
      <YAxis />
      <Legend align="right" />
      <ReferenceLine y={props.winNumber} stroke="black" strokeWidth={2} />
      {props.turnScores.length > 0 &&
        props.turnScores[0].map((_, index) => (
          <Line
            name={props.players[index]}
            key={index}
            type="monotone"
            dataKey={(v) => v["cumSums"][index]}
            stroke={props.colors[index]}
            strokeWidth={2}
          />
        ))}
    </LineChart>
  );
}

export default CumSumGraph;
