import React from "react";
import { Card, Button } from "react-bootstrap";

const TarjetaRecepcion = ({
    recepcionistas,
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {
    return (
        <>
            {recepcionistas.map((r) => (
                <Card
                    key={r.id_recepcionista}
                    className="mb-3 shadow-sm"
                    style={{
                        border: "2px solid #87CEEB",
                        backgroundColor: "#F8FCFF",
                        borderRadius: "15px",
                    }}
                >
                    <Card.Header
                        style={{
                            backgroundColor: "#003366",
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        <i className="bi bi-person-badge-fill me-2"></i>
                        {r.nombre} {r.apellido}
                    </Card.Header>

                    <Card.Body>
                        <p><strong>Fecha:</strong> {r.fecha}</p>
                        <p><strong>Hora Entrada:</strong> {r.hora_entrada}</p>
                        <p><strong>Hora Salida:</strong> {r.hora_salida}</p>
                        <p><strong>Turno:</strong> {r.turno}</p>
                        <p><strong>Función:</strong> {r.funcion}</p>

                        <div className="d-flex justify-content-end gap-2">
                            <Button
                                variant="warning"
                                size="sm"
                                onClick={() => abrirModalEdicion(r)}
                            >
                                <i className="bi bi-pencil-fill"></i>
                            </Button>

                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => abrirModalEliminacion(r)}
                            >
                                <i className="bi bi-trash-fill"></i>
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </>
    );
};

export default TarjetaRecepcion;