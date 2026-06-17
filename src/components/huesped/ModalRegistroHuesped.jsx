import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroHuesped = ({
    mostrarModal,
    setMostrarModal,
    nuevoHuesped,
    manejoCambioInput,
    agregarHuesped,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);
    const [tipoDocumento, setTipoDocumento] = useState("cedula");

    const handleAgregar = async () => {
        if (deshabilitado) return;

        setDeshabilitado(true);

        await agregarHuesped();

        setDeshabilitado(false);
    };

    const formatearCedula = (valor) => {

        const numeros = valor.replace(/\D/g, "").slice(0, 13);

        if (numeros.length <= 3) {
            return numeros;
        }

        if (numeros.length <= 9) {
            return `${numeros.slice(0, 3)}-${numeros.slice(3)}`;
        }

        return `${numeros.slice(0, 3)}-${numeros.slice(3, 9)}-${numeros.slice(9)}`;
    };

    // CONVERTIR PRIMERA LETRA EN MAYÚSCULA
    const capitalizarTexto = (texto) => {
        return texto.replace(/\b\w/g, (letra) =>
            letra.toUpperCase()
        );
    };

    // MANEJAR INPUTS DE TEXTO
    const handleTextoChange = (e) => {

        const { name, value } = e.target;

        manejoCambioInput({
            target: {
                name,
                value: capitalizarTexto(value),
            },
        });
    };

    const handleDocumentoChange = (e) => {

        let valor = e.target.value;

        if (tipoDocumento === "cedula") {

            valor = formatearCedula(valor);

        } else {

            valor = valor.slice(0, 9);
        }

        manejoCambioInput({
            target: {
                name: "cedula_pasaporte",
                value: valor,
            },
        });
    };

    return (
        <Modal
            show={mostrarModal}
            onHide={() => setMostrarModal(false)}
            backdrop="static"
            centered
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Huésped</Modal.Title>
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
                                    value={nuevoHuesped.primer_nombre || ""}
                                    onChange={handleTextoChange}
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
                                    value={nuevoHuesped.segundo_nombre || ""}
                                    onChange={handleTextoChange}
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
                                    value={nuevoHuesped.primer_apellido || ""}
                                    onChange={handleTextoChange}
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
                                    value={nuevoHuesped.segundo_apellido || ""}
                                    onChange={handleTextoChange}
                                    placeholder="Segundo apellido"
                                />

                            </Form.Group>
                        </Col>

                        <Col xs={12} md={6}>
                            <Form.Group className="mb-3">

                                <Form.Label>Documento *</Form.Label>

                                <Form.Select
                                    className="mb-2"
                                    value={tipoDocumento}
                                    onChange={(e) =>
                                        setTipoDocumento(e.target.value)
                                    }
                                >
                                    <option value="cedula">Cédula</option>
                                    <option value="pasaporte">Pasaporte</option>
                                </Form.Select>

                                <Form.Control
                                    type="text"
                                    name="cedula_pasaporte"
                                    value={nuevoHuesped.cedula_pasaporte || ""}
                                    onChange={handleDocumentoChange}
                                    placeholder={
                                        tipoDocumento === "cedula"
                                            ? "0000-000000-0000H"
                                            : "Pasaporte"
                                    }
                                    maxLength={
                                        tipoDocumento === "cedula"
                                            ? 15
                                            : 9
                                    }
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
                                    value={nuevoHuesped.lugar_origen || ""}
                                    onChange={handleTextoChange}
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
                    onClick={() => setMostrarModal(false)}
                >
                    Cancelar
                </Button>

                <Button
                    variant="primary"
                    onClick={handleAgregar}
                    disabled={deshabilitado}
                >
                    Guardar
                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalRegistroHuesped;