import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card, Spinner, Form, Button } from "react-bootstrap";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { supabase } from "../database/supabaseconfig";
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

const Inicio = () => {

  // =========================
  // STATES
  // =========================

  const [cargando, setCargando] = useState(true);

  const graficoHoraRef = useRef(null);
  const graficoTiposHabitacionRef = useRef(null);

  const hoy = new Date();
  const fechaActual = hoy.toLocaleDateString("en-CA", {
    timeZone: "America/Managua"
  });

  const fechaInicioPredeterminada = new Date(hoy);
  fechaInicioPredeterminada.setDate(fechaInicioPredeterminada.getDate() - 30);

  const [fechaDesde, setFechaDesde] = useState(
    fechaInicioPredeterminada.toLocaleDateString("en-CA", {
      timeZone: "America/Managua"
    })
  );

  const [fechaHasta, setFechaHasta] = useState(fechaActual);
  const generarPdfReservasHora = async () => {
    try {

      const pdf = new jsPDF("p", "mm", "a4");

      //Título y fecha
      pdf.setFontSize(18);
      pdf.setTextColor("#330775");
      pdf.setFont("helvetica", "bold");
      pdf.text("Reporte de Reservas por Hora", 14, 15);

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor("#000000");
      pdf.setFontSize(10);

      pdf.text(`Periodo: ${fechaDesde} - ${fechaHasta}`, 14, 22);

      // Imagen del gráfico
      const canvas = await html2canvas(graficoHoraRef.current);
      const imagen = canvas.toDataURL("image/png");

      pdf.addImage(imagen, "PNG", 10, 30, 190, 80);

      // Resumen general
      pdf.setFontSize(14);
      pdf.setTextColor("#330775");
      pdf.setFont("helvetica", "bold");

      pdf.text("Resumen General", 14, 115);

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor("#000000");
      pdf.setFontSize(10);

      pdf.text(
        `Total Ingresos: C$ ${estadisticas.totalIngresos.toFixed(2)}`,
        14,
        125
      );

      pdf.text(
        `Reservas: ${estadisticas.reservas}`,
        14,
        132
      );

      pdf.text(
        `Reservas Efectivo: C$ ${estadisticas.reservasEfectivo.toFixed(2)}`,
        14,
        139
      );

      pdf.text(
        `Reservas Tarjeta: C$ ${estadisticas.reservasTarjeta.toFixed(2)}`,
        14,
        146
      );

      pdf.text(
        `Habitaciones Ocupadas: ${estadisticas.habitacionesOcupadas}`,
        14,
        153
      );

      // Tabla de reservas por hora
      const filas = estadisticas.reservasPorHora.map(item => [
        item.hora,
        `C$ ${item.total}`
      ]);

      autoTable(pdf, {
        startY: 160,
        head: [["Hora", "Monto Acumulado"]],
        body: filas
      });

      // Descargar PDF
      const fechaActual = new Date().toLocaleDateString(
        "en-CA",
        { timeZone: "America/Managua" }
      );

      pdf.save(
        `ReservasHora_${fechaDesde}_${fechaHasta}_Generado_${fechaActual}.pdf`
      );

    } catch (error) {
      console.error(error);
      alert("Error generando PDF");
    }
  };

  const generarPdfTiposHabitacion = async () => {

    try {

      const pdf = new jsPDF("p", "mm", "a4");

      pdf.setFontSize(18);
      pdf.setTextColor("#330775");
      pdf.setFont("helvetica", "bold");

      pdf.text("Reporte de Tipos de Habitación", 14, 15);

      pdf.setFontSize(10);
      pdf.setTextColor("#000000");
      pdf.setFont("helvetica", "normal");

      pdf.text(
        `Periodo: ${fechaDesde} - ${fechaHasta}`,
        14,
        22
      );

      // CAPTURAR GRAFICO

      const canvas = await html2canvas(
        graficoTiposHabitacionRef.current
      );

      const imagen = canvas.toDataURL("image/png");

      pdf.addImage(
        imagen,
        "PNG",
        10,
        30,
        190,
        90
      );

      // TABLA

      const filas =
        estadisticas.reservasPorTipoHabitacion.map(
          (item) => [
            item.name,
            `C$ ${item.value.toFixed(2)}`
          ]
        );

      autoTable(pdf, {
        startY: 130,
        head: [["Tipo Habitación", "Monto"]],
        body: filas
      });

      const fechaActual =
        new Date().toLocaleDateString(
          "en-CA",
          {
            timeZone: "America/Managua"
          }
        );

      pdf.save(
        `TiposHabitacion_${fechaActual}.pdf`
      );

    } catch (error) {

      console.error(error);

      alert("Error generando PDF");
    }
  };

  const generarPdfGeneral = async () => {

    try {

      const pdf = new jsPDF("p", "mm", "a4");

      // =========================
      // TITULO
      // =========================

      pdf.setFontSize(20);
      pdf.setTextColor("#330775");
      pdf.setFont("helvetica", "bold");

      pdf.text(
        "Reporte General de Estadísticas del Hotel",
        14,
        15
      );

      pdf.setFontSize(10);
      pdf.setTextColor("#000000");
      pdf.setFont("helvetica", "normal");

      pdf.text(
        `Periodo: ${fechaDesde} - ${fechaHasta}`,
        14,
        24
      );

      // =========================
      // RESUMEN GENERAL
      // =========================

      pdf.setFontSize(14);
      pdf.setTextColor("#330775");
      pdf.setFont("helvetica", "bold");

      pdf.text("Resumen General", 14, 35);

      pdf.setFontSize(11);
      pdf.setTextColor("#000000");
      pdf.setFont("helvetica", "normal");

      pdf.text(
        `Ingresos Totales: C$ ${estadisticas.totalIngresos.toFixed(2)}`,
        14,
        45
      );

      pdf.text(
        `Reservas: ${estadisticas.reservas}`,
        14,
        53
      );

      pdf.text(
        `Reservas Efectivo: C$ ${estadisticas.reservasEfectivo.toFixed(2)}`,
        14,
        61
      );

      pdf.text(
        `Reservas Tarjeta: C$ ${estadisticas.reservasTarjeta.toFixed(2)}`,
        14,
        69
      );

      pdf.text(
        `Habitaciones Ocupadas: ${estadisticas.habitacionesOcupadas}`,
        14,
        77
      );

      // =========================
      // GRAFICO HORA
      // =========================

      const canvasHora = await html2canvas(
        graficoHoraRef.current
      );

      const imgHora =
        canvasHora.toDataURL("image/png");

      pdf.setFontSize(14);
      pdf.setTextColor("#330775");
      pdf.setFont("helvetica", "bold");

      pdf.text(
        "Reservas por Hora",
        14,
        90
      );

      pdf.addImage(
        imgHora,
        "PNG",
        10,
        95,
        190,
        70
      );

      // =========================
      // NUEVA PAGINA
      // =========================

      pdf.addPage();

      // =========================
      // GRAFICO Hbaitacion
      // =========================

      const canvasCategoria =
        await html2canvas(
          graficoTiposHabitacionRef.current
        );

      const imgCategoria =
        canvasCategoria.toDataURL("image/png");

      pdf.setFontSize(14);
      pdf.setTextColor("#330775");
      pdf.setFont("helvetica", "bold");

      pdf.text(
        "Tipos de Habitación",
        14,
        20
      );

      pdf.addImage(
        imgCategoria,
        "PNG",
        10,
        30,
        190,
        90
      );

      // =========================
      // TABLA CATEGORIAS
      // =========================

      const filasCategoria =
        estadisticas.reservasPorTipoHabitacion.map(
          (item) => [
            item.name,
            `C$ ${item.value.toFixed(2)}`
          ]
        );

      autoTable(pdf, {
        startY: 130,
        head: [["Tipo Habitación", "Monto"]],
        body: filasCategoria
      });

      // =========================
      // GUARDAR
      // =========================

      const fechaActual =
        new Date().toLocaleDateString(
          "en-CA",
          {
            timeZone: "America/Managua"
          }
        );

      pdf.save(
        `ReporteGeneral_${fechaActual}.pdf`
      );

    } catch (error) {

      console.error(error);

      alert("Error generando PDF General");
    }
  };

  const [estadisticas, setEstadisticas] = useState({
    totalIngresos: 0,
    reservasEfectivo: 0,
    reservasTarjeta: 0,
    reservasTransferencia: 0,
    habitacionesOcupadas: 0,
    reservas: 0,
    reservasPorHora: [],
    reservasPorTipoHabitacion: []
  });

  // =========================
  // EFFECTS
  // =========================

  useEffect(() => {
    cargarDatos(fechaDesde, fechaHasta);
  }, [fechaDesde, fechaHasta]);

  // =========================
  // FUNCIONES
  // =========================

  const cargarDatos = async (desde, hasta) => {
    try {
      setCargando(true);

      const inicioRango = `${desde}T00:00:00`;
      const finRango = `${hasta}T23:59:59`;

      console.log("🔍 Buscando entre:", inicioRango, "y", finRango);

      // =========================
      // RESERVAS
      // =========================

      const { data: reservas, error } = await supabase
        .from("reserva")
        .select("id_reserva, monto, hora_entrada, forma_pago, id_habitacion")
        .gte("hora_entrada", inicioRango)
        .lte("hora_entrada", finRango);

      if (error) {
        console.error("❌ Error Supabase:", error);
        throw error;
      }

      console.log("✅ Reservas obtenidas:", reservas?.length, reservas);

      // =========================
      // HABITACIONES
      // =========================

      const { data: habitaciones, error: errorHabitaciones } = await supabase
        .from("habitacion")
        .select("id_habitacion, tipo_habitacion");

      if (errorHabitaciones) {
        console.error("❌ Error habitaciones:", errorHabitaciones);
        throw errorHabitaciones;
      }

      console.log("✅ Habitaciones obtenidas:", habitaciones?.length);

      // =========================
      // DATOS TIPO HABITACION
      // =========================

      let reservasPorTipoHabitacion = [];

      if (reservas && reservas.length > 0) {

        const tipoMap = {};

        reservas.forEach((r) => {

          const habitacion = habitaciones?.find(
            (h) => h.id_habitacion === r.id_habitacion
          );

          const tipo = habitacion?.tipo_habitacion || "Sin tipo";

          if (!tipoMap[tipo]) {
            tipoMap[tipo] = 0;
          }

          tipoMap[tipo] += r.monto || 0;
        });

        reservasPorTipoHabitacion = Object.keys(tipoMap).map(
          (key) => ({
            name: key,
            value: tipoMap[key]
          })
        );

        reservasPorTipoHabitacion.sort((a, b) => b.value - a.value);
        console.log("📊 Tipos habitación:", reservasPorTipoHabitacion);
      }

      // =========================
      // TOTALES
      // =========================

      const totalIngresos =
        reservas?.reduce((sum, r) => sum + (r.monto || 0), 0) || 0;

      const reservasEfectivo =
        reservas
          ?.filter((r) => r.forma_pago === "efectivo")
          .reduce((sum, r) => sum + (r.monto || 0), 0) || 0;

      const reservasTarjeta =
        reservas
          ?.filter((r) => r.forma_pago === "tarjeta")
          .reduce((sum, r) => sum + (r.monto || 0), 0) || 0;

      const reservasTransferencia =
        reservas
          ?.filter((r) => r.forma_pago === "transferencia")
          .reduce((sum, r) => sum + (r.monto || 0), 0) || 0;

      const habitacionesOcupadas =
        new Set(reservas?.map((r) => r.id_habitacion)).size || 0;

      console.log("💰 Totales:", { totalIngresos, reservasEfectivo, reservasTarjeta, habitacionesOcupadas });

      // =========================
      // RESERVAS POR HORA
      // =========================

      const horaMap = Array(24).fill(0);

      reservas?.forEach((reserva) => {
        if (!reserva.hora_entrada) {
          console.warn("⚠️ Reserva sin hora_entrada:", reserva);
          return;
        }

        try {
          const fechaObj = new Date(reserva.hora_entrada);
          const hora = fechaObj.getHours();

          console.log(`📅 Reserva: ${reserva.hora_entrada} → Hora: ${hora}, Monto: ${reserva.monto}`);

          if (hora >= 0 && hora < 24) {
            horaMap[hora] += reserva.monto || 0;
          }
        } catch (err) {
          console.error("❌ Error parseando fecha:", reserva.hora_entrada, err);
        }
      });

      console.log("⏰ HoraMap:", horaMap);

      const reservasPorHora = [];
      let acumulado = 0;

      for (let h = 8; h <= 22; h++) {
        acumulado += horaMap[h];

        reservasPorHora.push({
          hora: `${h.toString().padStart(2, "0")}:00`,
          total: Math.round(acumulado)
        });
      }

      console.log("📈 Datos gráfico línea:", reservasPorHora);

      // =========================
      // SET ESTADISTICAS
      // =========================

      const estadisticasFinales = {
        totalIngresos,
        reservasEfectivo,
        reservasTarjeta,
        reservasTransferencia,
        habitacionesOcupadas,
        reservas: reservas?.length || 0,
        reservasPorHora,
        reservasPorTipoHabitacion
      };

      console.log("🎯 Estado final:", estadisticasFinales);

      setEstadisticas(estadisticasFinales);

    } catch (err) {

      console.error("❌ Error al cargar estadísticas:", err);

    } finally {

      setCargando(false);
    }
  }

  // =========================
  // DESCARGAR EXCEL
  // =========================

  const descargarExcel = async () => {

    try {

      setCargando(true);

      const inicioRango = `${fechaDesde} 00:00:00`;
      const finRango = `${fechaHasta} 23:59:59`;

      // =========================
      // OBTENER RESERVAS
      // =========================

      const { data: reservas, error: errorReservas } = await supabase
        .from("reserva")
        .select(`
          id_reserva,
          hora_entrada,
          monto,
          forma_pago
        `)
        .gte("hora_entrada", inicioRango)
        .lte("hora_entrada", finRango)
        .order("hora_entrada", { ascending: false });

      if (errorReservas) throw errorReservas;

      // =========================
      // CREAR EXCEL
      // =========================

      const wb = XLSX.utils.book_new();

      // HOJA RESERVAS

      if (reservas && reservas.length > 0) {

        const wsReservas = XLSX.utils.json_to_sheet(reservas);

        XLSX.utils.book_append_sheet(
          wb,
          wsReservas,
          "Reservas"
        );

      } else {

        XLSX.utils.book_append_sheet(
          wb,
          XLSX.utils.json_to_sheet([
            {
              Mensaje: "No hay reservas en este rango"
            }
          ]),
          "Reservas"
        );
      }

      XLSX.writeFile(
        wb,
        `Reporte_Reservas_${fechaDesde}_a_${fechaHasta}.xlsx`
      );

    } catch (err) {

      console.error("Error generando Excel:", err);

      alert("Error al generar el Excel. Revisa la consola.");

    } finally {

      setCargando(false);
    }
  };

  // =========================
  // COLORES
  // =========================

  const COLORES = [
    "#5e26b2",
    "#39ff95",
    "#ff6bc6",
    "#8b46ff",
    "#00d4ff",
    "#ffd93d"
  ];

  // =========================
  // LOADING
  // =========================

  if (cargando) {
    return (
      <Container className="text-center mt-5">
        <Spinner
          animation="border"
          variant="primary"
          size="lg"
        />

        <p className="mt-3">
          Cargando estadísticas...
        </p>
      </Container>
    );
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="mt-2">

      {/* TITULO */}

      <div className="mb-4">
        <h2>Dashboard</h2>
        <h6>Estadísticas del Hotel</h6>
      </div>

      {/* FILTROS */}

      <Row className="mb-4">

        <Col md={3}>
          <Form.Control
            type="date"
            value={fechaDesde}
            onChange={(e) =>
              setFechaDesde(e.target.value)
            }
          />
        </Col>

        <Col md={3}>
          <Form.Control
            type="date"
            value={fechaHasta}
            onChange={(e) =>
              setFechaHasta(e.target.value)
            }
          />
        </Col>

        <Col
          md={6}
          className="d-flex gap-2"
        >

          <Button
            variant="success"
            onClick={descargarExcel}
          >
            <i className="bi bi-file-earmark-excel me-2"></i>

            Exportar Excel
          </Button>

          <Button
            variant="danger"
            onClick={generarPdfGeneral}
          >
            <i className="bi bi-file-earmark-pdf me-2"></i>

            PDF General
          </Button>

        </Col>

      </Row>
      {/* TARJETAS */}

      <Row className="g-4 mb-5">

        <Col md={6} lg={3}>
          <Card
            className="h-100 text-white shadow"
            style={{
              background:
                "linear-gradient(135deg, #28a745, #34ce57)"
            }}
          >
            <Card.Body>
              <h5>Ingresos Totales</h5>

              <h2>
                C$ {estadisticas.totalIngresos.toFixed(2)}
              </h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card
            className="h-100 text-white shadow"
            style={{
              background:
                "linear-gradient(135deg, #0166d3, #3399ff)"
            }}
          >
            <Card.Body>
              <h5>Efectivo</h5>

              <h2>
                C$ {estadisticas.reservasEfectivo.toFixed(2)}
              </h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card
            className="h-100 text-white shadow"
            style={{
              background:
                "linear-gradient(135deg, #5ea5f1, #94c0ec)"
            }}
          >
            <Card.Body>
              <h5>Tarjeta</h5>

              <h2>
                C$ {estadisticas.reservasTarjeta.toFixed(2)}
              </h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card
            className="h-100 text-white shadow"
            style={{
              background:
                "linear-gradient(135deg, #7c3aed, #a78bfa)"
            }}
          >
            <Card.Body>
              <h5>Transferencia</h5>

              <h2>
                C$ {estadisticas.reservasTransferencia.toFixed(2)}
              </h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card
            className="h-100 text-white shadow"
            style={{
              background:
                "linear-gradient(135deg, #e27d01, #ffa500)"
            }}
          >
            <Card.Body>
              <h5>Habitaciones Ocupadas</h5>

              <h2>
                {estadisticas.habitacionesOcupadas}
              </h2>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      {/* GRAFICOS */}

      <Row className="g-4">

        {/* LINE CHART */}

        <Col lg={8}>
          <Card className="shadow border-0">

            <Card.Body ref={graficoHoraRef}>

              <h5 className="mb-3">
                Reservas por Hora
              </h5>

              <ResponsiveContainer
                width="100%"
                height={360}
              >
                <LineChart
                  data={estadisticas.reservasPorHora}
                >
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="hora" />

                  <YAxis
                    tickFormatter={(v) => `C$${v}`}
                  />

                  <Tooltip
                    formatter={(v) => [
                      `C$ ${v}`,
                      "Monto"
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#5e26b2"
                    strokeWidth={4}
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>

            </Card.Body>

            <div className="p-3">
              <Button
                variant="danger"
                onClick={generarPdfReservasHora}
              >
                <i className="bi bi-file-earmark-pdf me-2"></i>

                Descargar PDF
              </Button>
            </div>

          </Card>
        </Col>

        {/* PIE CHART */}

        <Col lg={4}>
          <Card className="shadow border-0">

            <Card.Body ref={graficoTiposHabitacionRef}>

              <h5 className="mb-3">
                Tipos de Habitación
              </h5>

              <ResponsiveContainer
                width="100%"
                height={360}
              >
                <PieChart>

                  <Pie
                    data={
                      estadisticas.reservasPorTipoHabitacion.length > 0
                        ? estadisticas.reservasPorTipoHabitacion
                        : [
                          {
                            name: "Sin datos",
                            value: 1
                          }
                        ]
                    }
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    label
                  >

                    {estadisticas.reservasPorTipoHabitacion.map(
                      (_, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={
                            COLORES[
                            i % COLORES.length
                            ]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip
                    formatter={(v) => `C$ ${v}`}
                  />

                </PieChart>
              </ResponsiveContainer>

            </Card.Body>

            <div className="p-3">
              <Button
                variant="danger"
                onClick={generarPdfTiposHabitacion}
              >
                <i className="bi bi-file-earmark-pdf me-2"></i>

                Descargar PDF
              </Button>
            </div>

          </Card>
        </Col>

      </Row>

    </div>
  );
}; 

export default Inicio;