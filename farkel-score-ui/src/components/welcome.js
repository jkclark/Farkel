import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import "./welcome.css";

function Welcome() {
  function startGame() {
    document.getElementById("welcome").style.display = "none";
    document.getElementById("game-setup").style.display = "flex";
  }

  return (
    <Container id="welcome">
      <div id="welcome-stack">
        <h1>Farkel Party!</h1>
        <Button id="start-button" onClick={startGame}>
          Let's go
        </Button>
      </div>
    </Container>
  );
}

export default Welcome;
