import React, { useState } from "react";
import {
    Modal,
    Form,
    Button,
    Row,
    Col,
    InputGroup,
    Badge
} from "react-bootstrap";

import "bootstrap-icons/font/bootstrap-icons.css";

const ModalEdicionRecepcionista = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    recepcionistaEditar,
    manejoCambioInputEdicion,
    actualizarRecepcionista,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleActualizar = async () => {

        if (deshabilitado) return;

        setDeshabilitado(true);

        await actualizarRecepcionista();

        setDeshabilitado(false);

    };

    // COLOR SEGÚN TURNO
    const colorTurno =
        recepcionistaEditar?.turno === "Mañana"
            ? "warning"
            : recepcionistaEditar?.turno === "Tarde"
                ? "primary"
                : recepcionistaEditar?.turno === "Noche"
                    ? "dark"
                    : "secondary";

    return (

        <Modal
            show={mostrarModalEdicion}
            onHide={() => setMostrarModalEdicion(false)}
            backdrop="static"
            keyboard={false}
            centered
            size="lg"
        >

            {/* HEADER */}
            <Modal.Header
                closeButton
                style={{
                    background:
                        "linear-gradient(135deg, #0019d4, #0048ff)",
                    color: "#fff",
                    borderBottom: "none"
                }}
            >

                <Modal.Title
                    className="fw-bold d-flex align-items-center gap-2"
                >

                    <i className="bi bi-person-badge-fill"></i>

                    Editar Recepcionista

                </Modal.Title>

            </Modal.Header>

            {/* BODY */}
            <Modal.Body
                style={{
                    backgroundColor: "#f4f7ff",
                    padding: "30px"
                }}
            >

                {/* BADGE TURNO */}
                <div className="text-center mb-4">

                    <Badge
                        bg={colorTurno}
                        style={{
                            fontSize: "15px",
                            padding: "10px 18px",
                            borderRadius: "20px"
                        }}
                    >

                        <i className="bi bi-clock-fill me-2"></i>

                        {recepcionistaEditar?.turno || "Sin Turno"}

                    </Badge>

                </div>

                <Form>

                    <Row>

                        {/* NOMBRE */}
                        <Col md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Nombre
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="bi bi-person-fill"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={
                                            recepcionistaEditar?.nombre || ""
                                        }
                                        onChange={
                                            manejoCambioInputEdicion
                                        }
                                        placeholder="Ingrese el nombre"
                                        style={{
                                            borderRadius:
                                                "0 10px 10px 0"
                                        }}
                                    />

                                </InputGroup>

                            </Form.Group>

                        </Col>

                        {/* APELLIDO */}
                        <Col md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Apellido
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="bi bi-person-vcard-fill"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="text"
                                        name="apellido"
                                        value={
                                            recepcionistaEditar?.apellido || ""
                                        }
                                        onChange={
                                            manejoCambioInputEdicion
                                        }
                                        placeholder="Ingrese el apellido"
                                        style={{
                                            borderRadius:
                                                "0 10px 10px 0"
                                        }}
                                    />

                                </InputGroup>

                            </Form.Group>

                        </Col>

                        {/* FECHA */}
                        <Col md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Fecha
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="bi bi-calendar-event-fill"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="date"
                                        name="fecha"
                                        value={
                                            recepcionistaEditar?.fecha || ""
                                        }
                                        onChange={
                                            manejoCambioInputEdicion
                                        }
                                        style={{
                                            borderRadius:
                                                "0 10px 10px 0"
                                        }}
                                    />

                                </InputGroup>

                            </Form.Group>

                        </Col>

                        {/* TURNO */}
                        <Col md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Turno
                                </Form.Label>

                                <Form.Select
                                    name="turno"
                                    value={
                                        recepcionistaEditar?.turno || ""
                                    }
                                    onChange={
                                        manejoCambioInputEdicion
                                    }
                                    style={{
                                        borderRadius: "10px",
                                        padding: "10px",
                                        border:
                                            recepcionistaEditar?.turno === "Mañana"
                                                ? "2px solid #ffc107"
                                                : recepcionistaEditar?.turno === "Tarde"
                                                    ? "2px solid #0d6efd"
                                                    : recepcionistaEditar?.turno === "Noche"
                                                        ? "2px solid #212529"
                                                        : "2px solid #ced4da",
                                        fontWeight: "600"
                                    }}
                                >

                                    <option value="">
                                        Seleccione un turno
                                    </option>

                                    <option value="Mañana">
                                        Mañana
                                    </option>

                                    <option value="Tarde">
                                        Tarde
                                    </option>

                                    <option value="Noche">
                                        Noche
                                    </option>

                                </Form.Select>

                            </Form.Group>

                        </Col>

                        {/* HORA ENTRADA */}
                        <Col md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Hora Entrada
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="bi bi-box-arrow-in-right"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="time"
                                        name="hora_entrada"
                                        value={
                                            recepcionistaEditar?.hora_entrada || ""
                                        }
                                        onChange={
                                            manejoCambioInputEdicion
                                        }
                                        style={{
                                            borderRadius:
                                                "0 10px 10px 0"
                                        }}
                                    />

                                </InputGroup>

                            </Form.Group>

                        </Col>

                        {/* HORA SALIDA */}
                        <Col md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Hora Salida
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="bi bi-box-arrow-right"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="time"
                                        name="hora_salida"
                                        value={
                                            recepcionistaEditar?.hora_salida || ""
                                        }
                                        onChange={
                                            manejoCambioInputEdicion
                                        }
                                        style={{
                                            borderRadius:
                                                "0 10px 10px 0"
                                        }}
                                    />

                                </InputGroup>

                            </Form.Group>

                        </Col>
                    </Row>

                </Form>

            </Modal.Body>

            {/* FOOTER */}
            <Modal.Footer
                style={{
                    backgroundColor: "#eef3ff",
                    borderTop: "none"
                }}
            >

                <Button
                    variant="outline-secondary"
                    onClick={() =>
                        setMostrarModalEdicion(false)
                    }
                    style={{
                        borderRadius: "10px",
                        padding: "8px 20px",
                        fontWeight: "600"
                    }}
                >

                    <i className="bi bi-x-circle me-2"></i>

                    Cancelar

                </Button>

                <Button
                    variant="primary"
                    onClick={handleActualizar}
                    disabled={
                        !recepcionistaEditar?.nombre?.trim() ||
                        deshabilitado
                    }
                    style={{
                        borderRadius: "10px",
                        padding: "8px 20px",
                        fontWeight: "600",
                        boxShadow:
                            "0 4px 10px rgba(0,0,0,0.15)"
                    }}
                >

                    <i className="bi bi-check-circle me-2"></i>

                    {deshabilitado
                        ? "Actualizando..."
                        : "Actualizar"}

                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalEdicionRecepcionista;