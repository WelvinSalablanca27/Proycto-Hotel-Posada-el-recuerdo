import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ModalRegistroRecepcion = ({
  mostrarModal,
  setMostrarModal,
  nuevoRecepcionista,
  manejoCambioInput,
  agregarRecepcionista,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered size="lg">
      
      {/* Barra Azul */}
      <Modal.Header
        closeButton
        style={{
          backgroundColor: "#0d6efd",
          color: "white",
        }}
      >
        <Modal.Title>
          <i className="bi bi-person-plus-fill me-2"></i>
          Registrar Recepcionista
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#f8fbff" }}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="fecha"
                value={nuevoRecepcionista.fecha}
                onChange={manejoCambioInput}
                style={{
                  backgroundColor: "#d9ecff",
                  borderColor: "#90caf9",
                }}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Turno</Form.Label>
              <Form.Select
                name="turno"
                value={nuevoRecepcionista.turno}
                onChange={manejoCambioInput}
                style={{
                  backgroundColor: "#d9ecff",
                  borderColor: "#90caf9",
                }}
              >
                <option value="">Seleccione</option>
                <option>Mañana</option>
                <option>Tarde</option>
                <option>Noche</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={nuevoRecepcionista.nombre}
                onChange={manejoCambioInput}
                style={{
                  backgroundColor: "#d9ecff",
                  borderColor: "#90caf9",
                }}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={nuevoRecepcionista.apellido}
                onChange={manejoCambioInput}
                style={{
                  backgroundColor: "#d9ecff",
                  borderColor: "#90caf9",
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Hora Entrada</Form.Label>
              <Form.Control
                type="time"
                name="hora_entrada"
                value={nuevoRecepcionista.hora_entrada}
                onChange={manejoCambioInput}
                style={{
                  backgroundColor: "#d9ecff",
                  borderColor: "#90caf9",
                }}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Hora Salida</Form.Label>
              <Form.Control
                type="time"
                name="hora_salida"
                value={nuevoRecepcionista.hora_salida}
                onChange={manejoCambioInput}
                style={{
                  backgroundColor: "#d9ecff",
                  borderColor: "#90caf9",
                }}
              />
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModal(false)}
        >
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={agregarRecepcionista}
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroRecepcion;