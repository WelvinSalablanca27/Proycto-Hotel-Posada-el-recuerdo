import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";

const ModalRegistroReserva = ({
  mostrarModal,
  setMostrarModal,
  nuevaReserva,
  manejoCambioInput,
  agregarReserva,

  huespedes = [],
  habitaciones = [],
  recepcionistas = [],
}) => {

  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleRegistrar = async () => {
    if (deshabilitado) return;

    setDeshabilitado(true);
    await agregarReserva();
    setDeshabilitado(false);
  };

  // 👤 HUÉSPEDES
  const opcionesHuesped = huespedes.map((h) => ({
    value: h.id_huesped,
    label: `${h.nombre} ${h.apellido} - DNI: ${h.documento}`,
  }));

  // 🏨 HABITACIONES
  const opcionesHabitacion = habitaciones.map((h) => ({
    value: h.id_habitacion,
    label: `Habitación #${h.numero_habitacion}`,
  }));

  // 👨‍💼 RECEPCIONISTAS
  const opcionesRecepcionista = recepcionistas.map((r) => ({
    value: r.id_recepcionista,
    label: `${r.nombre} ${r.apellido}`,
  }));

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      centered
      size="lg"
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          Registrar Reserva
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-light">

        <Form>
          <Row>

            {/* 👤 HUESPED */}
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label>Huésped</Form.Label>

                <Select
                  options={opcionesHuesped}
                  value={
                    opcionesHuesped.find(
                      (op) =>
                        String(op.value) ===
                        String(nuevaReserva.id_huesped)
                    ) || null
                  }
                  onChange={(opcion) =>
                    manejoCambioInput({
                      target: {
                        name: "id_huesped",
                        value: opcion ? opcion.value : "",
                      },
                    })
                  }
                  placeholder="Buscar huésped..."
                  isClearable
                  isSearchable
                />
              </Form.Group>
            </Col>

            {/* 🏨 HABITACIÓN */}
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Habitación</Form.Label>

                <Select
                  options={opcionesHabitacion}
                  value={
                    opcionesHabitacion.find(
                      (op) =>
                        String(op.value) ===
                        String(nuevaReserva.id_habitacion)
                    ) || null
                  }
                  onChange={(opcion) =>
                    manejoCambioInput({
                      target: {
                        name: "id_habitacion",
                        value: opcion ? opcion.value : "",
                      },
                    })
                  }
                  placeholder="Seleccionar habitación..."
                  isClearable
                />
              </Form.Group>
            </Col>

            {/* 👨‍💼 RECEPCIONISTA */}
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Recepcionista</Form.Label>

                <Form.Select
                  name="id_recepcionista"
                  value={nuevaReserva.id_recepcionista || ""}
                  onChange={manejoCambioInput}
                >
                  <option value="">Seleccione...</option>

                  {recepcionistas.map((r) => (
                    <option
                      key={r.id_recepcionista}
                      value={r.id_recepcionista}
                    >
                      {r.nombre} {r.apellido}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* 📅 FECHA */}
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>

                <Form.Control
                  type="date"
                  name="fecha"
                  value={nuevaReserva.fecha || ""}
                  onChange={manejoCambioInput}
                />
              </Form.Group>
            </Col>

            {/* 💰 MONTO */}
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Monto Total ($)</Form.Label>

                <Form.Control
                  type="number"
                  step="0.01"
                  name="monto_total"
                  value={nuevaReserva.monto_total || ""}
                  onChange={manejoCambioInput}
                />
              </Form.Group>
            </Col>

            {/* 💳 PAGO */}
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Forma de Pago</Form.Label>

                <Form.Select
                  name="forma_pago"
                  value={nuevaReserva.forma_pago || ""}
                  onChange={manejoCambioInput}
                >
                  <option value="">Seleccione...</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* ⏰ HORAS */}
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Hora Entrada</Form.Label>

                <Form.Control
                  type="time"
                  name="hora_entrada"
                  value={nuevaReserva.hora_entrada || ""}
                  onChange={manejoCambioInput}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Hora Salida</Form.Label>

                <Form.Control
                  type="time"
                  name="hora_salida"
                  value={nuevaReserva.hora_salida || ""}
                  onChange={manejoCambioInput}
                />
              </Form.Group>
            </Col>

          </Row>
        </Form>

      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModal(false)}
        >
          Cancelar
        </Button>

        <Button
          variant="success"
          onClick={handleRegistrar}
          disabled={
            !nuevaReserva.id_huesped ||
            !nuevaReserva.id_habitacion ||
            !nuevaReserva.id_recepcionista ||
            deshabilitado
          }
        >
          Guardar Reserva
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroReserva;