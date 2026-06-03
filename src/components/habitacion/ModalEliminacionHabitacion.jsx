import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionHabitacion = ({
    mostrarModalEliminacion,
    setMostrarModalEliminacion,
    eliminarHabitacion,
    habitacion,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleEliminar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true);
        await eliminarHabitacion();
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
            <Modal.Header closeButton>
                <Modal.Title>Confimar Eliminacion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                ¿Estás seguro de que deseas eliminar la Habitacion "<strong>{habitacion?.numero_habitacion}</strong>"?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secundary" onClick={() => setMostrarModalEliminacion(false)}>
                    Cancelar
                </Button>
                <Button
                    variant="danger"
                    onClick={handleEliminar}
                    disabled={deshabilitado}
                >
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminacionHabitacion;