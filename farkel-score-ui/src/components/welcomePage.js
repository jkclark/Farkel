import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import "./welcomePage.css";

function WelcomePage() {
  function startGame() {
    document.getElementById("welcome").style.display = "none";
    document.getElementById("game-setup").style.display = "flex";
  }

  return (
    <Container id="welcome">
      <div id="welcome-stack">
        <h1>Farkle Party!</h1>
        <Button id="start-button" onClick={startGame}>
          Let's go
        </Button>
      </div>
    </Container>
  );
}

export default WelcomePage;
