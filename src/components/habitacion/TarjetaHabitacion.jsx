import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaHabitacion = ({
    habitacion,
    abrirModalEdicion,
    abrirModalEliminacion
}) => {

    const [cargando, setCargado] = useState(true);
    const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

    useEffect(() => {
        setCargado(!(habitacion && habitacion.length > 0));
    }, [habitacion]);

    const manejarTeclaEscape = useCallback((evento) => {
        if (evento.key === "Escape") setIdTarjetaActiva(null);
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", manejarTeclaEscape);
        return () => window.removeEventListener("keydown", manejarTeclaEscape);
    }, [manejarTeclaEscape]);

    const alternarTarjetaActiva = (id) => {
        setIdTarjetaActiva((anterior) => (anterior === id ? null : id));
    };

    return (
        <>
            {cargando ? (
                <div className="text-center my-5">
                    <h5>Cargando habitaciones...</h5>
                    <Spinner animation="border" variant="success" role="status" />
                </div>
            ) : (
                <div>
                    {habitacion.map((habitacion) => {

                        const tarjetaActiva =
                            idTarjetaActiva === habitacion.id_habitacion;

                        return (
                            <Card
                                key={habitacion.id_habitacion}
                                className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-habitacion-contenedor"
                                onClick={() => alternarTarjetaActiva(habitacion.id_habitacion)}
                                tabIndex={0}
                                onKeyDown={(evento) => {
                                    if (evento.key === "Enter" || evento.key === " ") {
                                        evento.preventDefault();
                                        alternarTarjetaActiva(habitacion.id_habitacion);
                                    }
                                }}
                                aria-label={`Habitacion ${habitacion.numero_habitacion}`}
                            >
                                <Card.Body
                                    className={`p-2 tarjeta-habitacion-cuerpo ${tarjetaActiva
                                        ? "tarjeta-habitacion-cuerpo-activo"
                                        : "tarjeta-habitacion-cuerpo-inactivo"
                                        }`}
                                >
                                    <Row className="align-items-center gx-3">
                                        <Col xs={2} className="px-2">
                                            <div
                                                className="big-light d-flex align-items-center justify-content-center rounded tarjeta-habitacion-placeholder-imagen"
                                            >
                                                <i className="bi bi-bookmark text-muted fs-3"></i>
                                            </div>
                                        </Col>

                                        <Col xs={5} className="text-start">
                                            <div className="fs-semibold text-truncate">
                                                {habitacion.numero_habitacion}
                                            </div>

                                            <div className="small text-muted text-truncate">
                                                {habitacion.tipo_habitacion}
                                            </div>

                                            <div className="small text-muted text-truncate">
                                                {habitacion.tipo_camas}
                                            </div>

                                            <div className="small text-muted text-truncate">
                                                {habitacion.tipo_clima}
                                            </div>

                                            <div className="small text-muted text-truncate">
                                                ${habitacion.precio}
                                            </div>
                                        </Col>

                                        <Col
                                            xs={5}
                                            className="d-flex flex-column align-items-end justify-content-center text-end"
                                        >
                                            <div
                                                className={`badge ${habitacion.estado.toLowerCase() === "ocupada"
                                                        ? "bg-danger"
                                                        : habitacion.estado.toLowerCase() === "disponible"
                                                            ? "bg-success"
                                                            : "bg-secondary"
                                                    }`}
                                            >
                                                {habitacion.estado}
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
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button
                                                variant="outline-warning"
                                                size="sm"
                                                onClick={() => {
                                                    abrirModalEdicion(habitacion);
                                                    setIdTarjetaActiva(null);
                                                }}
                                                aria-label={`Editar ${habitacion.numero_habitacion}`}
                                            >
                                                <i className="bi bi-pencil"></i>

                                            </Button>

                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => {
                                                    abrirModalEliminacion(habitacion);
                                                    setIdTarjetaActiva(null);
                                                }}
                                                aria-label={`Eliminar ${habitacion.numero_habitacion}`}
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

export default TarjetaHabitacion;