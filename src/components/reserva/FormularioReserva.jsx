import React, { useState } from "react";
import {
  Modal,
  Row,
  Col,
  Form,
  Button,
  Card
} from "react-bootstrap";
import "./FormularioReserva.css";

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
      size="lg"
      centered
      className="modal-reserva"
    >

      <Modal.Header className="header-reserva" closeButton>

        <Modal.Title className="titulo-reserva">

          <i className={`bi bi-${reservaAEditar ? "pencil-square" : "plus-circle"} me-2`}></i>

          {reservaAEditar
            ? "Editar Reserva"
            : "Nueva Reserva"}

        </Modal.Title>

      </Modal.Header>

      <Modal.Body className="body-reserva">

        <Row className="g-4">

          {/* FORMULARIO */}
          <Col lg={7} md={6}>

            <div className="formulario-section">
              <h5 className="titulo-seccion">
                <i className="bi bi-info-circle me-2"></i>
                Datos de la Reserva
              </h5>

              {/* HUÉSPED */}
              <Form.Group className="mb-4">

                <Form.Label className="label-personalizado">
                  <span className="badge bg-primary me-2">1</span>
                  Huésped *
                </Form.Label>

                <Form.Select
                  className="select-personalizado"
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
              <Form.Group className="mb-4">

                <Form.Label className="label-personalizado">
                  <span className="badge bg-primary me-2">2</span>
                  Recepcionista *
                </Form.Label>

                <Form.Select
                  className="select-personalizado"
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
              <Form.Group className="mb-4">

                <Form.Label className="label-personalizado">
                  <span className="badge bg-primary me-2">3</span>
                  Habitación *
                </Form.Label>

                <Form.Select
                  className="select-personalizado"
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

              <div className="divider-seccion"></div>

              {/* ENTRADA */}
              <Form.Group className="mb-4">

                <Form.Label className="label-personalizado">
                  <i className="bi bi-calendar-check me-2"></i>
                  Hora Entrada
                </Form.Label>

                <Form.Control
                  type="datetime-local"
                  className="input-personalizado"
                  value={horaEntrada}
                  onChange={(e) =>
                    setHoraEntrada(e.target.value)
                  }
                />

              </Form.Group>

              {/* SALIDA */}
              <Form.Group className="mb-4">

                <Form.Label className="label-personalizado">
                  <i className="bi bi-calendar-x me-2"></i>
                  Hora Salida
                </Form.Label>

                <Form.Control
                  type="datetime-local"
                  className="input-personalizado"
                  value={horaSalida}
                  onChange={(e) =>
                    setHoraSalida(e.target.value)
                  }
                />

              </Form.Group>

              <div className="divider-seccion"></div>

              {/* FORMA PAGO */}
              <Form.Group className="mb-4">

                <Form.Label className="label-personalizado">
                  <i className="bi bi-credit-card me-2"></i>
                  Forma Pago
                </Form.Label>

                <Form.Select
                  className="select-personalizado"
                  value={formaPago}
                  onChange={(e) =>
                    setFormaPago(e.target.value)
                  }
                >

                  <option value="efectivo">
                    💵 Efectivo
                  </option>

                  <option value="tarjeta">
                    💳 Tarjeta
                  </option>

                  <option value="transferencia">
                    🔄 Transferencia
                  </option>

                </Form.Select>

              </Form.Group>

              {/* MONTO */}
              <Form.Group className="mb-2">

                <Form.Label className="label-personalizado">
                  <i className="bi bi-cash-coin me-2"></i>
                  Monto
                </Form.Label>

                <Form.Control
                  type="number"
                  className="input-personalizado"
                  value={monto}
                  onChange={(e) =>
                    setMonto(e.target.value)
                  }
                  placeholder="0.00"
                />

              </Form.Group>

            </div>

          </Col>

          {/* RESUMEN */}
          <Col lg={5} md={6}>

            <Card className="card-resumen">

              <Card.Header className="header-card-resumen">

                <strong>
                  <i className="bi bi-receipt me-2"></i>
                  Resumen Reserva
                </strong>

              </Card.Header>

              <Card.Body className="body-card-resumen">

                <div className="item-resumen">
                  <span className="label-resumen">
                    <i className="bi bi-person me-2"></i>
                    Huésped
                  </span>
                  <span className="valor-resumen">

                    {huespedSeleccionado
                      ? `${huespedSeleccionado.primer_nombre}
                         ${huespedSeleccionado.primer_apellido}`
                      : <span className="text-muted">No seleccionado</span>}

                  </span>
                </div>

                <div className="item-resumen">
                  <span className="label-resumen">
                    <i className="bi bi-door-closed me-2"></i>
                    Habitación
                  </span>
                  <span className="valor-resumen">

                    {habitacionSeleccionada
                      ? `#${habitacionSeleccionada.numero_habitacion}
                         - ${habitacionSeleccionada.tipo_habitacion}`
                      : <span className="text-muted">No seleccionada</span>}

                  </span>
                </div>

                <div className="item-resumen">
                  <span className="label-resumen">
                    <i className="bi bi-calendar-event me-2"></i>
                    Entrada
                  </span>
                  <span className="valor-resumen">

                    {horaEntrada
                      ? new Date(horaEntrada).toLocaleString("es-NI")
                      : <span className="text-muted">No definido</span>}

                  </span>
                </div>

                <div className="item-resumen">
                  <span className="label-resumen">
                    <i className="bi bi-calendar-event me-2"></i>
                    Salida
                  </span>
                  <span className="valor-resumen">

                    {horaSalida
                      ? new Date(horaSalida).toLocaleString("es-NI")
                      : <span className="text-muted">No definido</span>}

                  </span>
                </div>

                <div className="item-resumen">
                  <span className="label-resumen">
                    <i className="bi bi-credit-card me-2"></i>
                    Forma Pago
                  </span>
                  <span className="valor-resumen">
                    {formaPago}
                  </span>
                </div>

                <hr className="divider-resumen" />

                <div className="total-resumen">

                  <span className="label-total">
                    Total:
                  </span>

                  <span className="valor-total">

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

      <Modal.Footer className="footer-reserva">

        <Button
          variant="secondary"
          onClick={() => setMostrar(false)}
          className="btn-cancelar"
        >
          <i className="bi bi-x-circle me-2"></i>
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
          className="btn-guardar"
        >
          <i className="bi bi-check-circle me-2"></i>
          {reservaAEditar ? "Actualizar Reserva" : "Registrar Reserva"}

        </Button>

      </Modal.Footer>

    </Modal>
  );
};

export default FormularioReserva;