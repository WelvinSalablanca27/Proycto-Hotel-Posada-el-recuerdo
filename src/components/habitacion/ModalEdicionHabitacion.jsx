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

                    <i className="bi bi-door-open-fill"></i>

                    Editar Habitación

                </Modal.Title>

            </Modal.Header>

            {/* BODY */}
            <Modal.Body
                style={{
                    backgroundColor: "#f4f7ff",
                    padding: "30px"
                }}
            >

                {/* ESTADO */}
                <div className="mb-4 text-center">

                    <Badge
                        bg={
                            habitacionEditar?.estado === "Disponible"
                                ? "success"
                                : "danger"
                        }
                        style={{
                            fontSize: "15px",
                            padding: "10px 18px",
                            borderRadius: "20px"
                        }}
                    >

                        <i className="bi bi-house-door-fill me-2"></i>

                        {habitacionEditar?.estado || "Estado"}

                    </Badge>

                </div>

                <Form>

                    <Row>

                        {/* NUMERO */}
                        <Col md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Número Habitación
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="bi bi-hash"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="text"
                                        name="numero_habitacion"
                                        value={
                                            habitacionEditar?.numero_habitacion || ""
                                        }
                                        onChange={
                                            manejoCambioInputEdicion
                                        }
                                        placeholder="Número Habitación"
                                        style={{
                                            borderRadius:
                                                "0 10px 10px 0"
                                        }}
                                    />

                                </InputGroup>

                            </Form.Group>

                        </Col>

                        {/* TIPO */}
                        <Col md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Tipo Habitación
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="bi bi-building"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="text"
                                        name="tipo_habitacion"
                                        value={
                                            habitacionEditar?.tipo_habitacion || ""
                                        }
                                        onChange={
                                            manejoCambioInputEdicion
                                        }
                                        placeholder="Aire acondicionado o abanico"
                                        style={{
                                            borderRadius:
                                                "0 10px 10px 0"
                                        }}
                                    />

                                </InputGroup>

                            </Form.Group>

                        </Col>

                        {/* CAMAS */}
                        <Col md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Camas
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="bi bi-bed-fill"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="text"
                                        name="tipo_camas"
                                        value={
                                            habitacionEditar?.tipo_camas || ""
                                        }
                                        onChange={
                                            manejoCambioInputEdicion
                                        }
                                        placeholder="Ej: 2 camas"
                                        style={{
                                            borderRadius:
                                                "0 10px 10px 0"
                                        }}
                                    />

                                </InputGroup>

                            </Form.Group>

                        </Col>

                        {/* CLIMA */}
                        <Col md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Clima
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="bi bi-snow"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="text"
                                        name="tipo_clima"
                                        value={
                                            habitacionEditar?.tipo_clima || ""
                                        }
                                        onChange={
                                            manejoCambioInputEdicion
                                        }
                                        placeholder="Ej: Aire acondicionado"
                                        style={{
                                            borderRadius:
                                                "0 10px 10px 0"
                                        }}
                                    />

                                </InputGroup>

                            </Form.Group>

                        </Col>

                        {/* PRECIO */}
                        <Col md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Precio ($)
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="bi bi-cash-stack"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="precio"
                                        value={
                                            habitacionEditar?.precio || ""
                                        }
                                        onChange={
                                            manejoCambioInputEdicion
                                        }
                                        placeholder="Ej: 50.00"
                                        style={{
                                            borderRadius:
                                                "0 10px 10px 0",
                                            fontWeight: "600"
                                        }}
                                    />

                                </InputGroup>

                            </Form.Group>

                        </Col>

                        {/* ESTADO */}
                        <Col md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Estado
                                </Form.Label>

                                <Form.Select
                                    name="estado"
                                    value={
                                        habitacionEditar?.estado || ""
                                    }
                                    onChange={
                                        manejoCambioInputEdicion
                                    }
                                    style={{
                                        borderRadius: "10px",
                                        padding: "10px",
                                        border:
                                            habitacionEditar?.estado === "Disponible"
                                                ? "2px solid #198754"
                                                : "2px solid #dc3545",
                                        fontWeight: "600"
                                    }}
                                >

                                    <option value="">
                                        Seleccione estado
                                    </option>

                                    <option value="Disponible">
                                        Disponible
                                    </option>

                                    <option value="Ocupada">
                                        Ocupada
                                    </option>

                                    <option value="Mantenimiento">
                                        Mantenimiento
                                    </option>

                                </Form.Select>

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
                        !habitacionEditar?.numero_habitacion?.trim() ||
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

export default ModalEdicionHabitacion;