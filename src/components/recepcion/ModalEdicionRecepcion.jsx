import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

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

    return (
        <Modal
            show={mostrarModalEdicion}
            onHide={() => setMostrarModalEdicion(false)}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Editar Recepcionista</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>

                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            value={recepcionistaEditar?.nombre || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Ingrese el nombre"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Apellido</Form.Label>
                        <Form.Control
                            type="text"
                            name="apellido"
                            value={recepcionistaEditar?.apellido || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Ingrese el apellido"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha"
                            value={recepcionistaEditar?.fecha || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Hora Entrada</Form.Label>
                        <Form.Control
                            type="time"
                            name="hora_entrada"
                            value={recepcionistaEditar?.hora_entrada || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Hora Salida</Form.Label>
                        <Form.Control
                            type="time"
                            name="hora_salida"
                            value={recepcionistaEditar?.hora_salida || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Turno</Form.Label>
                        <Form.Select
                            name="turno"
                            value={recepcionistaEditar?.turno || ""}
                            onChange={manejoCambioInputEdicion}
                        >
                            <option value="">Seleccione un turno</option>
                            <option value="Mañana">Mañana</option>
                            <option value="Tarde">Tarde</option>
                            <option value="Noche">Noche</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Función</Form.Label>
                        <Form.Control
                            type="text"
                            name="funcion"
                            value={recepcionistaEditar?.funcion || ""}
                            onChange={manejoCambioInputEdicion}
                            placeholder="Ej: Gestión de reservas"
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
                        !recepcionistaEditar?.nombre?.trim() ||
                        deshabilitado
                    }
                >
                    Actualizar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionRecepcionista;