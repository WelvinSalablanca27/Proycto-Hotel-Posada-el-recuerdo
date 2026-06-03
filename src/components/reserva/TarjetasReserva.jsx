import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaReserva = ({
    reservas,
    abrirModalEdicion,
    abrirModalEliminacion
}) => {

    // 🔹 Controla si todavía está cargando la información
    const [cargando, setCargando] = useState(true);

    // 🔹 Guarda el ID de la tarjeta actualmente activa
    // Sirve para mostrar los botones editar/eliminar
    const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

    // 🔹 Cuando llegan las reservas deja de mostrar el spinner
    useEffect(() => {
        setCargando(!(reservas && reservas.length > 0));
    }, [reservas]);

    // 🔹 Cierra la tarjeta activa cuando se presiona ESC
    const manejarTeclaEscape = useCallback((evento) => {
        if (evento.key === "Escape") {
            setIdTarjetaActiva(null);
        }
    }, []);

    // 🔹 Agrega el listener del teclado
    useEffect(() => {
        window.addEventListener("keydown", manejarTeclaEscape);

        return () => {
            window.removeEventListener("keydown", manejarTeclaEscape);
        };
    }, [manejarTeclaEscape]);

    // 🔹 Activa o desactiva la tarjeta seleccionada
    const alternarTarjetaActiva = (id) => {
        setIdTarjetaActiva((anterior) =>
            anterior === id ? null : id
        );
    };

    return (
        <>
            {cargando ? (

                // 🔹 Pantalla de carga
                <div className="text-center my-5">
                    <h5>Cargando reservas...</h5>

                    <Spinner
                        animation="border"
                        variant="primary"
                        role="status"
                    />
                </div>

            ) : (

                // 🔹 Contenedor de tarjetas
                <div>

                    {reservas.map((reserva) => {

                        // 🔹 Verifica si esta tarjeta está activa
                        const tarjetaActiva =
                            idTarjetaActiva === reserva.id_reserva;

                        return (

                            <Card
                                key={reserva.id_reserva}

                                className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-reserva-contenedor"

                                // 🔹 Al hacer click activa/desactiva
                                onClick={() =>
                                    alternarTarjetaActiva(
                                        reserva.id_reserva
                                    )
                                }

                                tabIndex={0}

                                // 🔹 Permite activar con ENTER o ESPACIO
                                onKeyDown={(evento) => {

                                    if (
                                        evento.key === "Enter" ||
                                        evento.key === " "
                                    ) {
                                        evento.preventDefault();

                                        alternarTarjetaActiva(
                                            reserva.id_reserva
                                        );
                                    }
                                }}

                                aria-label={`Reserva ${reserva.id_reserva}`}
                            >

                                <Card.Body
                                    className={`p-3 tarjeta-reserva-cuerpo ${tarjetaActiva
                                            ? "tarjeta-reserva-cuerpo-activo"
                                            : "tarjeta-reserva-cuerpo-inactivo"
                                        }`}
                                >

                                    <Row className="align-items-center gx-3">

                                        {/* 🔹 ICONO */}
                                        <Col xs={2} className="px-2">

                                            <div
                                                className="bg-light d-flex align-items-center justify-content-center rounded tarjeta-reserva-placeholder-imagen"
                                                style={{
                                                    width: "60px",
                                                    height: "60px"
                                                }}
                                            >
                                                <i className="bi bi-calendar-check text-primary fs-3"></i>
                                            </div>

                                        </Col>

                                        {/* 🔹 INFORMACIÓN */}
                                        <Col xs={7} className="text-start">

                                            {/* Huésped */}
                                            <div className="fw-semibold text-truncate">
                                                Huésped:
                                                {" "}
                                                {reserva.huesped_nombre}
                                            </div>

                                            {/* Habitación */}
                                            <div className="small text-muted text-truncate">
                                                Habitación:
                                                {" "}
                                                #{reserva.numero_habitacion}
                                            </div>

                                            {/* Pago */}
                                            <div className="small text-muted">
                                                Pago:
                                                {" "}
                                                {reserva.forma_pago}
                                            </div>

                                            {/* Hora */}
                                            <div className="small text-muted">
                                                Entrada:
                                                {" "}
                                                {reserva.hora_entrada}
                                                {" | "}
                                                Salida:
                                                {" "}
                                                {reserva.hora_salida}
                                            </div>

                                        </Col>

                                        {/* 🔹 ESTADO / MONTO */}
                                        <Col
                                            xs={3}
                                            className="d-flex flex-column align-items-end justify-content-center text-end"
                                        >

                                            <div className="badge bg-success mb-2">
                                                Activa
                                            </div>

                                            <div className="fw-bold text-success">
                                                $
                                                {reserva.monto_total}
                                            </div>

                                        </Col>

                                    </Row>

                                </Card.Body>

                                {/* 🔹 CAPA DE BOTONES */}
                                {tarjetaActiva && (

                                    <div
                                        role="dialog"
                                        aria-modal="true"

                                        // 🔹 Cierra la capa al hacer click fuera
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIdTarjetaActiva(null);
                                        }}

                                        className="tarjeta-reserva-capa"
                                    >

                                        <div
                                            className="d-flex gap-2 tarjeta-reserva-botones-capa"

                                            // 🔹 Evita cerrar al hacer click dentro
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                        >

                                            {/* 🔹 BOTÓN EDITAR */}
                                            <Button
                                                variant="outline-warning"
                                                size="sm"

                                                onClick={() => {
                                                    abrirModalEdicion(reserva);
                                                    setIdTarjetaActiva(null);
                                                }}

                                                aria-label={`Editar reserva ${reserva.id_reserva}`}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </Button>

                                            {/* 🔹 BOTÓN ELIMINAR */}
                                            <Button
                                                variant="outline-danger"
                                                size="sm"

                                                onClick={() => {
                                                    abrirModalEliminacion(reserva);
                                                    setIdTarjetaActiva(null);
                                                }}

                                                aria-label={`Eliminar reserva ${reserva.id_reserva}`}
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