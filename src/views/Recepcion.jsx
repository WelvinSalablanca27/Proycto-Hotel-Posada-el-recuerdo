import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

// 🔍 Buscador y paginación
import CuadrosBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

// 📦 Modales y componentes de Recepción
import ModalRegistroRecepcion from "../components/recepcion/ModalRegistroRecepcion";
import ModalEdicionRecepcion from "../components/recepcion/ModalEdicionRecepcion";
import ModalEliminacionRecepcion from "../components/recepcion/ModalEliminacionRecepcion";
import NotificacionOperacion from "../components/NotificacionOperacion";

// 📊 Tablas y tarjetas responsive
import TablaRecepcion from "../components/recepcion/TablaRecepcion";
import TarjetaRecepcion from "../components/recepcion/TarjetaRecepcion";

const Recepcion = () => {

  // 🔔 Estado para notificaciones (toast)
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  // 📌 Control del modal de registro
  const [mostrarModal, setMostrarModal] = useState(false);

  // 📊 Lista de recepcionistas y estado de carga
  const [recepcionistas, setRecepcionistas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 🗑️ Control de eliminación
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [recepcionistaAEliminar, setRecepcionistaAEliminar] = useState(null);

  // ✏️ Control de edición
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  // 🔎 Búsqueda
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [recepcionistasFiltrados, setRecepcionistasFiltrados] = useState([]);

  // 📌 Paginación
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  // 📌 Slice de paginación
  const recepcionistasPaginados = recepcionistasFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // ✏️ Estado para edición
  const [recepcionistaEditar, setRecepcionistaEditar] = useState({
    id_recepcionista: "",
    fecha: "",
    nombre: "",
    apellido: "",
    hora_entrada: "",
    hora_salida: "",
    turno: "",
  });

  // ➕ Estado para nuevo recepcionista
  const [nuevoRecepcionista, setNuevoRecepcionista] = useState({
    fecha: "",
    nombre: "",
    apellido: "",
    hora_entrada: "",
    hora_salida: "",
    turno: "",
  });

  // 🚀 Carga inicial de datos
  useEffect(() => {
    cargarRecepcionistas();
  }, []);

  // 🔎 Filtrado dinámico
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setRecepcionistasFiltrados(recepcionistas);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();

      const filtrados = recepcionistas.filter((r) =>
        r.nombre?.toLowerCase().includes(textoLower) ||
        r.apellido?.toLowerCase().includes(textoLower) ||
        r.turno?.toLowerCase().includes(textoLower) ||
        r.fecha?.toString().includes(textoLower)
      );

      setRecepcionistasFiltrados(filtrados);
    }
  }, [textoBusqueda, recepcionistas]);

  // 🔍 Manejo del input de búsqueda
  const manejoBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  // ✏️ Abrir modal de edición
  const abrirModalEdicion = (recepcionista) => {
    setRecepcionistaEditar({
      id_recepcionista: recepcionista.id_recepcionista,
      fecha: recepcionista.fecha,
      nombre: recepcionista.nombre,
      apellido: recepcionista.apellido,
      hora_entrada: recepcionista.hora_entrada,
      hora_salida: recepcionista.hora_salida,
      turno: recepcionista.turno,
    });
    setMostrarModalEdicion(true);
  };

  // 🗑️ Abrir modal de eliminación
  const abrirModalEliminacion = (recepcionista) => {
    setRecepcionistaAEliminar(recepcionista);
    setMostrarModalEliminacion(true);
  };

  // ✍️ Manejo de inputs (registro)
  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoRecepcionista((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✍️ Manejo de inputs (edición)
  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setRecepcionistaEditar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 📥 Cargar recepcionistas desde Supabase
  const cargarRecepcionistas = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("recepcion")
        .select("*")
        .order("id_recepcionista", { ascending: true });

      if (error) {
        console.error("Error al cargar recepcionistas:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al cargar recepcionistas.",
          tipo: "error",
        });
        return;
      }

      setRecepcionistas(data || []);
    } catch (err) {
      console.error("Excepción al cargar Recepcion:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar recepcionistas.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  // ➕ Agregar nuevo recepcionista
  const agregarRecepcionista = async () => {
    try {
      if (
        !nuevoRecepcionista.fecha ||
        !nuevoRecepcionista.nombre?.trim() ||
        !nuevoRecepcionista.apellido?.trim() ||
        !nuevoRecepcionista.hora_entrada ||
        !nuevoRecepcionista.hora_salida ||
        !nuevoRecepcionista.turno?.trim()
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos.",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase
        .from("recepcion")
        .insert([nuevoRecepcionista]);

      if (error) {
        console.error("Error:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al registrar recepcionista.",
          tipo: "error",
        });
        return;
      }

      await cargarRecepcionistas();

      setToast({
        mostrar: true,
        mensaje: `Recepcionista ${nuevoRecepcionista.nombre} registrado exitosamente.`,
        tipo: "exito",
      });

      // Reset formulario
      setNuevoRecepcionista({
        fecha: "",
        nombre: "",
        apellido: "",
        hora_entrada: "",
        hora_salida: "",
        turno: "",
      });

      setMostrarModal(false);

    } catch (err) {
      console.error(err.message);
    }
  };

  // ✏️ Actualizar recepcionista
  const actualizarRecepcionista = async () => {
    try {
      if (
        !recepcionistaEditar.fecha ||
        !recepcionistaEditar.nombre?.trim() ||
        !recepcionistaEditar.apellido?.trim() ||
        !recepcionistaEditar.hora_entrada ||
        !recepcionistaEditar.hora_salida ||
        !recepcionistaEditar.turno?.trim()
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos.",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase
        .from("recepcion")
        .update({
          fecha: recepcionistaEditar.fecha,
          nombre: recepcionistaEditar.nombre,
          apellido: recepcionistaEditar.apellido,
          hora_entrada: recepcionistaEditar.hora_entrada,
          hora_salida: recepcionistaEditar.hora_salida,
          turno: recepcionistaEditar.turno,
        })
        .eq("id_recepcionista", recepcionistaEditar.id_recepcionista);

      if (error) {
        console.error(error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al actualizar recepcionista.",
          tipo: "error",
        });
        return;
      }

      await cargarRecepcionistas();
      setMostrarModalEdicion(false);

      setToast({
        mostrar: true,
        mensaje: "Recepcionista actualizado correctamente.",
        tipo: "exito",
      });

    } catch (err) {
      console.error(err.message);
    }
  };

  // 🗑️ Eliminar recepcionista
  const eliminarRecepcionista = async () => {
    if (!recepcionistaAEliminar) return;

    try {
      setMostrarModalEliminacion(false);

      const { error } = await supabase
        .from("recepcion")
        .delete()
        .eq("id_recepcionista", recepcionistaAEliminar.id_recepcionista);

      if (error) {
        setToast({
          mostrar: true,
          mensaje: "Error al eliminar recepcionista.",
          tipo: "error",
        });
        return;
      }

      await cargarRecepcionistas();

      setToast({
        mostrar: true,
        mensaje: `Recepcionista ${recepcionistaAEliminar.nombre} eliminado.`,
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
            <i className="bi-person-badge-fill me-2"></i> Recepcionistas
          </h3>
        </Col>

        {/* ➕ Botón nuevo */}
        <Col xs={3} sm={5} md={5} lg={5} className="text-end">
          <Button onClick={() => setMostrarModal(true)}>
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Nuevo Recepcionista</span>
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
            <p className="mt-3 text-muted">Cargando recepcionistas...</p>
          </Col>
        </Row>
      )}

      {/* 📊 Tabla / Tarjetas */}
      {!cargando && recepcionistas.length > 0 && (
        <Row>
          <Col lg={12} className="d-none d-lg-block">
            <TablaRecepcion
              recepcion={recepcionistasPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>

          <Col xs={12} sm={12} md={12} className="d-lg-none">
            <TarjetaRecepcion
              recepcion={recepcionistasPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}

      {/* 📄 Paginación */}
      {recepcionistasFiltrados.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={recepcionistasFiltrados.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      {/* 📦 Modales */}
      <ModalRegistroRecepcion
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoRecepcionista={nuevoRecepcionista}
        manejoCambioInput={manejoCambioInput}
        agregarRecepcionista={agregarRecepcionista}
      />

      <ModalEdicionRecepcion
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        recepcionistaEditar={recepcionistaEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarRecepcionista={actualizarRecepcionista}
      />

      <ModalEliminacionRecepcion
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarRecepcionista={eliminarRecepcionista}
        recepcionista={recepcionistaAEliminar}
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

export default Recepcion;