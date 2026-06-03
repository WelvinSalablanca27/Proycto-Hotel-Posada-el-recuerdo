import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

// 🔍 Buscador y paginación
import CuadrosBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

// 📦 Modales y componentes de Reserva
import ModalRegistroReserva from "../components/reserva/ModalRegistroReserva";
import ModalEdicionReserva from "../components/reserva/ModalEdicionReserva";
import ModalEliminacionReserva from "../components/reserva/ModalEliminacionReserva";

import NotificacionOperacion from "../components/NotificacionOperacion";

// 📊 Tabla y tarjetas
import TarjetaReserva from "../components/reserva/TarjetasReserva";
// import TablaReserva from "../components/reserva/TablaReserva";

const Reserva = () => {

    // 🔔 Toast
    const [toast, setToast] = useState({
        mostrar: false,
        mensaje: "",
        tipo: "",
    });

    // 📌 Estados modales
    const [mostrarModal, setMostrarModal] = useState(false);

    const [mostrarModalEdicion, setMostrarModalEdicion] =
        useState(false);

    const [mostrarModalEliminacion, setMostrarModalEliminacion] =
        useState(false);

    // 📊 Reservas
    const [reservas, setReservas] = useState([]);

    const [cargando, setCargando] = useState(true);

    // 🗑️ Reserva a eliminar
    const [reservaAEliminar, setReservaAEliminar] =
        useState(null);

    // 🔍 Busqueda
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [reservasFiltradas, setReservasFiltradas] =
        useState([]);

    // 📄 Paginación
    const [registrosPorPagina, establecerRegistrosPorPagina] =
        useState(5);

    const [paginaActual, establecerPaginaActual] =
        useState(1);

    // 📌 Slice paginado
    const reservasPaginadas = reservasFiltradas.slice(
        (paginaActual - 1) * registrosPorPagina,
        paginaActual * registrosPorPagina
    );

    // ✏️ Estado editar
    const [reservaEditar, setReservaEditar] = useState({
        id_reserva: "",
        id_huesped: "",
        id_habitacion: "",
        id_empleado: "",
        id_tiempo: "",
        monto_total: "",
        forma_pago: "",
        hora_entrada: "",
        hora_salida: "",
    });

    // ➕ Nueva reserva
    const [nuevaReserva, setNuevaReserva] = useState({
        id_huesped: "",
        id_habitacion: "",
        id_empleado: "",
        id_tiempo: "",
        monto_total: "",
        forma_pago: "",
        hora_entrada: "",
        hora_salida: "",
    });

    // 🚀 Cargar reservas
    useEffect(() => {
        cargarReservas();
    }, []);

    // 🔎 Filtrado
    useEffect(() => {

        if (!textoBusqueda.trim()) {

            setReservasFiltradas(reservas);

        } else {

            const textoLower =
                textoBusqueda.toLowerCase().trim();

            const filtradas = reservas.filter((r) =>

                r.forma_pago?.toLowerCase().includes(textoLower)
                ||
                r.monto_total?.toString().includes(textoLower)
                ||
                r.id_reserva?.toString().includes(textoLower)
            );

            setReservasFiltradas(filtradas);
        }

    }, [textoBusqueda, reservas]);

    // 🔍 Input búsqueda
    const manejoBusqueda = (e) => {
        setTextoBusqueda(e.target.value);
    };

    // 📥 Cargar desde Supabase
    const cargarReservas = async () => {

        try {

            setCargando(true);

            const { data, error } = await supabase
                .from("reserva")
                .select("*")
                .order("id_reserva", {
                    ascending: true
                });

            if (error) {

                console.error(error.message);

                setToast({
                    mostrar: true,
                    mensaje: "Error al cargar reservas",
                    tipo: "error",
                });

                return;
            }

            setReservas(data || []);

        } catch (err) {

            console.error(err.message);

        } finally {

            setCargando(false);
        }
    };

    // ➕ Agregar reserva
    const agregarReserva = async () => {

        try {

            const { error } = await supabase
                .from("reserva")
                .insert([nuevaReserva]);

            if (error) {

                console.error(error.message);

                setToast({
                    mostrar: true,
                    mensaje: "Error al registrar reserva",
                    tipo: "error",
                });

                return;
            }

            await cargarReservas();

            setToast({
                mostrar: true,
                mensaje: "Reserva registrada correctamente",
                tipo: "exito",
            });

            setMostrarModal(false);

        } catch (err) {

            console.error(err.message);
        }
    };

    // ✏️ Abrir edición
    const abrirModalEdicion = (reserva) => {

        setReservaEditar({
            id_reserva: reserva.id_reserva,
            id_huesped: reserva.id_huesped,
            id_habitacion: reserva.id_habitacion,
            id_empleado: reserva.id_empleado,
            id_tiempo: reserva.id_tiempo,
            monto_total: reserva.monto_total,
            forma_pago: reserva.forma_pago,
            hora_entrada: reserva.hora_entrada,
            hora_salida: reserva.hora_salida,
        });

        setMostrarModalEdicion(true);
    };

    // ✏️ Actualizar reserva
    const actualizarReserva = async () => {

        try {

            const { error } = await supabase
                .from("reserva")
                .update({
                    id_huesped: reservaEditar.id_huesped,
                    id_habitacion: reservaEditar.id_habitacion,
                    id_empleado: reservaEditar.id_empleado,
                    id_tiempo: reservaEditar.id_tiempo,
                    monto_total: reservaEditar.monto_total,
                    forma_pago: reservaEditar.forma_pago,
                    hora_entrada: reservaEditar.hora_entrada,
                    hora_salida: reservaEditar.hora_salida,
                })

                .eq(
                    "id_reserva",
                    reservaEditar.id_reserva
                );

            if (error) {

                console.error(error.message);

                setToast({
                    mostrar: true,
                    mensaje: "Error al actualizar reserva",
                    tipo: "error",
                });

                return;
            }

            await cargarReservas();

            setToast({
                mostrar: true,
                mensaje: "Reserva actualizada correctamente",
                tipo: "exito",
            });

            setMostrarModalEdicion(false);

        } catch (err) {

            console.error(err.message);
        }
    };

    // 🗑️ Abrir modal eliminar
    const abrirModalEliminacion = (reserva) => {

        setReservaAEliminar(reserva);

        setMostrarModalEliminacion(true);
    };

    // 🗑️ Eliminar reserva
    const eliminarReserva = async () => {

        try {

            const { error } = await supabase
                .from("reserva")
                .delete()
                .eq(
                    "id_reserva",
                    reservaAEliminar.id_reserva
                );

            if (error) {

                console.error(error.message);

                return;
            }

            await cargarReservas();

            setToast({
                mostrar: true,
                mensaje: "Reserva eliminada",
                tipo: "exito",
            });

            setMostrarModalEliminacion(false);

        } catch (err) {

            console.error(err.message);
        }
    };

    // ✍️ Inputs registro
    const manejoCambioInput = (e) => {

        const { name, value } = e.target;

        setNuevaReserva((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ✍️ Inputs edición
    const manejoCambioInputEdicion = (e) => {

        const { name, value } = e.target;

        setReservaEditar((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (

        <Container className="mt-3">

            {/* ENCABEZADO */}
            <Row className="align-items-center mb-3">

                <Col xs={9}>
                    <h3>
                        <i className="bi bi-calendar-check me-2"></i>
                        Reservas
                    </h3>
                </Col>

                <Col xs={3} className="text-end">

                    <Button
                        onClick={() =>
                            setMostrarModal(true)
                        }
                    >
                        <i className="bi bi-plus-lg"></i>

                        <span className="d-none d-sm-inline ms-2">
                            Nueva Reserva
                        </span>
                    </Button>

                </Col>

            </Row>

            <hr />

            {/* BUSCADOR */}
            <Row className="mb-4">

                <Col md={6} lg={5}>

                    <CuadrosBusquedas
                        textoBusqueda={textoBusqueda}
                        manejarCambioBusqueda={manejoBusqueda}
                    />

                </Col>

            </Row>

            {/* LOADER */}
            {cargando && (

                <Row className="text-center my-5">

                    <Col>

                        <Spinner
                            animation="border"
                            variant="primary"
                            size="lg"
                        />

                        <p className="mt-3 text-muted">
                            Cargando reservas...
                        </p>

                    </Col>

                </Row>
            )}

            {/* TARJETAS */}
            {!cargando && reservas.length > 0 && (

                <Row>

                    <Col xs={12}>

                        <TarjetaReserva
                            reservas={reservasPaginadas}
                            abrirModalEdicion={
                                abrirModalEdicion
                            }
                            abrirModalEliminacion={
                                abrirModalEliminacion
                            }
                        />

                    </Col>

                </Row>
            )}

            {/* PAGINACIÓN */}
            {reservasFiltradas.length > 0 && (

                <Paginacion
                    registrosPorPagina={registrosPorPagina}
                    totalRegistros={reservasFiltradas.length}
                    paginaActual={paginaActual}
                    establecerPaginaActual={
                        establecerPaginaActual
                    }
                    establecerRegistrosPorPagina={
                        establecerRegistrosPorPagina
                    }
                />
            )}

            {/* MODAL REGISTRO */}
            <ModalRegistroReserva
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevaReserva={nuevaReserva}
                manejoCambioInput={manejoCambioInput}
                agregarReserva={agregarReserva}
            />

            {/* MODAL EDICIÓN */}
            <ModalEdicionReserva
                mostrarModalEdicion={
                    mostrarModalEdicion
                }
                setMostrarModalEdicion={
                    setMostrarModalEdicion
                }
                reservaEditar={reservaEditar}
                manejoCambioInputEdicion={
                    manejoCambioInputEdicion
                }
                actualizarReserva={actualizarReserva}
            />

            {/* MODAL ELIMINAR */}
            <ModalEliminacionReserva
                mostrarModalEliminacion={
                    mostrarModalEliminacion
                }
                setMostrarModalEliminacion={
                    setMostrarModalEliminacion
                }
                eliminarReserva={eliminarReserva}
                reserva={reservaAEliminar}
            />

            {/* TOAST */}
            <NotificacionOperacion
                mostrar={toast.mostrar}
                mensaje={toast.mensaje}
                tipo={toast.tipo}
                onCerrar={() =>
                    setToast({
                        ...toast,
                        mostrar: false,
                    })
                }
            />

        </Container>
    );
};

export default Reserva;