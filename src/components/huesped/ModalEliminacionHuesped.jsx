import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionHuesped = ({
    mostrarModalEliminacion,
    setMostrarModalEliminacion,
    eliminarHuesped,
    huesped,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleEliminar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true);
        await eliminarHuesped();
        setDeshabilitado(false);
    };

    return (
        <Modal
            show={mostrarModalEliminacion}
            onHide={() => setMostrarModalEliminacion(false)}
            backdrop="static"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                ¿Eliminar el huésped{" "}
                <strong>
                    {huesped?.primer_nombre} {huesped?.primer_apellido}
                </strong>
                ?
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => setMostrarModalEliminacion(false)}
                >
                    Cancelar
                </Button>

                <Button
                    variant="danger"
                    onClick={handleEliminar}
                    disabled={deshabilitado || !huesped}
                >
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminacionHuesped;