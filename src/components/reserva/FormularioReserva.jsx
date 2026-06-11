import React, { useState } from "react";
import {
  Modal,
  Row,
  Col,
  Form,
  Button,
  Card
} from "react-bootstrap";

const FormularioReserva = ({
  mostrar,
  setMostrar,
  huespedes,
  habitaciones,
  recepcionistas,
  huespedSeleccionado,
  setHuespedSeleccionado,
  habitacionSeleccionada,
  setHabitacionSeleccionada,
  recepcionistaSeleccionado,
  setRecepcionistaSeleccionado,
  formaPago,
  setFormaPago,
  horaEntrada,
  setHoraEntrada,
  horaSalida,
  setHoraSalida,
  monto,
  setMonto,
  guardarReserva,
  reservaAEditar
}) => {

  return (

    <Modal
      show={mostrar}
      onHide={() => setMostrar(false)}
      backdrop="static"
      size="xl"
      centered
    >

      <Modal.Header closeButton>

        <Modal.Title>

          {reservaAEditar
            ? "Editar Reserva"
            : "Nueva Reserva"}

        </Modal.Title>

      </Modal.Header>

      <Modal.Body>

        <Row>

          {/* FORMULARIO */}
          <Col lg={7} md={6}>

            <h5>
              Datos de la Reserva
            </h5>

            {/* HUÉSPED */}
            <Form.Group className="mb-3">

              <Form.Label>
                Huésped *
              </Form.Label>

              <Form.Select
                value={
                  huespedSeleccionado?.id_huesped || ""
                }
                onChange={(e) => {

                  const huesped =
                    huespedes.find(
                      h =>
                        h.id_huesped ===
                        Number(e.target.value)
                    );

                  setHuespedSeleccionado(huesped);

                }}
              >

                <option value="">
                  Seleccionar huésped...
                </option>

                {huespedes.map((h) => (

                  <option
                    key={h.id_huesped}
                    value={h.id_huesped}
                  >

                    {h.primer_nombre}{" "}
                    {h.primer_apellido}

                  </option>

                ))}

              </Form.Select>

            </Form.Group>

            {/* RECEPCIONISTA */}
            <Form.Group className="mb-3">

              <Form.Label>
                Recepcionista *
              </Form.Label>

              <Form.Select
                value={
                  recepcionistaSeleccionado?.id_recepcionista || ""
                }
                onChange={(e) => {

                  const recepcionista =
                    recepcionistas.find(
                      r =>
                        r.id_recepcionista ===
                        Number(e.target.value)
                    );

                  setRecepcionistaSeleccionado(
                    recepcionista
                  );

                }}
              >

                <option value="">
                  Seleccionar recepcionista...
                </option>

                {recepcionistas.map((r) => (

                  <option
                    key={r.id_recepcionista}
                    value={r.id_recepcionista}
                  >

                    {r.nombre}{" "}
                    {r.apellido}

                  </option>

                ))}

              </Form.Select>

            </Form.Group>

            {/* HABITACIÓN */}
            <Form.Group className="mb-3">

              <Form.Label>
                Habitación *
              </Form.Label>

              <Form.Select
                value={
                  habitacionSeleccionada?.id_habitacion || ""
                }
                onChange={(e) => {

                  const habitacion =
                    habitaciones.find(
                      h =>
                        h.id_habitacion ===
                        Number(e.target.value)
                    );

                  setHabitacionSeleccionada(
                    habitacion
                  );

                }}
              >

                <option value="">
                  Seleccionar habitación...
                </option>

                {habitaciones.map((h) => (

                  <option
                    key={h.id_habitacion}
                    value={h.id_habitacion}
                  >

                    Habitación #
                    {h.numero_habitacion} - {" "}
                    {h.tipo_habitacion}

                  </option>

                ))}

              </Form.Select>

            </Form.Group>

            {/* ENTRADA */}
            <Form.Group className="mb-3">

              <Form.Label>
                Hora Entrada
              </Form.Label>

              <Form.Control
                type="datetime-local"
                value={horaEntrada}
                onChange={(e) =>
                  setHoraEntrada(e.target.value)
                }
              />

            </Form.Group>

            {/* SALIDA */}
            <Form.Group className="mb-3">

              <Form.Label>
                Hora Salida
              </Form.Label>

              <Form.Control
                type="datetime-local"
                value={horaSalida}
                onChange={(e) =>
                  setHoraSalida(e.target.value)
                }
              />

            </Form.Group>

            {/* FORMA PAGO */}
            <Form.Group className="mb-3">

              <Form.Label>
                Forma Pago
              </Form.Label>

              <Form.Select
                value={formaPago}
                onChange={(e) =>
                  setFormaPago(e.target.value)
                }
              >

                <option value="efectivo">
                  Efectivo
                </option>

                <option value="tarjeta">
                  Tarjeta
                </option>

                <option value="transferencia">
                  Transferencia
                </option>

              </Form.Select>

            </Form.Group>

            {/* MONTO */}
            <Form.Group className="mb-3">

              <Form.Label>
                Monto
              </Form.Label>

              <Form.Control
                type="number"
                value={monto}
                onChange={(e) =>
                  setMonto(e.target.value)
                }
              />

            </Form.Group>

          </Col>

          {/* RESUMEN */}
          <Col lg={5} md={6}>

            <Card className="h-100">

              <Card.Header>

                <strong>
                  Resumen Reserva
                </strong>

              </Card.Header>

              <Card.Body>

                <p>

                  <strong>Huésped:</strong>{" "}

                  {huespedSeleccionado
                    ? `${huespedSeleccionado.primer_nombre}
                       ${huespedSeleccionado.primer_apellido}`
                    : "No seleccionado"}

                </p>

                <p>

                  <strong>Habitación:</strong>{" "}

                  {habitacionSeleccionada
                    ? `#${habitacionSeleccionada.numero_habitacion}
                       - ${habitacionSeleccionada.tipo_habitacion}`
                    : "No seleccionada"}

                </p>

                <p>

                  <strong>Forma Pago:</strong>{" "}

                  {formaPago}

                </p>

                <hr />

                <div className="d-flex justify-content-between align-items-center fs-4 fw-bold">

                  <span>
                    Total:
                  </span>

                  <span className="text-success">

                    C$ {parseFloat(
                      monto || 0
                    ).toFixed(2)}

                  </span>

                </div>

              </Card.Body>

            </Card>

          </Col>

        </Row>

      </Modal.Body>

      <Modal.Footer>

        <Button
          variant="secondary"
          onClick={() => setMostrar(false)}
        >

          Cancelar

        </Button>

        <Button
          variant="primary"
          onClick={guardarReserva}
          disabled={
            !huespedSeleccionado ||
            !habitacionSeleccionada ||
            !recepcionistaSeleccionado
          }
        >

          Registrar Reserva

        </Button>

      </Modal.Footer>

    </Modal>
  );
};

export default FormularioReserva;