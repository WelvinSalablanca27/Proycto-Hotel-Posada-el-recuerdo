import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  Button,
  Form,
  Spinner,
  Table,
  Badge,
  Card
} from 'react-bootstrap';

import {
  GoogleGenerativeAI
} from "@google/generative-ai";

import {
  supabase
} from '../../database/supabaseconfig';

import "bootstrap-icons/font/bootstrap-icons.css";

const ChatIA = ({ mostrar, onCerrar }) => {

  const [mensajes, setMensajes] = useState([]);
  const [entrada, setEntrada] = useState('');
  const [cargando, setCargando] = useState(false);

  const finChatRef = useRef(null);

  const genAI = new GoogleGenerativeAI(
    import.meta.env.VITE_GEMINI_API_KEY
  );

  const contextoBaseDatos = `
Sistema de Gestión Hotelera.

Tablas disponibles:

- Huesped
  (id_huesped, primer_nombre, segundo_nombre,
   primer_apellido, segundo_apellido,
   cedula_pasaporte, lugar_origen)

- Habitacion
  (id_habitacion, numero_habitacion,
   tipo_habitacion, tipo_camas,
   tipo_clima, precio, estado)

- recepcion
  (id_recepcionista, fecha, nombre,
   apellido, hora_entrada,
   hora_salida, turno)

- Reserva
  (id_reserva, id_huesped,
   id_recepcionista, id_habitacion,
   hora_entrada, hora_salida,
   monto, forma_pago, fecha_pago)

Relaciones:
- Reserva.id_huesped → Huesped.id_huesped
- Reserva.id_recepcionista → recepcion.id_recepcionista
- Reserva.id_habitacion → Habitacion.id_habitacion
`;

  const enviarConsulta = async () => {

    if (!entrada.trim()) return;

    const mensajeUsuario = {
      tipo: 'usuario',
      contenido: entrada
    };

    setMensajes(prev => [
      ...prev,
      mensajeUsuario
    ]);

    const consultaActual = entrada;

    setEntrada('');
    setCargando(true);

    try {

      const modelo =
        genAI.getGenerativeModel({
          model: "gemini-2.5-flash"
        });

      const prompt = `
Eres un experto en PostgreSQL.

${contextoBaseDatos}

REGLAS IMPORTANTES:

- Comprende errores ortográficos.
- SOLO genera SELECT.
- NO uses DELETE, UPDATE, INSERT.
- NO uses markdown.
- Devuelve SOLO JSON.

{
  "explicacion": "texto",
  "consulta_sql": "SELECT ..."
}

Consulta:
"${consultaActual}"
`;

      const resultado =
        await modelo.generateContent(prompt);

      let texto =
        resultado.response.text().trim();

      texto = texto
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const match =
        texto.match(/\{[\s\S]*\}/);

      if (!match || !match[0]) {

        throw new Error(
          "No se pudo procesar la consulta"
        );

      }

      const respuestaIA =
        JSON.parse(match[0]);

      let sqlLimpio =
        respuestaIA.consulta_sql.trim();

      sqlLimpio = sqlLimpio
        .replace(/;\s*$/, '');

      const {
        data,
        error
      } = await supabase.rpc(
        'ejecutar_consulta_segura',
        {
          query_sql: sqlLimpio
        }
      );

      if (error) {

        throw new Error(error.message);

      }

      const datosExtraidos =
        Array.isArray(data)
          ? data
          : [];

      const columnasReales =
        datosExtraidos.length > 0
          ? Object.keys(datosExtraidos[0])
          : [];

      const mensajeRespuesta = {
        tipo: 'ia',
        explicacion:
          respuestaIA.explicacion ||
          "Consulta ejecutada correctamente",

        columnas: columnasReales,

        datos: datosExtraidos
      };

      setMensajes(prev => [
        ...prev,
        mensajeRespuesta
      ]);

    } catch (error) {

      setMensajes(prev => [

        ...prev,

        {
          tipo: 'ia',
          explicacion:
            error.message ||
            "Error en la consulta",
          error: true
        }

      ]);

    } finally {

      setCargando(false);

    }

  };

  useEffect(() => {

    finChatRef.current?.scrollIntoView({
      behavior: 'smooth'
    });

  }, [mensajes]);

  return (

    <Modal
      show={mostrar}
      onHide={onCerrar}
      size="xl"
      centered
      backdrop="static"
    >

      {/* HEADER */}
      <Modal.Header
        closeButton
        style={{
          background:
            "linear-gradient(135deg,#0019d4,#0048ff)",
          color: "#fff",
          borderBottom: "none"
        }}
      >

        <Modal.Title
          className="fw-bold d-flex align-items-center gap-2"
        >

          <i className="bi bi-robot"></i>

          Asistente Inteligente IA

        </Modal.Title>

      </Modal.Header>

      {/* BODY */}
      <Modal.Body
        style={{
          backgroundColor: "#f4f7ff",
          height: "72vh",
          overflow: "hidden",
          padding: "20px"
        }}
      >

        <div className="d-flex flex-column h-100">

          {/* CHAT */}
          <div
            className="flex-grow-1 overflow-auto pe-2"
            style={{
              paddingRight: "8px"
            }}
          >

            {/* BIENVENIDA */}
            {mensajes.length === 0 && (

              <Card
                className="border-0 shadow-sm"
                style={{
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg,#ffffff,#eef4ff)"
                }}
              >

                <Card.Body className="text-center p-5">

                  <div
                    style={{
                      fontSize: "70px",
                      color: "#0d6efd"
                    }}
                  >

                    <i className="bi bi-stars"></i>

                  </div>

                  <h3
                    className="fw-bold mt-3"
                    style={{
                      color: "#0019d4"
                    }}
                  >

                    Consultas Inteligentes

                  </h3>

                  <p
                    className="text-muted mt-3"
                    style={{
                      fontSize: "16px"
                    }}
                  >

                    Consulta información del hotel
                    usando lenguaje natural.

                  </p>

                  {/* EJEMPLOS */}
                  <div className="mt-4">

                    <Badge
                      bg="primary"
                      className="m-2 p-3"
                    >
                      Total de reservas
                    </Badge>

                    <Badge
                      bg="success"
                      className="m-2 p-3"
                    >
                      Habitaciones disponibles
                    </Badge>

                    <Badge
                      bg="warning"
                      text="dark"
                      className="m-2 p-3"
                    >
                      Ingresos del mes
                    </Badge>

                    <Badge
                      bg="danger"
                      className="m-2 p-3"
                    >
                      Top huéspedes
                    </Badge>

                  </div>

                </Card.Body>

              </Card>

            )}

            {/* MENSAJES */}
            {mensajes.map((msg, index) => (

              <div
                key={index}
                className={`mb-4 d-flex ${
                  msg.tipo === 'usuario'
                    ? 'justify-content-end'
                    : 'justify-content-start'
                }`}
              >

                <div
                  style={{
                    maxWidth: "90%"
                  }}
                >

                  {/* USUARIO */}
                  {msg.tipo === 'usuario' ? (

                    <div
                      style={{
                        background:
                          "linear-gradient(135deg,#0d6efd,#0048ff)",
                        color: "#fff",
                        padding: "15px 18px",
                        borderRadius: "18px 18px 5px 18px",
                        boxShadow:
                          "0 4px 12px rgba(0,0,0,0.15)"
                      }}
                    >

                      <div className="fw-bold mb-1">

                        <i className="bi bi-person-circle me-2"></i>

                        Tú

                      </div>

                      {msg.contenido}

                    </div>

                  ) : (

                    <div
                      style={{
                        background: "#fff",
                        borderRadius:
                          "18px 18px 18px 5px",
                        padding: "18px",
                        border:
                          msg.error
                            ? "2px solid #dc3545"
                            : "1px solid #dee2e6",
                        boxShadow:
                          "0 4px 12px rgba(0,0,0,0.08)"
                      }}
                    >

                      <div
                        className="fw-bold mb-2"
                        style={{
                          color:
                            msg.error
                              ? "#dc3545"
                              : "#0019d4"
                        }}
                      >

                        <i className="bi bi-robot me-2"></i>

                        Asistente IA

                      </div>

                      <p
                        className="mb-3"
                        style={{
                          fontSize: "15px"
                        }}
                      >

                        {msg.explicacion}

                      </p>

                      {/* TABLA */}
                      {msg.datos &&
                        msg.datos.length > 0 && (

                        <div
                          className="table-responsive"
                          style={{
                            borderRadius: "14px",
                            overflow: "hidden"
                          }}
                        >

                          <Table
                            striped
                            hover
                            bordered
                            responsive
                            className="mb-0"
                          >

                            <thead
                              style={{
                                background:
                                  "linear-gradient(135deg,#0019d4,#0048ff)",
                                color: "#fff"
                              }}
                            >

                              <tr>

                                {msg.columnas.map(
                                  (col, i) => (

                                    <th key={i}>

                                      {col.replace(/_/g, ' ')}

                                    </th>

                                  )
                                )}

                              </tr>

                            </thead>

                            <tbody>

                              {msg.datos.map(
                                (fila, i) => (

                                  <tr key={i}>

                                    {msg.columnas.map(
                                      (col, j) => (

                                        <td key={j}>

                                          {fila?.[col] ?? "N/A"}

                                        </td>

                                      )
                                    )}

                                  </tr>

                                )
                              )}

                            </tbody>

                          </Table>

                        </div>

                      )}

                    </div>

                  )}

                </div>

              </div>

            ))}

            {/* LOADING */}
            {cargando && (

              <div className="text-center py-4">

                <Spinner
                  animation="border"
                  variant="primary"
                />

                <div className="mt-2 text-primary fw-semibold">

                  Procesando consulta...

                </div>

              </div>

            )}

            <div ref={finChatRef} />

          </div>

          {/* INPUT */}
          <Form
            className="mt-3"
            onSubmit={(e) => {

              e.preventDefault();

              enviarConsulta();

            }}
          >

            <div
              className="d-flex gap-2"
            >

              <Form.Control
                value={entrada}
                onChange={(e) =>
                  setEntrada(e.target.value)
                }
                placeholder="Escribe tu consulta inteligente..."
                disabled={cargando}
                style={{
                  borderRadius: "14px",
                  padding: "14px",
                  border:
                    "2px solid #dbe4ff",
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.05)"
                }}
              />

              <Button
                variant="primary"
                onClick={enviarConsulta}
                disabled={
                  cargando ||
                  !entrada.trim()
                }
                style={{
                  borderRadius: "14px",
                  padding:
                    "0 22px",
                  fontWeight: "700",
                  boxShadow:
                    "0 4px 12px rgba(0,0,0,0.15)"
                }}
              >

                {cargando ? (

                  <Spinner
                    animation="border"
                    size="sm"
                  />

                ) : (

                  <i className="bi bi-send-fill"></i>

                )}

              </Button>

            </div>

          </Form>

        </div>

      </Modal.Body>

    </Modal>

  );

};

export default ChatIA;