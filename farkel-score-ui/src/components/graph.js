import { LineChart, Line } from "recharts";

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

function Graph(props) {
  return (
    <LineChart
      width={400}
      height={200}
      data={transformTurnsToCumSums(props.turnScores)}
    >
      {props.turnScores.length > 0 &&
        props.turnScores[0].map((_, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={(v) => v[index]}
            stroke="#8884d8"
          />
        ))}
    </LineChart>
  );
}

export default Graph;
