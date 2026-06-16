import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Table } from 'react-bootstrap';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '../../database/supabaseconfig';

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
  (id_huesped, primer_nombre, segundo_nombre, primer_apellido,
   segundo_apellido, cedula_pasaporte, lugar_origen)

- Habitacion
  (id_habitacion, numero_habitacion, tipo_habitacion,
   tipo_camas, tipo_clima, precio, estado)

- recepcion
  (id_recepcionista, fecha, nombre, apellido,
   hora_entrada, hora_salida, turno)

- Reserva
  (id_reserva, id_huesped, id_recepcionista,
   id_habitacion, hora_entrada, hora_salida,
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

    setMensajes(prev => [...prev, mensajeUsuario]);

    const consultaActual = entrada;

    setEntrada('');
    setCargando(true);

    try {

      const modelo = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
      });

      const prompt = `
Eres un experto en PostgreSQL.

${contextoBaseDatos}

REGLAS IMPORTANTES:

- Comprende errores ortográficos del usuario.
- SOLO genera consultas SELECT.
- NO uses DELETE, UPDATE, INSERT, DROP.
- NO uses punto y coma al final.
- Usa exactamente los nombres de tablas y columnas dados.
- NO agregues markdown.
- NO agregues explicación fuera del JSON.
- Devuelve SOLO este JSON:

{
  "explicacion": "texto",
  "consulta_sql": "SELECT ...",
  "columnas": ["columna1", "columna2"]
}

Consulta del usuario:
"${consultaActual}"
`;

      const resultado = await modelo.generateContent(prompt);

      let texto = resultado.response.text().trim();

      // Limpiar markdown
      texto = texto
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      // Extraer JSON
      const match = texto.match(/\{[\s\S]*\}/);

      if (!match || !match[0]) {
        throw new Error("No se pudo extraer JSON");
      }

      const respuestaIA = JSON.parse(match[0]);

      let sqlLimpio = respuestaIA.consulta_sql.trim();

      // Limpiar SQL
      sqlLimpio = sqlLimpio.replace(/;\s*$/, '');
      sqlLimpio = sqlLimpio.replace(/\)\s*\)/g, ')');
      sqlLimpio = sqlLimpio.replace(/,\s*\)/g, ')');

      console.log("SQL GENERADO:", sqlLimpio);

      // Ejecutar RPC Supabase
      const { data, error } = await supabase.rpc(
        'ejecutar_consulta_segura',
        {
          query_sql: sqlLimpio
        }
      );

      console.log("DATA SUPABASE:", data);

      if (error) {
        console.error("ERROR SUPABASE:", error);

        throw new Error(
          `Error SQL: ${error.message}`
        );
      }

      // Validar datos
      const datosExtraidos = Array.isArray(data)
        ? data
        : [];

      console.log("DATOS EXTRAIDOS:", datosExtraidos);

      // Obtener columnas reales
      const columnasReales =
        datosExtraidos.length > 0
          ? Object.keys(datosExtraidos[0])
          : [];

      console.log("COLUMNAS:", columnasReales);

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

      console.error("ERROR COMPLETO:", error);

      setMensajes(prev => [
        ...prev,
        {
          tipo: 'ia',
          explicacion:
            error.message ||
            "No entendí tu consulta.",
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

      <Modal.Header closeButton>
        <Modal.Title>
          Consultas Inteligentes
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          height: "68vh",
          overflowY: "auto"
        }}
      >

        <div className="d-flex flex-column h-100">

          <div className="flex-grow-1 overflow-auto mb-3 pe-2">

            {mensajes.length === 0 && (
              <div className="text-center text-muted mt-5">

                <h5>
                  ¿Qué información necesitas?
                </h5>

                <p className="mt-2">
                  Ejemplos:
                </p>

                <ul className="text-start">
                  <li>Total de reservas del mes actual</li>
                  <li>Top 10 habitaciones más reservadas</li>
                  <li>Huéspedes con más reservas</li>
                  <li>Ingresos totales</li>
                  <li>Habitaciones disponibles</li>
                  <li>Métodos de pago más usados</li>
                  <li>Ingresos por habitación</li>
                </ul>

              </div>
            )}

            {mensajes.map((msg, index) => (

              <div
                key={index}
                className={`mb-4 ${
                  msg.tipo === 'usuario'
                    ? 'text-end'
                    : ''
                }`}
              >

                <div
                  className={`
                    d-inline-block
                    p-3
                    rounded-3
                    ${
                      msg.tipo === 'usuario'
                        ? 'bg-primary text-white'
                        : 'bg-light border'
                    }
                  `}
                  style={{
                    maxWidth: '90%'
                  }}
                >

                  <strong>
                    {msg.tipo === 'usuario'
                      ? 'Tú:'
                      : 'Asistente IA:'}
                  </strong>

                  <br />

                  {msg.tipo === 'usuario' ? (

                    <p className="mb-0">
                      {msg.contenido}
                    </p>

                  ) : (

                    <>
                      <p className="mb-2">
                        {msg.explicacion}
                      </p>

                      {msg.datos &&
                        msg.datos.length > 0 && (

                        <Table
                          striped
                          bordered
                          hover
                          size="sm"
                          responsive
                          className="mt-3"
                        >

                          <thead>
                            <tr>
                              {msg.columnas.map((col, i) => (
                                <th key={i}>
                                  {col.replace(/_/g, ' ')}
                                </th>
                              ))}
                            </tr>
                          </thead>

                          <tbody>

                            {Array.isArray(msg.datos) &&
                              msg.datos.map((fila, i) => (

                              <tr key={i}>

                                {msg.columnas.map((col, j) => (

                                  <td key={j}>
                                    {fila?.[col] ?? "N/A"}
                                  </td>

                                ))}

                              </tr>

                            ))}

                          </tbody>

                        </Table>

                      )}

                    </>

                  )}

                </div>

              </div>

            ))}

            {cargando && (
              <div className="text-center py-3">

                <Spinner
                  animation="border"
                  size="sm"
                />

                {" "}Procesando consulta...

              </div>
            )}

            <div ref={finChatRef} />

          </div>

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              enviarConsulta();
            }}
          >

            <div className="d-flex gap-2">

              <Form.Control
                value={entrada}
                onChange={(e) =>
                  setEntrada(e.target.value)
                }
                placeholder="Escribe tu consulta..."
                disabled={cargando}
              />

              <Button
                variant="primary"
                onClick={enviarConsulta}
                disabled={
                  cargando ||
                  !entrada.trim()
                }
              >
                Enviar
              </Button>

            </div>

          </Form>

        </div>

      </Modal.Body>

    </Modal>
  );
};

export default ChatIA;