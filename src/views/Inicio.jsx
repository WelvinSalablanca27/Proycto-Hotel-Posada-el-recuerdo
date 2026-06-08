import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spinner, Form, Button } from "react-bootstrap";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { supabase } from "../database/supabaseconfig";
import * as XLSX from "xlsx";

const Inicio = () => {

  // =========================
  // STATES
  // =========================

  const [cargando, setCargando] = useState(true);

  const [fechaDesde, setFechaDesde] = useState(
    new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" })
  );

  const [fechaHasta, setFechaHasta] = useState(
    new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" })
  );

  const [estadisticas, setEstadisticas] = useState({
    totalIngresos: 0,
    reservas: 0,
    reservasEfectivo: 0,
    reservasTarjeta: 0,
    habitacionesOcupadas: 0,
    reservasPorHora: [],
    reservasPorTipoHabitacion: []
  });

  // =========================
  // EFFECT
  // =========================

  useEffect(() => {
    cargarDatos(fechaDesde, fechaHasta);
  }, [fechaDesde, fechaHasta]);

  // =========================
  // CARGAR DATOS
  // =========================

  const cargarDatos = async (desde, hasta) => {
    try {
      setCargando(true);

      const inicioRango = `${desde} 00:00:00`;
      const finRango = `${hasta} 23:59:59`;

      // =========================
      // RESERVAS
      // =========================

      const { data: reservas } = await supabase
        .from("Reserva")
        .select("id_reserva, monto, hora_entrada, forma_pago, id_habitacion")
        .gte("hora_entrada", inicioRango)
        .lte("hora_entrada", finRango);

      // =========================
      // HABITACIONES (SIEMPRE ACTUALIZADO)
      // =========================

      const { data: habitaciones } = await supabase
        .from("Habitacion")
        .select("id_habitacion, tipo_habitacion");

      // =========================
      // TOTALES
      // =========================

      const totalIngresos =
        reservas?.reduce((sum, r) => sum + (r.monto || 0), 0) || 0;

      const reservasEfectivo =
        reservas?.filter(r => r.forma_pago === "efectivo")
          .reduce((sum, r) => sum + (r.monto || 0), 0) || 0;

      const reservasTarjeta =
        reservas?.filter(r => r.forma_pago === "tarjeta")
          .reduce((sum, r) => sum + (r.monto || 0), 0) || 0;

      const habitacionesOcupadas =
        new Set(reservas?.map(r => r.id_habitacion)).size;

      // =========================
      // 🔥 PIE CHART (FIX DEFINITIVO)
      // =========================

      let mapaTipos = {};

      reservas?.forEach(r => {

        const habitacion = habitaciones?.find(
          h => h.id_habitacion === r.id_habitacion
        );

        const tipo = habitacion?.tipo_habitacion || "Sin tipo";

        if (!mapaTipos[tipo]) {
          mapaTipos[tipo] = 0;
        }

        mapaTipos[tipo] += r.monto || 0;
      });

      let reservasPorTipoHabitacion =
        Object.keys(mapaTipos).map(key => ({
          name: key,
          value: mapaTipos[key]
        }));

      // 🔥 SI NO HAY DATOS (EVITA GRÁFICO VACÍO)
      if (reservasPorTipoHabitacion.length === 0) {
        reservasPorTipoHabitacion = [
          { name: "Sin datos", value: 1 }
        ];
      }

      // =========================
      // POR HORA
      // =========================

      const horaMap = Array(24).fill(0);

      reservas?.forEach(r => {
        if (!r.hora_entrada) return;

        const hora = new Date(r.hora_entrada).getHours();
        horaMap[hora] += r.monto || 0;
      });

      const reservasPorHora = [];
      let acumulado = 0;

      for (let h = 8; h <= 22; h++) {
        acumulado += horaMap[h];

        reservasPorHora.push({
          hora: `${h.toString().padStart(2, "0")}:00`,
          total: Math.round(acumulado)
        });
      }

      // =========================
      // SET STATE FINAL
      // =========================

      setEstadisticas({
        totalIngresos,
        reservas: reservas?.length || 0,
        reservasEfectivo,
        reservasTarjeta,
        habitacionesOcupadas,
        reservasPorHora,
        reservasPorTipoHabitacion
      });

    } catch (err) {
      console.error("Error:", err);
    } finally {
      setCargando(false);
    }
  };

  // =========================
  // EXCEL
  // =========================

  const descargarExcel = async () => {
    const { data } = await supabase.from("Reserva").select("*");

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(data || []),
      "Reservas"
    );

    XLSX.writeFile(wb, "reservas.xlsx");
  };

  // =========================
  // COLORES
  // =========================

  const COLORES = ["#5e26b2", "#39ff95", "#ff6bc6", "#00d4ff", "#ffa500"];

  // =========================
  // LOADING
  // =========================

  if (cargando) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Cargando...</p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="mt-2">

      <h2>Dashboard Hotelero</h2>
      <h6>Posada El Recuerdo</h6>

      {/* FILTROS */}
      <Row className="mb-4">

        <Col md={3}>
          <Form.Control type="date" value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)} />
        </Col>

        <Col md={3}>
          <Form.Control type="date" value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)} />
        </Col>

        <Col md={3}>
          <Button onClick={descargarExcel}>
            Exportar Excel
          </Button>
        </Col>

      </Row>

      {/* TARJETAS */}
      <Row className="g-4 mb-4">

        <Col md={3}>
          <Card className="bg-success text-white">
            <Card.Body>
              <h6>Ingresos</h6>
              <h3>C$ {estadisticas.totalIngresos.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="bg-primary text-white">
            <Card.Body>
              <h6>Reservas</h6>
              <h3>{estadisticas.reservas}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="bg-warning text-white">
            <Card.Body>
              <h6>Efectivo</h6>
              <h3>C$ {estadisticas.reservasEfectivo.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="bg-dark text-white">
            <Card.Body>
              <h6>Habitaciones ocupadas</h6>
              <h3>{estadisticas.habitacionesOcupadas}</h3>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      {/* GRÁFICOS */}
      <Row>

        {/* LINE */}
        <Col lg={8}>
          <Card>
            <Card.Body>
              <h5>Ingresos por Hora</h5>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={estadisticas.reservasPorHora}>
                  <XAxis dataKey="hora" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#5e26b2" />
                </LineChart>
              </ResponsiveContainer>

            </Card.Body>
          </Card>
        </Col>

        {/* PIE (YA FUNCIONA AL REGISTRAR HABITACIONES) */}
        <Col lg={4}>
          <Card>
            <Card.Body>
              <h5>Tipos de Habitación</h5>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={estadisticas.reservasPorTipoHabitacion}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {estadisticas.reservasPorTipoHabitacion.map((_, i) => (
                      <Cell key={i} fill={COLORES[i % COLORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

            </Card.Body>
          </Card>
        </Col>

      </Row>

    </div>
  );
};

export default Inicio;