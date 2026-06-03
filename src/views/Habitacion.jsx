import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

// 🔍 Buscador y paginación (igual al ejemplo de Categorías)
import CuadrosBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

// 📦 Modales y componentes de Habitacion
import ModalRegistroHabitacion from "../components/habitacion/ModalRegistroHabitacion";
import ModalEdicionHabitacion from "../components/habitacion/ModalEdicionHabitacion";
import ModalEliminacionHabitacion from "../components/habitacion/ModalEliminacionHabitacion";
import NotificacionOperacion from "../components/NotificacionOperacion";

// 📊 Tablas y tarjetas responsive
import TablaHabitacion from "../components/habitacion/TablaHabitacion";
import TarjetaHabitacion from "../components/habitacion/TarjetaHabitacion";

const Habitacion = () => {

  // 🔔 Estado para notificaciones (toast)
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  // 📌 Control del modal de registro
  const [mostrarModal, setMostrarModal] = useState(false);

  // 📊 Lista de habitaciones y estado de carga
  const [habitacion, setHabitacion] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 🗑️ Control de eliminación
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [habitacionAEliminar, setHabitacionAEliminar] = useState(null);

  // ✏️ Control de edición
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  // 🔎 Búsqueda
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [habitacionesFiltradas, setHabitacionesFiltradas] = useState([]);

  // 📌 Paginación
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  // 📌 Slice de paginación (igual patrón Categorías)
  const habitacionesPaginadas = habitacionesFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // ✏️ Estado para edición de habitación
  const [habitacionEditar, setHabitacionEditar] = useState({
    id_habitacion: "",
    numero_habitacion: "",
    tipo_habitacion: "",
    tipo_camas: "",
    tipo_clima: "",
    precio: "",
    estado: "",
  });

  // ➕ Estado para nueva habitación
  const [nuevaHabitacion, setNuevaHabitacion] = useState({
    numero_habitacion: "",
    tipo_habitacion: "",
    tipo_camas: "",
    tipo_clima: "",
    precio: "",
    estado: "",
  });

  // 🚀 Carga inicial de datos
  useEffect(() => {
    cargarHabitacion();
  }, []);

  // 🔎 Filtrado dinámico (igual que Categorías)
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setHabitacionesFiltradas(habitacion);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();

      const filtradas = habitacion.filter((h) =>
        h.numero_habitacion?.toString().toLowerCase().includes(textoLower) ||
        h.tipo_habitacion?.toLowerCase().includes(textoLower) ||
        h.estado?.toLowerCase().includes(textoLower)
      );

      setHabitacionesFiltradas(filtradas);
    }
  }, [textoBusqueda, habitacion]);

  // 🔍 Manejo del input de búsqueda
  const manejoBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  // ✏️ Abrir modal de edición con datos cargados
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

  // 🗑️ Abrir modal de eliminación
  const abrirModalEliminacion = (habitacion) => {
    setHabitacionAEliminar(habitacion);
    setMostrarModalEliminacion(true);
  };

  // ✍️ Manejo de inputs (registro)
  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaHabitacion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✍️ Manejo de inputs (edición)
  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setHabitacionEditar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 📥 Cargar habitaciones desde Supabase
  const cargarHabitacion = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("habitacion")
        .select("*")
        .order("id_habitacion", { ascending: true });

      if (error) {
        console.error("Error al cargar habitacion:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al cargar habitacion.",
          tipo: "error",
        });
        return;
      }

      setHabitacion(data || []);
    } catch (err) {
      console.error("Excepción al cargar Habitacion:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar habitacion.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  // ➕ Agregar nueva habitación
  const agregarHabitacion = async () => {
    try {

      // ⚠️ Validación de campos
      if (
        !nuevaHabitacion.numero_habitacion.trim() ||
        !nuevaHabitacion.tipo_habitacion.trim() ||
        !nuevaHabitacion.tipo_camas.trim() ||
        !nuevaHabitacion.tipo_clima.trim() ||
        !nuevaHabitacion.precio.trim() ||
        !nuevaHabitacion.estado.trim()
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos.",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase
        .from("habitacion")
        .insert([nuevaHabitacion]);

      if (error) {
        console.error("Error:", error.message);
        return;
      }

      await cargarHabitacion();

      setToast({
        mostrar: true,
        mensaje: `Habitación "${nuevaHabitacion.numero_habitacion}" registrada exitosamente.`,
        tipo: "exito",
      });

      // 🔄 Reset formulario
      setNuevaHabitacion({
        numero_habitacion: "",
        tipo_habitacion: "",
        tipo_camas: "",
        tipo_clima: "",
        precio: "",
        estado: "",
      });

      setMostrarModal(false);

    } catch (err) {
      console.error(err.message);
    }
  };

  // ✏️ Actualizar habitación
  const actualizarHabitacion = async () => {
    try {

      // ⚠️ Validación
      if (
        !habitacionEditar.numero_habitacion.trim() ||
        !habitacionEditar.tipo_habitacion.trim() ||
        !habitacionEditar.tipo_camas.trim() ||
        !habitacionEditar.tipo_clima.trim() ||
        !habitacionEditar.precio.trim() ||
        !habitacionEditar.estado.trim()
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos",
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
        console.error(error.message);

        setToast({
          mostrar: true,
          mensaje: "Error al actualizar habitación",
          tipo: "error",
        });
        return;
      }

      await cargarHabitacion();

      setToast({
        mostrar: true,
        mensaje: "Habitación actualizada correctamente",
        tipo: "exito",
      });

    } catch (err) {
      console.error(err.message);
    }
  };

  // 🗑️ Eliminar habitación
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
          mensaje: "Error al eliminar habitación",
          tipo: "error",
        });
        return;
      }

      await cargarHabitacion();

      setToast({
        mostrar: true,
        mensaje: `Habitación ${habitacionAEliminar.numero_habitacion} eliminada`,
        tipo: "exito",
      });

    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Container className="mt-3">

      {/* 📌 Encabezado */}
      <Row className="align-items-center mb-3">
        <Col xs={9} sm={7} md={7} lg={7} className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi-house me-2"></i> Habitaciones
          </h3>
        </Col>

        {/* ➕ Botón nuevo */}
        <Col xs={3} sm={5} md={5} lg={5} className="text-end">
          <Button onClick={() => setMostrarModal(true)}>
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Nueva Habitación</span>
          </Button>
        </Col>
      </Row>

      <hr />

      {/* 🔍 Buscador */}
      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadrosBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejoBusqueda}
          />
        </Col>
      </Row>

      {/* ⏳ Loader */}
      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando habitaciones...</p>
          </Col>
        </Row>
      )}

      {/* 📊 Tabla / Tarjetas */}
      {!cargando && habitacion.length > 0 && (
        <Row>
          <Col lg={12} className="d-none d-lg-block">
            <TablaHabitacion
              habitacion={habitacion}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>

          <Col xs={12} sm={12} md={12} className="d-lg-none">
            <TarjetaHabitacion
              habitacion={habitacionesFiltradas}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}

      {/* 📄 Paginación */}
      {habitacionesFiltradas.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={habitacionesFiltradas.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      {/* 📦 Modales */}
      <ModalRegistroHabitacion
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaHabitacion={nuevaHabitacion}
        manejoCambioInput={manejoCambioInput}
        agregarHabitacion={agregarHabitacion}
      />

      <ModalEdicionHabitacion
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        habitacionEditar={habitacionEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarHabitacion={actualizarHabitacion}
      />

      <ModalEliminacionHabitacion
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarHabitacion={eliminarHabitacion}
        habitacion={habitacionAEliminar}
      />

      {/* 🔔 Toast */}
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