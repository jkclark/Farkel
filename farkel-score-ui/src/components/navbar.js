import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import "./navbar.css";

function MainNavbar() {
  return (
    <Navbar expand="sm" bg="light" fixed="top">
      <Container>
        <Navbar.Brand>Farkel Score</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link>FAQ</Nav.Link>
            <Nav.Link>Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavbar;
