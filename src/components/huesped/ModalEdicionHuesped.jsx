import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalEdicionHuesped = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    huespedEditado,
    manejoCambioInput,
    actualizarHuesped,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleActualizar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true);
        await actualizarHuesped();
        setDeshabilitado(false);
    };

    return (
        <Modal
            show={mostrarModalEdicion}
            onHide={() => setMostrarModalEdicion(false)}
            backdrop="static"
            centered
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>Editar Huésped</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Row>

                        <Col xs={12} md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Primer Nombre *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="primer_nombre"
                                    value={huespedEditado.primer_nombre || ""}
                                    onChange={manejoCambioInput}
                                    placeholder="Primer nombre"
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Segundo Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="segundo_nombre"
                                    value={huespedEditado.segundo_nombre || ""}
                                    onChange={manejoCambioInput}
                                    placeholder="Segundo nombre"
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Primer Apellido *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="primer_apellido"
                                    value={huespedEditado.primer_apellido || ""}
                                    onChange={manejoCambioInput}
                                    placeholder="Primer apellido"
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Segundo Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="segundo_apellido"
                                    value={huespedEditado.segundo_apellido || ""}
                                    onChange={manejoCambioInput}
                                    placeholder="Segundo apellido"
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Cédula o Pasaporte *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cedula_pasaporte"
                                    value={huespedEditado.cedula_pasaporte || ""}
                                    onChange={manejoCambioInput}
                                    placeholder="Cédula o pasaporte"
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Lugar de Origen *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lugar_origen"
                                    value={huespedEditado.lugar_origen || ""}
                                    onChange={manejoCambioInput}
                                    placeholder="Lugar de origen"
                                    required
                                />
                            </Form.Group>
                        </Col>

                    </Row>
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
                    disabled={deshabilitado}
                >
                    Actualizar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionHuesped;