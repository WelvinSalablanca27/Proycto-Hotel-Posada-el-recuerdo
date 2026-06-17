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

const ModalEdicionHuesped = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    huespedEditado,
    manejoCambioInput,
    actualizarHuesped,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    // Detectar tipo documento
    const documento =
        huespedEditado.cedula_pasaporte || "";

    const esCedula = documento.includes("-");

    const tipoDocumento = esCedula
        ? "Cédula"
        : "Pasaporte";

    const colorDocumento = esCedula
        ? "primary"
        : "success";

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

            {/* HEADER */}
            <Modal.Header
                closeButton
                style={{
                    background:
                        "linear-gradient(135deg, #0019d4, #005eff)",
                    color: "#fff",
                    borderBottom: "none"
                }}
            >

                <Modal.Title
                    className="fw-bold d-flex align-items-center gap-2"
                >

                    <i className="bi bi-person-lines-fill"></i>

                    Editar Huésped

                </Modal.Title>

            </Modal.Header>

            {/* BODY */}
            <Modal.Body
                style={{
                    backgroundColor: "#f8f9fc",
                    padding: "25px"
                }}
            >

                {/* Tipo Documento */}
                <div className="mb-4 text-center">

                    <Badge
                        bg={colorDocumento}
                        style={{
                            fontSize: "15px",
                            padding: "10px 18px",
                            borderRadius: "20px"
                        }}
                    >

                        <i className="bi bi-credit-card me-2"></i>

                        {tipoDocumento}

                    </Badge>

                </div>

                <Form>

                    <Row>

                        {/* Primer Nombre */}
                        <Col xs={12} md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Primer Nombre *
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="bi bi-person"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="text"
                                        name="primer_nombre"
                                        value={
                                            huespedEditado.primer_nombre || ""
                                        }
                                        onChange={manejoCambioInput}
                                        placeholder="Primer nombre"
                                        required
                                        style={{
                                            borderRadius: "0 10px 10px 0"
                                        }}
                                    />

                                </InputGroup>

                            </Form.Group>

                        </Col>

                        {/* Segundo Nombre */}
                        <Col xs={12} md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Segundo Nombre
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="bi bi-person"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="text"
                                        name="segundo_nombre"
                                        value={
                                            huespedEditado.segundo_nombre || ""
                                        }
                                        onChange={manejoCambioInput}
                                        placeholder="Segundo nombre"
                                        style={{
                                            borderRadius: "0 10px 10px 0"
                                        }}
                                    />

                                </InputGroup>

                            </Form.Group>

                        </Col>

                        {/* Primer Apellido */}
                        <Col xs={12} md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Primer Apellido *
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="bi bi-person-vcard"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="text"
                                        name="primer_apellido"
                                        value={
                                            huespedEditado.primer_apellido || ""
                                        }
                                        onChange={manejoCambioInput}
                                        placeholder="Primer apellido"
                                        required
                                        style={{
                                            borderRadius: "0 10px 10px 0"
                                        }}
                                    />

                                </InputGroup>

                            </Form.Group>

                        </Col>

                        {/* Segundo Apellido */}
                        <Col xs={12} md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Segundo Apellido
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="bi bi-person-vcard"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="text"
                                        name="segundo_apellido"
                                        value={
                                            huespedEditado.segundo_apellido || ""
                                        }
                                        onChange={manejoCambioInput}
                                        placeholder="Segundo apellido"
                                        style={{
                                            borderRadius: "0 10px 10px 0"
                                        }}
                                    />

                                </InputGroup>

                            </Form.Group>

                        </Col>

                        {/* Documento */}
                        <Col xs={12} md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">

                                    {tipoDocumento} *

                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text
                                        style={{
                                            backgroundColor:
                                                esCedula
                                                    ? "#0d6efd"
                                                    : "#198754",
                                            color: "#fff",
                                            border: "none"
                                        }}
                                    >

                                        <i className="bi bi-credit-card"></i>

                                    </InputGroup.Text>

                                    <Form.Control
                                        type="text"
                                        name="cedula_pasaporte"
                                        value={
                                            huespedEditado.cedula_pasaporte || ""
                                        }
                                        onChange={manejoCambioInput}
                                        placeholder={
                                            esCedula
                                                ? "000-000000-0000"
                                                : "Número de pasaporte"
                                        }
                                        required
                                        style={{
                                            border:
                                                esCedula
                                                    ? "2px solid #0d6efd"
                                                    : "2px solid #198754",
                                            borderRadius: "0 10px 10px 0",
                                            fontWeight: "600"
                                        }}
                                    />

                                </InputGroup>

                            </Form.Group>

                        </Col>

                        {/* Lugar Origen */}
                        <Col xs={12} md={6}>

                            <Form.Group className="mb-4">

                                <Form.Label className="fw-semibold">
                                    Lugar de Origen *
                                </Form.Label>

                                <InputGroup>

                                    <InputGroup.Text>
                                        <i className="bi bi-geo-alt"></i>
                                    </InputGroup.Text>

                                    <Form.Control
                                        type="text"
                                        name="lugar_origen"
                                        value={
                                            huespedEditado.lugar_origen || ""
                                        }
                                        onChange={manejoCambioInput}
                                        placeholder="Lugar de origen"
                                        required
                                        style={{
                                            borderRadius: "0 10px 10px 0"
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
                    backgroundColor: "#f1f4ff",
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
                    variant={esCedula ? "primary" : "success"}
                    onClick={handleActualizar}
                    disabled={deshabilitado}
                    style={{
                        borderRadius: "10px",
                        padding: "8px 20px",
                        fontWeight: "600",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
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

export default ModalEdicionHuesped;