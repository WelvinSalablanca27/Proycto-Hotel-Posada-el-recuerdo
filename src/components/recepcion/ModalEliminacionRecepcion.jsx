import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionRecepcion = ({
    mostrarModalEliminacion,
    setMostrarModalEliminacion,
    eliminarRecepcionista,
    recepcionista,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleEliminar = async () => {
        if (deshabilitado) return;

        setDeshabilitado(true);
        await eliminarRecepcionista();
        setDeshabilitado(false);
    };

    return (
        <Modal
            show={mostrarModalEliminacion}
            onHide={() => setMostrarModalEliminacion(false)}
            backdrop="static"
            keyboard={false}
            centered
        >
            {/* ENCABEZADO */}
            <Modal.Header
                closeButton
                style={{
                    backgroundColor: "#003366",
                    color: "white",
                }}
            >
                <Modal.Title>
                    <i className="bi bi-trash-fill me-2"></i>
                    Confirmar Eliminación
                </Modal.Title>
            </Modal.Header>

            {/* CUERPO */}
            <Modal.Body
                style={{
                    backgroundColor: "#F8FCFF",
                    fontSize: "16px",
                }}
            >
                <div className="text-center">
                    <i
                        className="bi bi-exclamation-triangle-fill"
                        style={{
                            fontSize: "60px",
                            color: "#dc3545",
                        }}
                    ></i>

                    <h5
                        className="mt-3"
                        style={{
                            color: "#003366",
                        }}
                    >
                        ¿Desea eliminar este recepcionista?
                    </h5>

                    <p className="mt-3">
                        Nombre:
                        <strong>
                            {" "}
                            {recepcionista?.nombre} {recepcionista?.apellido}
                        </strong>
                    </p>

                    <p className="text-muted">
                        Esta acción no se puede deshacer.
                    </p>
                </div>
            </Modal.Body>

            {/* PIE */}
            <Modal.Footer
                style={{
                    backgroundColor: "#F8FCFF",
                }}
            >
                <Button
                    variant="secondary"
                    onClick={() => setMostrarModalEliminacion(false)}
                >
                    Cancelar
                </Button>

                <Button
                    variant="danger"
                    onClick={handleEliminar}
                    disabled={deshabilitado}
                >
                    <i className="bi bi-trash-fill me-2"></i>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminacionRecepcion;