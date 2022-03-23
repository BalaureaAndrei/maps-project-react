import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useState } from "react";

const ErrorModal = (props) => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  return (
    <div onClick={handleClose}>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{props.type}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ErrorModal;
