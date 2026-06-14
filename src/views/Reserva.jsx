import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";
import TablaReserva from "../components/reserva/TablaReserva";
import TarjetaReserva from "../components/reserva/TarjetaReserva";
import FormularioReserva from "../components/reserva/FormularioReserva";

const Reserva = () => {

    const [toast, setToast] = useState({
        mostrar: false,
        mensaje: "",
        tipo: ""
    });

    const [reservas, setReservas] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [reservaAEditar, setReservaAEditar] = useState(null);

    const [huespedes, setHuespedes] = useState([]);
    const [habitaciones, setHabitaciones] = useState([]);
    const [recepcionistas, setRecepcionistas] = useState([]);

    const [huespedSeleccionado, setHuespedSeleccionado] = useState(null);

    const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);

    const [recepcionistaSeleccionado, setRecepcionistaSeleccionado] = useState(null);

    const [formaPago, setFormaPago] = useState("efectivo");

    const [horaEntrada, setHoraEntrada] = useState("");

    const [horaSalida, setHoraSalida] = useState("");

    const [monto, setMonto] = useState(0);

    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [reservasFiltradas, setReservasFiltradas] = useState([]);

    const [registrosPorPagina, establecerRegistrosPorPagina] = useState(8);

    const [paginaActual, establecerPaginaActual] = useState(1);

    const reservasPaginadas = reservasFiltradas.slice(
        (paginaActual - 1) * registrosPorPagina,
        paginaActual * registrosPorPagina
    );

    // ===============================
    // CARGAR DATOS AUXILIARES
    // ===============================

    const cargarDatosAuxiliares = async () => {

        try {

            const [h, hab, r] = await Promise.all([

                supabase.from("huesped").select("*"),

                supabase.from("habitacion").select("*"),

                supabase.from("recepcion").select("*")

            ]);

            setHuespedes(h.data || []);

            setHabitaciones(hab.data || []);

            setRecepcionistas(r.data || []);

        } catch (err) {

            console.error(
                "Error cargando auxiliares:",
                err
            );

        }

    };

    // ===============================
    // CARGAR RESERVAS
    // ===============================

    const cargarReservas = async () => {

        try {

            setCargando(true);

            const { data, error } = await supabase
                .from("reserva")
                .select(`
    id_reserva,
    hora_entrada,
    hora_salida,
    forma_pago,
    monto,
    huesped (
      primer_nombre,
      primer_apellido
    ),
    habitacion (
      numero_habitacion,
      tipo_habitacion
    ),
    recepcion (
      nombre,
      apellido
    )
  `)
                .order("hora_entrada", { ascending: false });

            if (error) {

                console.error(
                    "Error al cargar reservas:",
                    error
                );

                setToast({
                    mostrar: true,
                    mensaje: "Error al cargar reservas",
                    tipo: "error"
                });

                return;

            }

            setReservas(data || []);

        } catch (err) {

            console.error(err);

            setToast({
                mostrar: true,
                mensaje:
                    "Error inesperado al cargar reservas",
                tipo: "error"
            });

        } finally {

            setCargando(false);

        }

    };

    useEffect(() => {

        cargarReservas();

        cargarDatosAuxiliares();

    }, []);

    // ===============================
    // PRECARGAR EDICIÓN
    // ===============================

    useEffect(() => {

        if (reservaAEditar) {

            const huesped = huespedes.find(
                h =>
                    h.id_huesped ===
                    reservaAEditar.id_huesped
            );

            const habitacion = habitaciones.find(
                h =>
                    h.id_habitacion ===
                    reservaAEditar.id_habitacion
            );

            const recepcionista =
                recepcionistas.find(
                    r =>
                        r.id_recepcionista ===
                        reservaAEditar.id_recepcionista
                );

            setHuespedSeleccionado(
                huesped || null
            );

            setHabitacionSeleccionada(
                habitacion || null
            );

            setRecepcionistaSeleccionado(
                recepcionista || null
            );

            setFormaPago(
                reservaAEditar.forma_pago || "efectivo"
            );

            setHoraEntrada(
                reservaAEditar.hora_entrada || ""
            );

            setHoraSalida(
                reservaAEditar.hora_salida || ""
            );

            setMonto(
                reservaAEditar.monto || 0
            );

        }

    }, [
        reservaAEditar,
        huespedes,
        habitaciones,
        recepcionistas
    ]);

    // ===============================
    // BÚSQUEDA
    // ===============================

    useEffect(() => {

        if (!textoBusqueda.trim()) {

            setReservasFiltradas(reservas);

        } else {

            const textoLower =
                textoBusqueda.toLowerCase();

            const filtradas = reservas.filter(r =>

                `${r.huesped?.primer_nombre || ""}
         ${r.huesped?.primer_apellido || ""}`
                    .toLowerCase()
                    .includes(textoLower)

            );

            setReservasFiltradas(filtradas);

        }

    }, [textoBusqueda, reservas]);

  
    // NUEVA RESERVA
   

   const abrirNuevaReserva = () => {

    resetFormulario();

    setMostrarFormulario(true);

};

    // ===============================
    // EDITAR
    // ===============================

    const abrirEdicion = (reserva) => {

        setReservaAEditar(reserva);

        setMostrarFormulario(true);

    };

    // ===============================
    // RESET
    // ===============================

    const resetFormulario = () => {

        setHuespedSeleccionado(null);

        setHabitacionSeleccionada(null);

        setRecepcionistaSeleccionado(null);

        setFormaPago("efectivo");

        setHoraEntrada("");

        setHoraSalida("");

        setMonto(0);

        setReservaAEditar(null);

    };

    // ===============================
    // GUARDAR
    // ===============================

    const guardarReserva = async () => {

        if (
            !huespedSeleccionado ||
            !habitacionSeleccionada ||
            !recepcionistaSeleccionado
        ) {

            setToast({
                mostrar: true,
                mensaje:
                    "Faltan datos obligatorios",
                tipo: "advertencia"
            });

            return;

        }

        try {

            if (reservaAEditar) {

                // =====================
                // ACTUALIZAR
                // =====================

                await supabase

                    .from("reserva")

                    .update({

                        id_huesped:
                            huespedSeleccionado.id_huesped,

                        id_habitacion:
                            habitacionSeleccionada.id_habitacion,

                        id_recepcionista:
                            recepcionistaSeleccionado.id_recepcionista,

                        hora_entrada:
                            horaEntrada,

                        hora_salida:
                            horaSalida,

                        forma_pago:
                            formaPago,

                        monto:
                            monto,

                        fecha_pago:
                            new Date()
                                .toISOString()
                                .split("T")[0]

                    })

                    .eq(
                        "id_reserva",
                        reservaAEditar.id_reserva
                    );

                setToast({
                    mostrar: true,
                    mensaje:
                        "Reserva actualizada exitosamente",
                    tipo: "exito"
                });

            } else {

                // =====================
                // NUEVA RESERVA
                // =====================

                await supabase

                    .from("reserva")

                    .insert([{

                        id_huesped:
                            huespedSeleccionado.id_huesped,

                        id_habitacion:
                            habitacionSeleccionada.id_habitacion,

                        id_recepcionista:
                            recepcionistaSeleccionado.id_recepcionista,

                        hora_entrada:
                            horaEntrada,

                        hora_salida:
                            horaSalida,

                        forma_pago:
                            formaPago,

                        monto:
                            monto,

                        fecha_pago:
                            new Date()
                                .toISOString()
                                .split("T")[0]

                    }]);

                setToast({
                    mostrar: true,
                    mensaje:
                        "Reserva registrada exitosamente",
                    tipo: "exito"
                });

            }

            resetFormulario();

            setMostrarFormulario(false);

            await cargarReservas();

        } catch (err) {

            console.error(err);

            setToast({
                mostrar: true,
                mensaje:
                    "Error al guardar reserva",
                tipo: "error"
            });

        }

    };

    // ===============================
    // BÚSQUEDA INPUT
    // ===============================

    const manejarBusqueda = (e) => {

        setTextoBusqueda(e.target.value);

    };

    // ===============================
    // RENDER
    // ===============================

    return (

        <Container className="mt-3">

            <Row className="align-items-center mb-3">

                <Col xs={8} lg={8}>

                    <h3 className="mb-0">

                        <i className="bi bi-calendar-check me-2"></i>

                        Reservas

                    </h3>

                </Col>

                <Col
                    xs={4}
                    lg={4}
                    className="text-end"
                >

                    <Button
                        onClick={abrirNuevaReserva}
                        size="md"
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

                    <CuadroBusquedas
                        textoBusqueda={textoBusqueda}
                        manejarCambioBusqueda={manejarBusqueda}
                        placeholder="Buscar por huésped..."
                    />

                </Col>

            </Row>

            {/* TABLA */}

            {cargando ? (

                <Row className="text-center my-5">

                    <Spinner
                        animation="border"
                        variant="success"
                        size="lg"
                    />

                    <p className="mt-3 text-muted">

                        Cargando reservas...

                    </p>

                </Row>

            ) : (

                <Row>

                    <Col
                        xs={12}
                        className="d-lg-none"
                    >

                        <TarjetaReserva
                            reservas={reservasPaginadas}
                            abrirEdicion={abrirEdicion}
                        />

                    </Col>

                    <Col
                        lg={12}
                        className="d-none d-lg-block"
                    >

                        <TablaReserva
                            reservas={reservasPaginadas}
                            abrirEdicion={abrirEdicion}
                        />

                    </Col>

                </Row>

            )}

            {/* PAGINACIÓN */}

            {reservasFiltradas.length > 0 && (

                <Paginacion
                    registrosPorPagina={registrosPorPagina}
                    totalRegistros={
                        reservasFiltradas.length
                    }
                    paginaActual={paginaActual}
                    establecerPaginaActual={
                        establecerPaginaActual
                    }
                    establecerRegistrosPorPagina={
                        establecerRegistrosPorPagina
                    }
                />

            )}

            {/* FORMULARIO */}

            <FormularioReserva
                mostrar={mostrarFormulario}
                setMostrar={setMostrarFormulario}
                huespedes={huespedes}
                habitaciones={habitaciones}
                recepcionistas={recepcionistas}
                huespedSeleccionado={huespedSeleccionado}
                setHuespedSeleccionado={
                    setHuespedSeleccionado
                }
                habitacionSeleccionada={
                    habitacionSeleccionada
                }
                setHabitacionSeleccionada={
                    setHabitacionSeleccionada
                }
                recepcionistaSeleccionado={
                    recepcionistaSeleccionado
                }
                setRecepcionistaSeleccionado={
                    setRecepcionistaSeleccionado
                }
                formaPago={formaPago}
                setFormaPago={setFormaPago}
                horaEntrada={horaEntrada}
                setHoraEntrada={setHoraEntrada}
                horaSalida={horaSalida}
                setHoraSalida={setHoraSalida}
                monto={monto}
                setMonto={setMonto}
                guardarReserva={guardarReserva}
                reservaAEditar={reservaAEditar}
            />

            {/* TOAST */}

            <NotificacionOperacion
                mostrar={toast.mostrar}
                mensaje={toast.mensaje}
                tipo={toast.tipo}
                onCerrar={() =>
                    setToast({
                        ...toast,
                        mostrar: false
                    })
                }
            />

        </Container>

    );
};

export default Reserva;