import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TarjetaHabitacion from "../components/habitacion/TarjetaHabitacion";
import ModalRegistroHabitacion from "../components/habitacion/ModalRegistroHabitacion";
import ModalEliminacionHabitacion from "../components/habitacion/ModalEliminacionHabitacion";
import ModalEdicionHabitacion from "../components/habitacion/ModalEdicionHabitacion";
import TablaHabitacion from "../components/habitacion/TablaHabitacion";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Habitacion = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);

  const [habitaciones, setHabitaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [habitacionAEliminar, setHabitacionAEliminar] = useState(null);

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [habitacionesFiltradas, setHabitacionesFiltradas] = useState([]);

  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const [habitacionEditar, setHabitacionEditar] = useState({
    id_habitacion: "",
    numero_habitacion: "",
    tipo_habitacion: "",
    tipo_camas: "",
    tipo_clima: "",
    precio: "",
    estado: "",
  });

  const [nuevaHabitacion, setNuevaHabitacion] = useState({
    numero_habitacion: "",
    tipo_habitacion: "",
    tipo_camas: "",
    tipo_clima: "",
    precio: "",
    estado: "",
  });

  const habitacionesPaginadas = habitacionesFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setHabitacionesFiltradas(habitaciones);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtradas = habitaciones.filter((h) =>
        h.numero_habitacion?.toString().toLowerCase().includes(textoLower) ||
        h.tipo_habitacion?.toLowerCase().includes(textoLower) ||
        h.tipo_camas?.toLowerCase().includes(textoLower) ||
        h.tipo_clima?.toLowerCase().includes(textoLower) ||
        h.estado?.toLowerCase().includes(textoLower)
      );
      setHabitacionesFiltradas(filtradas);
    }
  }, [textoBusqueda, habitaciones]);

  const abrirModalEdicion = (habitacion) => {
    setHabitacionEditar({
      id_habitacion: habitacion.id_habitacion,
      numero_habitacion: habitacion.numero_habitacion,
      tipo_habitacion: habitacion.tipo_habitacion,
      tipo_camas: habitacion.tipo_camas,
      tipo_clima: habitacion.tipo_clima,
      precio: habitacion.precio,
      estado: habitacion.estado,
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (habitacion) => {
    setHabitacionAEliminar(habitacion);
    setMostrarModalEliminacion(true);
  };

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaHabitacion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setHabitacionEditar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarHabitacion = async () => {
    try {
      if (
        !nuevaHabitacion.numero_habitacion.trim() ||
        !nuevaHabitacion.tipo_habitacion.trim() ||
        !nuevaHabitacion.tipo_camas.trim() ||
        !nuevaHabitacion.tipo_clima.trim() ||
        !nuevaHabitacion.precio.toString().trim() ||
        !nuevaHabitacion.estado.trim()
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos obligatorios.",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase.from("habitacion").insert([nuevaHabitacion]);

      if (error) {
        console.error("Error al agregar habitación:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al registrar habitación.",
          tipo: "error",
        });
        return;
      }

      setToast({
        mostrar: true,
        mensaje: `Habitación ${nuevaHabitacion.numero_habitacion} registrada exitosamente.`,
        tipo: "exito",
      });

      setNuevaHabitacion({
        numero_habitacion: "",
        tipo_habitacion: "",
        tipo_camas: "",
        tipo_clima: "",
        precio: "",
        estado: "",
      });
      setMostrarModal(false);
      await cargarHabitaciones();
    } catch (err) {
      console.error("Excepción al agregar habitación:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al registrar habitación.",
        tipo: "error",
      });
    }
  };

  const cargarHabitaciones = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("habitacion")
        .select("*")
        .order("id_habitacion", { ascending: true });

      if (error) {
        console.error("Error al cargar habitaciones:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al cargar habitaciones.",
          tipo: "error",
        });
        return;
      }
      setHabitaciones(data || []);
    } catch (err) {
      console.error("Excepción al cargar habitaciones:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar habitaciones.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  const eliminarHabitacion = async () => {
    if (!habitacionAEliminar) return;
    try {
      setMostrarModalEliminacion(false);
      const { error } = await supabase
        .from("habitacion")
        .delete()
        .eq("id_habitacion", habitacionAEliminar.id_habitacion);

      if (error) {
        setToast({
          mostrar: true,
          mensaje: `Error al eliminar la habitación.`,
          tipo: "error",
        });
        return;
      }

      await cargarHabitaciones();
      setToast({
        mostrar: true,
        mensaje: `Habitación ${habitacionAEliminar.numero_habitacion} eliminada exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al eliminar habitación.",
        tipo: "error",
      });
    }
  };

  const actualizarHabitacion = async () => {
    try {
      if (
        !habitacionEditar.numero_habitacion.trim() ||
        !habitacionEditar.tipo_habitacion.trim() ||
        !habitacionEditar.tipo_camas.trim() ||
        !habitacionEditar.tipo_clima.trim() ||
        !habitacionEditar.precio.toString().trim() ||
        !habitacionEditar.estado.trim()
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos obligatorios.",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModalEdicion(false);
      const { error } = await supabase
        .from("habitacion")
        .update({
          numero_habitacion: habitacionEditar.numero_habitacion,
          tipo_habitacion: habitacionEditar.tipo_habitacion,
          tipo_camas: habitacionEditar.tipo_camas,
          tipo_clima: habitacionEditar.tipo_clima,
          precio: habitacionEditar.precio,
          estado: habitacionEditar.estado,
        })
        .eq("id_habitacion", habitacionEditar.id_habitacion);

      if (error) {
        setToast({
          mostrar: true,
          mensaje: "Error al actualizar habitación.",
          tipo: "error",
        });
        return;
      }

      await cargarHabitaciones();
      setToast({
        mostrar: true,
        mensaje: `Habitación ${habitacionEditar.numero_habitacion} actualizada exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al actualizar habitación.",
        tipo: "error",
      });
    }
  };

  return (
    <Container className="mt-3">
      {/* Título y botón Nueva Habitación */}
      <Row className="align-items-center mb-3">
        <Col xs={9} sm={7} md={7} lg={7} className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi-house me-2"></i> Habitaciones
          </h3>
        </Col>
        <Col xs={3} sm={5} md={5} lg={5} className="text-end">
          <Button onClick={() => setMostrarModal(true)} size="md">
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Nueva Habitación</span>
          </Button>
        </Col>
      </Row>
      <hr />

      {/* Búsqueda */}
      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar por número, tipo, camas, clima o estado..."
          />
        </Col>
      </Row>

      {/* Mensaje sin resultados */}
      {!cargando && textoBusqueda.trim() && habitacionesFiltradas.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron habitaciones que coincidan con "{textoBusqueda}".
            </Alert>
          </Col>
        </Row>
      )}

      {/* Cargando */}
      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando habitaciones...</p>
          </Col>
        </Row>
      )}

      {/* Lista */}
      {!cargando && habitacionesFiltradas.length > 0 && (
        <Row>
          <Col xs={12} sm={12} md={12} className="d-lg-none">
            <TarjetaHabitacion
              habitacion={habitacionesPaginadas}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
          <Col lg={12} className="d-none d-lg-block">
            <TablaHabitacion
              habitacion={habitacionesPaginadas}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}

      {/* Paginación */}
      {habitacionesFiltradas.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={habitacionesFiltradas.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      {/* Modales */}
      <ModalRegistroHabitacion
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaHabitacion={nuevaHabitacion}
        manejoCambioInput={manejoCambioInput}
        agregarHabitacion={agregarHabitacion}
      />

      <ModalEliminacionHabitacion
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarHabitacion={eliminarHabitacion}
        habitacion={habitacionAEliminar}
      />

      <ModalEdicionHabitacion
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        habitacionEditar={habitacionEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarHabitacion={actualizarHabitacion}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Habitacion;