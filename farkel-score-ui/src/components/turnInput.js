function YesNoButtons() {
  return (
    <div className="yes-no-stack">
      <div>Did *player* get in?</div>
      <Button variant="success">Yes</Button>
      <Button variant="danger">No</Button>
    </div>
  );
}

function ScoreInput() {
  return (
    <div id="score-input-stack">
      <label id="turn-score-input-label" htmlFor="turn-score">
        Enter *player*'s score:
      </label>
      <input type="text" className="form-control" name="turn-score"></input>
    </div>
  );
}

function TurnInput(props) {
  return ();
}

export default TurnInput;
