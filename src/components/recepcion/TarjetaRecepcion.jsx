import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaRecepcion = ({
    recepcion,
    abrirModalEdicion,
    abrirModalEliminacion
}) => {

    const [cargando, setCargado] = useState(true);
    const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

    useEffect(() => {
        setCargado(!(recepcion && recepcion.length > 0));
    }, [recepcion]);

    const manejarTeclaEscape = useCallback((evento) => {
        if (evento.key === "Escape") {
            setIdTarjetaActiva(null);
        }
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", manejarTeclaEscape);

        return () =>
            window.removeEventListener(
                "keydown",
                manejarTeclaEscape
            );
    }, [manejarTeclaEscape]);

    const alternarTarjetaActiva = (id) => {
        setIdTarjetaActiva((anterior) =>
            anterior === id ? null : id
        );
    };

    return (
        <>
            {cargando ? (
                <div className="text-center my-5">
                    <h5>Cargando recepcionistas...</h5>

                    <Spinner
                        animation="border"
                        variant="primary"
                        role="status"
                    />
                </div>
            ) : (
                <div>
                    {recepcion.map((recepcionista) => {

                        const tarjetaActiva =
                            idTarjetaActiva ===
                            recepcionista.id_recepcionista;

                        return (
                            <Card
                                key={recepcionista.id_recepcionista}
                                className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-habitacion-contenedor"
                                onClick={() =>
                                    alternarTarjetaActiva(
                                        recepcionista.id_recepcionista
                                    )
                                }
                                tabIndex={0}
                                onKeyDown={(evento) => {
                                    if (
                                        evento.key === "Enter" ||
                                        evento.key === " "
                                    ) {
                                        evento.preventDefault();

                                        alternarTarjetaActiva(
                                            recepcionista.id_recepcionista
                                        );
                                    }
                                }}
                                aria-label={`Recepcionista ${recepcionista.nombre}`}
                            >
                                <Card.Body
                                    className={`p-3 tarjeta-habitacion-cuerpo ${
                                        tarjetaActiva
                                            ? "tarjeta-habitacion-cuerpo-activo"
                                            : "tarjeta-habitacion-cuerpo-inactivo"
                                    }`}
                                >
                                    <Row className="align-items-center gx-3">

                                        {/* Avatar */}
                                        <Col xs={2} className="px-2">
                                            <div
                                                className="d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                                                style={{
                                                    width: "60px",
                                                    height: "60px",
                                                    background:
                                                        "linear-gradient(135deg, #0d6efd, #6f42c1)"
                                                }}
                                            >
                                                <i className="bi bi-person-badge-fill text-white fs-3"></i>
                                            </div>
                                        </Col>

                                        {/* Información */}
                                        <Col xs={6} className="text-start">

                                            <div className="fw-bold text-dark text-truncate fs-6">
                                                <i className="bi bi-person-fill text-primary me-1"></i>
                                                {recepcionista.nombre}{" "}
                                                {recepcionista.apellido}
                                            </div>

                                            <div className="small text-truncate mt-1">
                                                <span className="fw-bold text-primary">
                                                    <i className="bi bi-calendar-event me-1"></i>
                                                    Fecha:
                                                </span>{" "}
                                                {recepcionista.fecha}
                                            </div>

                                            <div className="small text-truncate">
                                                <span className="fw-bold text-success">
                                                    <i className="bi bi-box-arrow-in-right me-1"></i>
                                                    Entrada:
                                                </span>{" "}
                                                {recepcionista.hora_entrada}
                                            </div>

                                            <div className="small text-truncate">
                                                <span className="fw-bold text-danger">
                                                    <i className="bi bi-box-arrow-right me-1"></i>
                                                    Salida:
                                                </span>{" "}
                                                {recepcionista.hora_salida}
                                            </div>

                                        </Col>

                                        {/* Turno e ID */}
                                        <Col
                                            xs={4}
                                            className="d-flex flex-column align-items-end justify-content-center text-end"
                                        >

                                            <div className="badge bg-primary fs-6 px-3 py-2 mb-2">
                                                <i className="bi bi-clock-fill me-1"></i>
                                                {recepcionista.turno}
                                            </div>

                                            <div className="small text-truncate">
                                                <span className="fw-bold text-secondary">
                                                    <i className="bi bi-hash me-1"></i>
                                                    ID:
                                                </span>{" "}
                                                {recepcionista.id_recepcionista}
                                            </div>

                                        </Col>

                                    </Row>
                                </Card.Body>

                                {tarjetaActiva && (
                                    <div
                                        role="dialog"
                                        aria-modal="true"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIdTarjetaActiva(null);
                                        }}
                                        className="tarjeta-habitacion-capa"
                                    >
                                        <div
                                            className="d-flex gap-2 tarjeta-habitacion-botones-capa"
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                        >
                                            <Button
                                                variant="outline-warning"
                                                size="sm"
                                                onClick={() => {
                                                    abrirModalEdicion(
                                                        recepcionista
                                                    );

                                                    setIdTarjetaActiva(null);
                                                }}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </Button>

                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => {
                                                    abrirModalEliminacion(
                                                        recepcionista
                                                    );

                                                    setIdTarjetaActiva(null);
                                                }}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default TarjetaRecepcion;