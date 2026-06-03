import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionReserva = ({
    mostrarModalEliminacion,
    setMostrarModalEliminacion,
    eliminarReserva,
    reserva,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleEliminar = async () => {
        if (deshabilitado) return;

        setDeshabilitado(true);
        await eliminarReserva();
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
                <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                ¿Estás seguro de que deseas eliminar la reserva
                del huésped{" "}
                <strong>
                    {reserva?.huesped_nombre || reserva?.id_huesped}
                </strong>
                {" "}para la habitación{" "}
                <strong>
                    {reserva?.numero_habitacion || reserva?.id_habitacion}
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
                    disabled={deshabilitado}
                >
                    Eliminar
                </Button>

            </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminacionReserva;