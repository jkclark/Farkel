import { useState } from "react";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { ABOUT_CONTENTS, FAQ_CONTENTS } from "../constants";

import "./navbar.css";

function CustomModal(props) {
  const { title, body } = props.contents;
  return (
    <Modal show={props.show} onHide={props.onHide} scrollable={true}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function MainNavbar() {
  const [showModal, setShowModal] = useState(false);
  const [modalContents, setModalContents] = useState({});
  return (
    <>
      <Navbar expand="sm" bg="light" fixed="top">
        <Container>
          <Navbar.Brand>Farkel Score</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Nav.Link
                onClick={(event) => {
                  event.preventDefault();

                  setModalContents(FAQ_CONTENTS);

                  setShowModal(true);
                }}
              >
                FAQ
              </Nav.Link>
              <Nav.Link
                onClick={(event) => {
                  event.preventDefault();

                  setModalContents(ABOUT_CONTENTS);

                  setShowModal(true);
                }}
              >
                About
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <CustomModal
        contents={modalContents}
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
      ></CustomModal>
    </>
  );
}

export default MainNavbar;
