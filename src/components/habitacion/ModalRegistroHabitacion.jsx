import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroHabitacion = ({
  mostrarModal,
  setMostrarModal,
  nuevaHabitacion,
  manejoCambioInput,
  agregarHabitacion,
}) => {

  const [deshabilitado, setDeshabilitado] = useState(false);

  // REGISTRAR
  const handleRegistrar = async () => {
    if (deshabilitado) return;

    setDeshabilitado(true);
    await agregarHabitacion();
    setDeshabilitado(false);
  };

  // CAMBIOS + PRECIOS AUTOMÁTICOS
  const manejarCambios = (e) => {

    const { name, value } = e.target;

    let datos = {
      ...nuevaHabitacion,
      [name]: value,
    };

    const numero = parseInt(datos.numero_habitacion);

    // SOLO GENERA PRECIO AUTOMÁTICO
    // CUANDO CAMBIA:
    // número, camas o clima
    if (
      name === "numero_habitacion" ||
      name === "tipo_camas" ||
      name === "tipo_clima"
    ) {

      /* ==============================
         HABITACIONES 3 AL 8
         MATRIMONIAL
      ===============================*/

      // Aire = 800
      if (
        numero >= 3 &&
        numero <= 8 &&
        datos.tipo_camas === "matrimonial" &&
        datos.tipo_clima === "Aire acondicionado"
      ) {
        datos.precio = 800;
      }

      // Ventilador = 700
      if (
        numero >= 3 &&
        numero <= 8 &&
        datos.tipo_camas === "matrimonial" &&
        datos.tipo_clima === "Ventilador"
      ) {
        datos.precio = 700;
      }

      /* ==============================
         HABITACIONES 2, 14 y 15
         UNIPERSONAL
      ===============================*/

      // Aire = 600
      if (
        [2, 14, 15].includes(numero) &&
        datos.tipo_camas === "unipersonal" &&
        datos.tipo_clima === "Aire acondicionado"
      ) {
        datos.precio = 600;
      }

      // Ventilador = 500
      if (
        [2, 14, 15].includes(numero) &&
        datos.tipo_camas === "unipersonal" &&
        datos.tipo_clima === "Ventilador"
      ) {
        datos.precio = 500;
      }

      /* ==============================
         HABITACIÓN 12
         TRIPLE
      ===============================*/

      if (
        numero === 12 &&
        datos.tipo_camas === "triple"
      ) {
        datos.precio = 1100;
      }
    }

    // ACTUALIZA TODOS LOS CAMPOS
    Object.keys(datos).forEach((campo) => {
      manejoCambioInput({
        target: {
          name: campo,
          value: datos[campo],
        },
      });
    });
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      centered
    >

      {/* ENCABEZADO */}
      <Modal.Header
        closeButton
        className="bg-primary text-white"
      >
        <Modal.Title>
          <i className="bi bi-door-open-fill me-2"></i>
          Agregar Habitación
        </Modal.Title>
      </Modal.Header>

      {/* CUERPO */}
      <Modal.Body className="bg-light">

        <Form>

          {/* NÚMERO */}
          <Form.Group className="mb-3">

            <Form.Label className="fw-bold text-primary">
              Número
            </Form.Label>

            <Form.Control
              type="number"
              name="numero_habitacion"
              value={nuevaHabitacion.numero_habitacion || ""}
              onChange={manejarCambios}
              placeholder="Ej: 101"
              min={1}
              max={15}

              // BLOQUEA LETRAS
              onKeyDown={(e) => {
                if (
                  ["e", "E", "+", "-", ".", ","].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
            />

          </Form.Group>

          {/* TIPO HABITACIÓN */}
          <Form.Group className="mb-3">

            <Form.Label className="fw-bold text-primary">
              Tipo de Habitación
            </Form.Label>

            <Form.Select
              name="tipo_habitacion"
              value={nuevaHabitacion.tipo_habitacion || ""}
              onChange={manejarCambios}
            >
              <option value="">Seleccione...</option>

              <option value="Individual">
                Individual
              </option>

              <option value="Doble">
                Doble
              </option>

              <option value="Suite">
                Suite
              </option>

              <option value="Familiar">
                Familiar
              </option>
            </Form.Select>

          </Form.Group>

          {/* CAMAS + CLIMA */}
          <Row>

            {/* CAMAS */}
            <Col>

              <Form.Group className="mb-3">

                <Form.Label className="fw-bold text-primary">
                  Camas
                </Form.Label>

                <Form.Select
                  name="tipo_camas"
                  value={nuevaHabitacion.tipo_camas || ""}
                  onChange={manejarCambios}
                >
                  <option value="">Seleccione...</option>

                  <option value="matrimonial">
                    Matrimonial
                  </option>

                  <option value="unipersonal">
                    Unipersonal
                  </option>

                  <option value="triple">
                    Triple
                  </option>
                </Form.Select>

              </Form.Group>

            </Col>

            {/* CLIMA */}
            <Col>

              <Form.Group className="mb-3">

                <Form.Label className="fw-bold text-primary">
                  Clima
                </Form.Label>

                <Form.Select
                  name="tipo_clima"
                  value={nuevaHabitacion.tipo_clima || ""}
                  onChange={manejarCambios}
                >
                  <option value="">Seleccione...</option>

                  <option value="Aire acondicionado">
                    Aire acondicionado
                  </option>

                  <option value="Ventilador">
                    Ventilador
                  </option>
                </Form.Select>

              </Form.Group>

            </Col>

          </Row>

          {/* PRECIO */}
          <Form.Group className="mb-3">

            <Form.Label className="fw-bold text-primary">
              Precio ($)
            </Form.Label>

            <Form.Control
              type="number"
              step="0.01"
              min={1}
              name="precio"
              value={nuevaHabitacion.precio || ""}
              onChange={manejarCambios}
              placeholder="Ej: 50.00"

              // BLOQUEA LETRAS
              onKeyDown={(e) => {
                if (
                  ["e", "E", "+", "-", ","].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
            />

          </Form.Group>

          {/* ESTADO */}
          <Form.Group className="mb-3">

            <Form.Label className="fw-bold text-primary">
              Estado
            </Form.Label>

            <Form.Select
              name="estado"
              value={nuevaHabitacion.estado || ""}
              onChange={manejarCambios}
            >
              <option value="">Seleccione...</option>

              <option value="Disponible">
                Disponible
              </option>

              <option value="Ocupado">
                Ocupado
              </option>
            </Form.Select>

          </Form.Group>

        </Form>

      </Modal.Body>

      {/* PIE */}
      <Modal.Footer className="bg-white">

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
            nuevaHabitacion.numero_habitacion === "" ||
            deshabilitado
          }
        >
          Guardar
        </Button>

      </Modal.Footer>

    </Modal>
  );
};

export default ModalRegistroHabitacion;