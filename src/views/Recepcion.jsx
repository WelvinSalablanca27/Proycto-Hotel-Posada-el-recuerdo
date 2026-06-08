import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import CuadrosBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";
import NotificacionOperacion from "../components/NotificacionOperacion";

import TablaRecepcion from "../components/recepcion/TablaRecepcion";
import ModalRegistroRecepcion from "../components/recepcion/ModalRegistroRecepcion";
import ModalEdicionRecepcion from "../components/recepcion/ModalEdicionRecepcion";
import ModalEliminacionRecepcion from "../components/recepcion/ModalEliminacionRecepcion";

const Recepcion = () => {

  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "",
  });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [cargando, setCargando] = useState(true);

  const [recepcionistas, setRecepcionistas] = useState([]);
  const [recepcionistasFiltrados, setRecepcionistasFiltrados] = useState([]);

  const [recepcionistaAEliminar, setRecepcionistaAEliminar] = useState(null);

  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const [nuevoRecepcionista, setNuevoRecepcionista] = useState({
    fecha: "",
    nombre: "",
    apellido: "",
    hora_entrada: "",
    hora_salida: "",
    turno: "",
  });

  const [recepcionistaEditar, setRecepcionistaEditar] = useState({
    id_recepcionista: "",
    fecha: "",
    nombre: "",
    apellido: "",
    hora_entrada: "",
    hora_salida: "",
    turno: "",
  });

  useEffect(() => {
    cargarRecepcionistas();
  }, []);

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setRecepcionistasFiltrados(recepcionistas);
    } else {

      const texto = textoBusqueda.toLowerCase().trim();

      const filtrados = recepcionistas.filter(
        (r) =>
          r.nombre?.toLowerCase().includes(texto) ||
          r.apellido?.toLowerCase().includes(texto) ||
          r.turno?.toLowerCase().includes(texto)
      );

      setRecepcionistasFiltrados(filtrados);
    }
  }, [textoBusqueda, recepcionistas]);

  const recepcionistasPaginados = recepcionistasFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const manejoBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;

    setNuevoRecepcionista((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;

    setRecepcionistaEditar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const cargarRecepcionistas = async () => {
    try {

      setCargando(true);

      const { data, error } = await supabase
        .from("recepcion")
        .select("*")
        .order("id_recepcionista", { ascending: true });

      if (error) {
        setToast({
          mostrar: true,
          mensaje: "Error al cargar recepcionistas",
          tipo: "error",
        });
        return;
      }

      setRecepcionistas(data || []);

    } catch (error) {

      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar datos",
        tipo: "error",
      });

    } finally {
      setCargando(false);
    }
  };

  const agregarRecepcionista = async () => {
    try {

      if (
        !nuevoRecepcionista.fecha ||
        !nuevoRecepcionista.nombre.trim() ||
        !nuevoRecepcionista.apellido.trim() ||
        !nuevoRecepcionista.hora_entrada ||
        !nuevoRecepcionista.hora_salida ||
        !nuevoRecepcionista.turno.trim()
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe completar todos los campos",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase
        .from("recepcion")
        .insert([nuevoRecepcionista]);

      if (error) {
        setToast({
          mostrar: true,
          mensaje: "Error al registrar recepcionista",
          tipo: "error",
        });
        return;
      }

      await cargarRecepcionistas();

      setToast({
        mostrar: true,
        mensaje: "Recepcionista registrado correctamente",
        tipo: "exito",
      });

      setNuevoRecepcionista({
        fecha: "",
        nombre: "",
        apellido: "",
        hora_entrada: "",
        hora_salida: "",
        turno: "",
      });

      setMostrarModal(false);

    } catch (error) {
      console.error(error);
    }
  };

  const actualizarRecepcionista = async () => {
    try {

      if (
        !recepcionistaEditar.fecha ||
        !recepcionistaEditar.nombre.trim() ||
        !recepcionistaEditar.apellido.trim() ||
        !recepcionistaEditar.hora_entrada ||
        !recepcionistaEditar.hora_salida ||
        !recepcionistaEditar.turno.trim()
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe completar todos los campos",
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
        .eq(
          "id_recepcionista",
          recepcionistaEditar.id_recepcionista
        );

      if (error) {
        setToast({
          mostrar: true,
          mensaje: "Error al actualizar recepcionista",
          tipo: "error",
        });
        return;
      }

      await cargarRecepcionistas();

      setMostrarModalEdicion(false);

      setToast({
        mostrar: true,
        mensaje: "Recepcionista actualizado correctamente",
        tipo: "exito",
      });

    } catch (error) {
      console.error(error);
    }
  };

  const eliminarRecepcionista = async () => {

    if (!recepcionistaAEliminar) return;

    try {

      const { error } = await supabase
        .from("recepcion")
        .delete()
        .eq(
          "id_recepcionista",
          recepcionistaAEliminar.id_recepcionista
        );

      if (error) {
        setToast({
          mostrar: true,
          mensaje: "Error al eliminar recepcionista",
          tipo: "error",
        });
        return;
      }

      await cargarRecepcionistas();

      setMostrarModalEliminacion(false);

      setToast({
        mostrar: true,
        mensaje: "Recepcionista eliminado correctamente",
        tipo: "exito",
      });

    } catch (error) {
      console.error(error);
    }
  };

  const abrirModalEdicion = (recepcionista) => {
    setRecepcionistaEditar(recepcionista);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (recepcionista) => {
    setRecepcionistaAEliminar(recepcionista);
    setMostrarModalEliminacion(true);
  };

  return (
    <Container className="mt-3">

      <Row className="align-items-center mb-3">
        <Col xs={9}>
          <h3 className="mb-0">
            <i className="bi-person-badge-fill me-2"></i>
            Recepcionistas
          </h3>
        </Col>

        <Col xs={3} className="text-end">
          <Button onClick={() => setMostrarModal(true)}>
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">
              Nuevo Recepcionista
            </span>
          </Button>
        </Col>
      </Row>

      <hr />

      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadrosBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejoBusqueda}
          />
        </Col>
      </Row>

      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">
              Cargando recepcionistas...
            </p>
          </Col>
        </Row>
      )}

      {!cargando && (
        <TablaRecepcion
          recepcionistas={recepcionistasPaginados}
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
        />
      )}

      <Paginacion
        registrosPorPagina={registrosPorPagina}
        totalRegistros={recepcionistasFiltrados.length}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
        establecerRegistrosPorPagina={establecerRegistrosPorPagina}
      />

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

export default Recepcion;

