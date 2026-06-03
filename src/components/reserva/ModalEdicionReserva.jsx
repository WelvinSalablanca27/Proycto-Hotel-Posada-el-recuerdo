import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionReserva = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    reservaEditar,
    manejoCambioInputEdicion,
    actualizarReserva,

    // Relaciones
    huespedes = [],
    habitaciones = [],
    empleados = [],
    tiempos = [],
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleActualizar = async () => {
        if (deshabilitado) return;

        setDeshabilitado(true);
        await actualizarReserva();
        setDeshabilitado(false);
    };

    return (
        <Modal
            show={mostrarModalEdicion}
            onHide={() => setMostrarModalEdicion(false)}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Editar Reserva</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>

                    {/* 👤 Huésped */}
                    <Form.Group className="mb-3">
                        <Form.Label>Huésped</Form.Label>
                        <Form.Select
                            name="id_huesped"
                            value={reservaEditar?.id_huesped || ""}
                            onChange={manejoCambioInputEdicion}
                        >
                            <option value="">Seleccione un huésped</option>

                            {huespedes.map((huesped) => (
                                <option
                                    key={huesped.id_huesped}
                                    value={huesped.id_huesped}
                                >
                                    {huesped.nombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* 🛏️ Habitación */}
                    <Form.Group className="mb-3">
                        <Form.Label>Habitación</Form.Label>
                        <Form.Select
                            name="id_habitacion"
                            value={reservaEditar?.id_habitacion || ""}
                            onChange={manejoCambioInputEdicion}
                        >
                            <option value="">Seleccione una habitación</option>

                            {habitaciones.map((habitacion) => (
                                <option
                                    key={habitacion.id_habitacion}
                                    value={habitacion.id_habitacion}
                                >
                                    Habitación #{habitacion.numero_habitacion}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* 👨‍💼 Empleado */}
                    <Form.Group className="mb-3">
                        <Form.Label>Empleado</Form.Label>
                        <Form.Select
                            name="id_empleado"
                            value={reservaEditar?.id_empleado || ""}
                            onChange={manejoCambioInputEdicion}
                        >
                            <option value="">Seleccione un empleado</option>

                            {empleados.map((empleado) => (
                                <option
                                    key={empleado.id_empleado}
                                    value={empleado.id_empleado}
                                >
                                    {empleado.nombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* 📅 Tiempo */}
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Select
                            name="id_tiempo"
                            value={reservaEditar?.id_tiempo || ""}
                            onChange={manejoCambioInputEdicion}
                        >
                            <option value="">Seleccione una fecha</option>

                            {tiempos.map((tiempo) => (
                                <option
                                    key={tiempo.id_tiempo}
                                    value={tiempo.id_tiempo}
                                >
                                    {tiempo.fecha}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* 💰 Monto */}
                    <Form.Group className="mb-3">
                        <Form.Label>Monto Total ($)</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            name="monto_total"
                            value={reservaEditar?.monto_total || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Ej: 150.00"
                        />
                    </Form.Group>

                    {/* 💳 Forma de pago */}
                    <Form.Group className="mb-3">
                        <Form.Label>Forma de Pago</Form.Label>
                        <Form.Select
                            name="forma_pago"
                            value={reservaEditar?.forma_pago || ""}
                            onChange={manejoCambioInputEdicion}
                        >
                            <option value="">Seleccione método</option>
                            <option value="Efectivo">Efectivo</option>
                            <option value="Tarjeta">Tarjeta</option>
                            <option value="Transferencia">Transferencia</option>
                        </Form.Select>
                    </Form.Group>

                    {/* ⏰ Hora Entrada */}
                    <Form.Group className="mb-3">
                        <Form.Label>Hora Entrada</Form.Label>
                        <Form.Control
                            type="time"
                            name="hora_entrada"
                            value={reservaEditar?.hora_entrada || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    {/* ⏰ Hora Salida */}
                    <Form.Group className="mb-3">
                        <Form.Label>Hora Salida</Form.Label>
                        <Form.Control
                            type="time"
                            name="hora_salida"
                            value={reservaEditar?.hora_salida || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => setMostrarModalEdicion(false)}
                >
                    Cancelar
                </Button>

                <Button
                    variant="primary"
                    onClick={handleActualizar}
                    disabled={
                        !reservaEditar?.id_huesped ||
                        !reservaEditar?.id_habitacion ||
                        deshabilitado
                    }
                >
                    Actualizar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionReserva;