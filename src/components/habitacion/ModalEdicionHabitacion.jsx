import React, { useState } from "react";
import { Modal, Form, Button, ModalFooter } from "react-bootstrap";
import { Await } from "react-router-dom";

const ModalEdicionHabitacion = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    habitacionEditar,
    manejoCambioInputEdicion,
    actualizarHabitacion,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleActualizar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true);
        await actualizarHabitacion();
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
                <Modal.Title>Editar Habitacion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Numero Habitacion</Form.Label>
                        <Form.Control
                            type="text"
                            name="numero_habitacion"
                            value={habitacionEditar?.numero_habitacion || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Numero de Habitacion"
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Tipo de Habitacion</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="tipo_habitacion"
                            value={habitacionEditar?.tipo_habitacion || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Tipo Habitacion abanico o aireacondicionado"
                        />
                    </Form.Group>

                    {/* 🛏️ Camas + Clima en fila */}

                    <Form.Group className="mb-3">
                        <Form.Label>Camas</Form.Label>
                        <Form.Control
                            type="text"
                            name="tipo_camas"
                            value={habitacionEditar?.tipo_camas || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Ej: 2 camas"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Clima</Form.Label>
                        <Form.Control
                            name="tipo_clima"
                            value={habitacionEditar?.tipo_clima || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    {/* 💰 Precio */}
                    <Form.Group className="mb-3">
                        <Form.Label>Precio ($)</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            name="precio"
                            value={habitacionEditar?.precio || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Ej: 50.00"
                        />
                    </Form.Group>

                    {/* 🟢 Estado */}
                    <Form.Group className="mb-3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Control
                            name="estado"
                            value={habitacionEditar?.estado || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
                    Canceler
                </Button>
                <Button
                    variant="primary"
                    onClick={handleActualizar}
                    disabled={!habitacionEditar?.numero_habitacion?.trim() || deshabilitado}                >
                    Actualizar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionHabitacion;