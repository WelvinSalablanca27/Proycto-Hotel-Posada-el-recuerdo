import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import TablaHuesped from "../components/huesped/TablaHuesped";
import ModalRegistroHuesped from "../components/huesped/ModalRegistroHuesped";
import ModalEdicionHuesped from "../components/huesped/ModalEdicionHuesped";
import ModalEliminacionHuesped from "../components/huesped/ModalEliminacionHuesped";
import CuadrosBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Huespedes = () => {

  const [huespedes, setHuespedes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [paginaActual, establecerPaginaActual] = useState(1);
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);

  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "",
  });

  const [nuevoHuesped, setNuevoHuesped] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    cedula_pasaporte: "",
    lugar_origen: "",
  });

  const [huespedEditar, setHuespedEditar] = useState({
    id_huesped: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    cedula_pasaporte: "",
    lugar_origen: "",
  });

  const [huespedAEliminar, setHuespedAEliminar] = useState(null);

  // 📌 Cargar huéspedes
  const cargarHuespedes = async () => {
    setCargando(true);

    const { data, error } = await supabase
      .from("huesped")
      .select("*")
      .order("id_huesped", { ascending: true });

    if (error) {
      console.error("Error al cargar huéspedes:", error.message);
    } else {
      setHuespedes(data);
    }

    setCargando(false);
  };

  useEffect(() => {
    cargarHuespedes();
  }, []);

  // 🔍 Buscar
  const manejoBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
    establecerPaginaActual(1);
  };

  const huespedesFiltrados = huespedes.filter((huesped) =>
    ` ${huesped.primer_nombre} ${huesped.primer_apellido}`
      .toLowerCase()
      .includes(textoBusqueda.toLowerCase())
  );

  // ✏️ Inputs registro
  const manejoCambioInput = (e) => {
    const { name, value } = e.target;

    setNuevoHuesped({
      ...nuevoHuesped,
      [name]: value,
    });
  };

  // ✏️ Inputs edición
  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;

    setHuespedEditar({
      ...huespedEditar,
      [name]: value,
    });
  };

  // ➕ Agregar huésped
  const agregarHuesped = async () => {
    try {

      setMostrarModal(false);

      const { error } = await supabase
        .from("huesped")
        .insert([nuevoHuesped]);

      if (error) {
        console.error("Error al agregar huésped:", error.message);

        setToast({
          mostrar: true,
          mensaje: "Error al agregar huésped.",
          tipo: "error",
        });

        return;
      }

      await cargarHuespedes();

      setToast({
        mostrar: true,
        mensaje: "Huésped agregado exitosamente.",
        tipo: "exito",
      });

      setNuevoHuesped({
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        cedula_pasaporte: "",
        lugar_origen: "",
      });

    } catch (err) {

      console.error("Excepción al agregar huésped:", err.message);

      setToast({
        mostrar: true,
        mensaje: "Error inesperado al agregar huésped.",
        tipo: "error",
      });
    }
  };

  // 📌 Abrir modal edición
  const abrirModalEdicion = (huesped) => {
    setHuespedEditar(huesped);
    setMostrarModalEdicion(true);
  };

  // 📌 Abrir modal eliminación
  const abrirModalEliminacion = (huesped) => {
    setHuespedAEliminar(huesped);
    setMostrarModalEliminacion(true);
  };

  // ✏️ Actualizar huésped
  const actualizarHuesped = async () => {
    try {

      setMostrarModalEdicion(false);

      const { error } = await supabase
        .from("huesped")
        .update({
          primer_nombre: huespedEditar.primer_nombre,
          segundo_nombre: huespedEditar.segundo_nombre,
          primer_apellido: huespedEditar.primer_apellido,
          segundo_apellido: huespedEditar.segundo_apellido,
          cedula_pasaporte: huespedEditar.cedula_pasaporte,
          lugar_origen: huespedEditar.lugar_origen,
        })
        .eq("id_huesped", huespedEditar.id_huesped);

      if (error) {

        console.error("Error al actualizar huésped:", error.message);

        setToast({
          mostrar: true,
          mensaje: "Error al actualizar huésped.",
          tipo: "error",
        });

        return;
      }

      await cargarHuespedes();

      setToast({
        mostrar: true,
        mensaje: "Actualización realizada correctamente.",
        tipo: "exito",
      });

    } catch (err) {

      console.error("Excepción al actualizar huésped:", err.message);

      setToast({
        mostrar: true,
        mensaje: "Error inesperado al actualizar huésped.",
        tipo: "error",
      });
    }
  };

  // 🗑️ Eliminar huésped
  const eliminarHuesped = async () => {

    if (!huespedAEliminar) return;

    try {

      setMostrarModalEliminacion(false);

      const { error } = await supabase
        .from("huesped")
        .delete()
        .eq("id_huesped", huespedAEliminar.id_huesped);

      if (error) {

        console.error("Error al eliminar huésped:", error.message);

        setToast({
          mostrar: true,
          mensaje: "Error al eliminar huésped.",
          tipo: "error",
        });

        return;
      }

      await cargarHuespedes();

      setToast({
        mostrar: true,
        mensaje: "Huésped eliminado exitosamente.",
        tipo: "exito",
      });

    } catch (err) {

      console.error("Excepción al eliminar huésped:", err.message);

      setToast({
        mostrar: true,
        mensaje: "Error inesperado al eliminar huésped.",
        tipo: "error",
      });
    }
  };

  return (
    <Container className="mt-3">

      {/* 📌 Encabezado */}
      <Row className="align-items-center mb-3">

        <Col xs={9} sm={7} md={7} lg={7} className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi bi-people-fill me-2"></i> Huéspedes
          </h3>
        </Col>

        <Col xs={3} sm={5} md={5} lg={5} className="text-end">
          <Button onClick={() => setMostrarModal(true)} size="md">
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">
              Nuevo Huésped
            </span>
          </Button>
        </Col>

      </Row>

      <hr />

      {/* 🔍 Busqueda */}
      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadrosBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejoBusqueda}
          />
        </Col>
      </Row>

      {/* ⚠️ Sin resultados */}
      {!cargando && textoBusqueda.trim() && huespedesFiltrados.length === 0 && (
        <Row>
          <Col>
            <div className="alert alert-info text-center">
              No se encontraron huéspedes con "{textoBusqueda}"
            </div>
          </Col>
        </Row>
      )}

      {/* ⏳ Loader */}
      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando huéspedes...</p>
          </Col>
        </Row>
      )}

      {/* 📊 Tabla */}
      {!cargando && huespedesFiltrados.length > 0 && (
        <Row>
          <Col xs={12}>
            <TablaHuesped
              huespedes={huespedesFiltrados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}

      {/* 📦 Modales */}
      <ModalRegistroHuesped
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoHuesped={nuevoHuesped}
        manejoCambioInput={manejoCambioInput}
        agregarHuesped={agregarHuesped}
      />

      <ModalEdicionHuesped
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        huespedEditado={huespedEditar}
        manejoCambioInput={manejoCambioInputEdicion}
        actualizarHuesped={actualizarHuesped}
      />

      <ModalEliminacionHuesped
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarHuesped={eliminarHuesped}
        huesped={huespedAEliminar}
      />

      {/* 📄 Paginación */}
      {huespedesFiltrados.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={huespedesFiltrados.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      {/* 🔔 Notificaciones */}
      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />

    </Container>
  );
};

export default Huespedes;