import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import TarjetaHuesped from "../components/huesped/TarjetaHuesped";
import ModalRegistroHuesped from "../components/huesped/ModalRegistroHuesped";
import ModalEdicionHuesped from "../components/huesped/ModalEdicionHuesped";
import ModalEliminacionHuesped from "../components/huesped/ModalEliminacionHuesped";
import TablaHuesped from "../components/huesped/TablaHuesped";

import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Huespedes = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);

  const [huespedes, setHuespedes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [huespedAEliminar, setHuespedAEliminar] = useState(null);

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [huespedesFiltrados, setHuespedesFiltrados] = useState([]);

  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const [huespedEditar, setHuespedEditar] = useState({
    id_huesped: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    cedula_pasaporte: "",
    lugar_origen: "",
  });

  const [nuevoHuesped, setNuevoHuesped] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    cedula_pasaporte: "",
    lugar_origen: "",
  });

  const huespedesPaginados = huespedesFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setHuespedesFiltrados(huespedes);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtrados = huespedes.filter((h) =>
        `${h.primer_nombre} ${h.segundo_nombre} ${h.primer_apellido} ${h.segundo_apellido}`
          .toLowerCase()
          .includes(textoLower) ||
        h.cedula_pasaporte?.toLowerCase().includes(textoLower) ||
        h.lugar_origen?.toLowerCase().includes(textoLower)
      );
      setHuespedesFiltrados(filtrados);
    }
  }, [textoBusqueda, huespedes]);

  const abrirModalEdicion = (huesped) => {
    setHuespedEditar({
      id_huesped: huesped.id_huesped,
      primer_nombre: huesped.primer_nombre,
      segundo_nombre: huesped.segundo_nombre,
      primer_apellido: huesped.primer_apellido,
      segundo_apellido: huesped.segundo_apellido,
      cedula_pasaporte: huesped.cedula_pasaporte,
      lugar_origen: huesped.lugar_origen,
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (huesped) => {
    setHuespedAEliminar(huesped);
    setMostrarModalEliminacion(true);
  };

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoHuesped((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setHuespedEditar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarHuesped = async () => {
    try {
      if (!nuevoHuesped.primer_nombre.trim() || !nuevoHuesped.primer_apellido.trim() || !nuevoHuesped.cedula_pasaporte.trim()) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar nombre, apellido y cédula/pasaporte.",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase.from("huesped").insert([nuevoHuesped]);

      if (error) {
        console.error("Error al agregar huésped:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al registrar huésped.",
          tipo: "error",
        });
        return;
      }

      setToast({
        mostrar: true,
        mensaje: `Huésped ${nuevoHuesped.primer_nombre} ${nuevoHuesped.primer_apellido} registrado exitosamente.`,
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
      setMostrarModal(false);
      await cargarHuespedes();
    } catch (err) {
      console.error("Excepción al agregar huésped:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al registrar huésped.",
        tipo: "error",
      });
    }
  };

  const cargarHuespedes = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("huesped")
        .select("*")
        .order("id_huesped", { ascending: true });

      if (error) {
        console.error("Error al cargar huéspedes:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al cargar huéspedes.",
          tipo: "error",
        });
        return;
      }
      setHuespedes(data || []);
    } catch (err) {
      console.error("Excepción al cargar huéspedes:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar huéspedes.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHuespedes();
  }, []);

  const eliminarHuesped = async () => {
    if (!huespedAEliminar) return;
    try {
      setMostrarModalEliminacion(false);
      const { error } = await supabase
        .from("huesped")
        .delete()
        .eq("id_huesped", huespedAEliminar.id_huesped);

      if (error) {
        setToast({
          mostrar: true,
          mensaje: `Error al eliminar el huésped.`,
          tipo: "error",
        });
        return;
      }

      await cargarHuespedes();
      setToast({
        mostrar: true,
        mensaje: `Huésped eliminado exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al eliminar huésped.",
        tipo: "error",
      });
    }
  };

  const actualizarHuesped = async () => {
    try {
      if (!huespedEditar.primer_nombre.trim() || !huespedEditar.primer_apellido.trim() || !huespedEditar.cedula_pasaporte.trim()) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar nombre, apellido y cédula/pasaporte.",
          tipo: "advertencia",
        });
        return;
      }

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
        mensaje: `Huésped actualizado exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al actualizar huésped.",
        tipo: "error",
      });
    }
  };

  return (
    <Container className="mt-3">
      {/* Título y botón Nuevo Huésped */}
      <Row className="align-items-center mb-3">
        <Col xs={9} sm={7} md={7} lg={7} className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi-people-fill me-2"></i> Huéspedes
          </h3>
        </Col>
        <Col xs={3} sm={5} md={5} lg={5} className="text-end">
          <Button onClick={() => setMostrarModal(true)} size="md">
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Nuevo Huésped</span>
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
            placeholder="Buscar por nombre, apellido, cédula o lugar de origen..."
          />
        </Col>
      </Row>

      {/* Mensaje sin resultados */}
      {!cargando && textoBusqueda.trim() && huespedesFiltrados.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron huéspedes que coincidan con "{textoBusqueda}".
            </Alert>
          </Col>
        </Row>
      )}

      {/* Cargando */}
      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando huéspedes...</p>
          </Col>
        </Row>
      )}

      {/* Lista */}
      {!cargando && huespedesFiltrados.length > 0 && (
        <Row>
          <Col xs={12} sm={12} md={12} className="d-lg-none">
            <TarjetaHuesped
              huespedes={huespedesPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
          <Col lg={12} className="d-none d-lg-block">
            <TablaHuesped
              huespedes={huespedesPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}

      {/* Paginación */}
      {huespedesFiltrados.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={huespedesFiltrados.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      {/* Modales */}
      <ModalRegistroHuesped
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoHuesped={nuevoHuesped}
        manejoCambioInput={manejoCambioInput}
        agregarHuesped={agregarHuesped}
      />

      <ModalEliminacionHuesped
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarHuesped={eliminarHuesped}
        huesped={huespedAEliminar}
      />

      <ModalEdicionHuesped
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        huespedEditado={huespedEditar}  
        manejoCambioInput={manejoCambioInputEdicion}
        actualizarHuesped={actualizarHuesped}
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

export default Huespedes;