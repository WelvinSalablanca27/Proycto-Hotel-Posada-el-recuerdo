import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaReserva = ({
    reservas,
    abrirModalEdicion,
    abrirModalEliminacion
}) => {

    const [cargando, setCargando] = useState(true);
    const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

    useEffect(() => {
        setCargando(!(reservas && reservas.length > 0));
    }, [reservas]);

    const manejarTeclaEscape = useCallback((evento) => {
        if (evento.key === "Escape") {
            setIdTarjetaActiva(null);
        }
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", manejarTeclaEscape);
        return () => {
            window.removeEventListener("keydown", manejarTeclaEscape);
        };
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
                    <h5>Cargando reservas...</h5>
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <div>
                    {reservas.map((reserva) => {

                        const tarjetaActiva =
                            idTarjetaActiva === reserva.id_reserva;

                        return (
                            <Card
                                key={reserva.id_reserva}
                                className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-reserva-contenedor"
                                onClick={() =>
                                    alternarTarjetaActiva(reserva.id_reserva)
                                }
                                tabIndex={0}
                                onKeyDown={(evento) => {
                                    if (
                                        evento.key === "Enter" ||
                                        evento.key === " "
                                    ) {
                                        evento.preventDefault();
                                        alternarTarjetaActiva(reserva.id_reserva);
                                    }
                                }}
                                aria-label={`Reserva ${reserva.id_reserva}`}
                            >
                                <Card.Body
                                    className={`p-3 tarjeta-reserva-cuerpo ${
                                        tarjetaActiva
                                            ? "tarjeta-reserva-cuerpo-activo"
                                            : "tarjeta-reserva-cuerpo-inactivo"
                                    }`}
                                >
                                    <Row className="align-items-center gx-3">

                                        {/* ICONO */}
                                        <Col xs={2} className="px-2">
                                            <div
                                                className="bg-light d-flex align-items-center justify-content-center rounded"
                                                style={{
                                                    width: "60px",
                                                    height: "60px"
                                                }}
                                            >
                                                <i className="bi bi-calendar-check text-primary fs-3"></i>
                                            </div>
                                        </Col>

                                        {/* INFORMACIÓN */}
                                        <Col xs={7} className="text-start">

                                            {/* HUÉSPED */}
                                            <div className="fw-semibold text-truncate">
                                                Huésped:{" "}
                                                {reserva.huesped?.primer_nombre}{" "}
                                                {reserva.huesped?.primer_apellido}
                                            </div>

                                            {/* HABITACIÓN */}
                                            <div className="small text-muted text-truncate">
                                                Habitación:{" "}
                                                #{reserva.habitacion?.numero_habitacion}
                                            </div>

                                            {/* PAGO */}
                                            <div className="small text-muted">
                                                Pago: {reserva.forma_pago}
                                            </div>

                                            {/* HORAS */}
                                            <div className="small text-muted">
                                                Entrada: {reserva.hora_entrada} {" | "}
                                                Salida: {reserva.hora_salida}
                                            </div>

                                        </Col>

                                        {/* MONTO */}
                                        <Col
                                            xs={3}
                                            className="d-flex flex-column align-items-end justify-content-center text-end"
                                        >
                                            <div className="badge bg-success mb-2">
                                                Activa
                                            </div>

                                            <div className="fw-bold text-success">
                                                ${reserva.monto}
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>

                                {/* BOTONES */}
                                {tarjetaActiva && (
                                    <div
                                        role="dialog"
                                        aria-modal="true"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIdTarjetaActiva(null);
                                        }}
                                        className="tarjeta-reserva-capa"
                                    >
                                        <div
                                            className="d-flex gap-2 tarjeta-reserva-botones-capa"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button
                                                variant="outline-warning"
                                                size="sm"
                                                onClick={() => {
                                                    abrirModalEdicion(reserva);
                                                    setIdTarjetaActiva(null);
                                                }}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </Button>

                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => {
                                                    abrirModalEliminacion(reserva);
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

export default TarjetaReserva;