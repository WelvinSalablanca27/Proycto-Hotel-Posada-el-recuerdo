import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Card, Spinner, Form, Button } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { supabase } from "../database/supabaseconfig";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

const Inicio = () => {

  // =========================
  // STATES
  // =========================

  const [cargando, setCargando] = useState(true);

  const graficoHoraRef = useRef(null);

  const graficoTipoHabitacionRef = useRef(null);

  const [fechaDesde, setFechaDesde] = useState(
    new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" })
  );

  const [fechaHasta, setFechaHasta] = useState(
    new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" })
  );
  const generarPdfReservasHora = async () => {

    try {

      const pdf = new jsPDF("p", "mm", "a4");

      // TÍTULO Y FECHA

      pdf.setFontSize(18);

      pdf.setTextColor("#330775");

      pdf.setFont("helvetica", "bold");

      pdf.text(
        "Reporte de Reservas por Hora",
        14,
        15
      );

      pdf.setFont("helvetica", "normal");

      pdf.setTextColor("#000000");

      pdf.setFontSize(10);

      pdf.text(
        `Periodo: ${fechaDesde} - ${fechaHasta}`,
        14,
        22
      );

      // IMAGEN DEL GRÁFICO

      const canvas = await html2canvas(
        graficoHoraRef.current
      );

      const imagen =
        canvas.toDataURL("image/png");

      pdf.addImage(
        imagen,
        "PNG",
        10,
        30,
        190,
        80
      );

      // RESUMEN GENERAL

      pdf.setFontSize(14);

      pdf.setTextColor("#330775");

      pdf.setFont("helvetica", "bold");

      pdf.text(
        "Resumen General",
        14,
        115
      );

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

      // TABLA

      const filas =
        estadisticas.reservasPorHora.map(item => [
          item.hora,
          `C$ ${item.total}`
        ]);

      autoTable(pdf, {
        startY: 160,
        head: [["Hora", "Monto Acumulado"]],
        body: filas
      });

      // DESCARGAR PDF

      const fechaActual =
        new Date().toLocaleDateString(
          "en-CA",
          {
            timeZone: "America/Managua"
          }
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

      // =========================
      // TITULO
      // =========================

      pdf.setFontSize(18);
      pdf.setTextColor("#330775");
      pdf.setFont("helvetica", "bold");

      pdf.text(
        "Reporte de Tipos de Habitación",
        14,
        15
      );

      pdf.setFontSize(10);
      pdf.setTextColor("#000000");
      pdf.setFont("helvetica", "normal");

      pdf.text(
        `Periodo: ${fechaDesde} - ${fechaHasta}`,
        14,
        22
      );

      // =========================
      // CAPTURAR GRAFICO
      // =========================

      const canvas = await html2canvas(
        graficoTipoHabitacionRef.current
      );

      const imagen =
        canvas.toDataURL("image/png");

      pdf.addImage(
        imagen,
        "PNG",
        10,
        30,
        190,
        90
      );

      // =========================
      // TABLA
      // =========================

      const filas =
        estadisticas.reservasPorTipoHabitacion.map(
          (item) => [
            item.name,
            item.value
          ]
        );

      autoTable(pdf, {
        startY: 130,
        head: [["Tipo Habitación", "Cantidad"]],
        body: filas
      });

      // =========================
      // FECHA
      // =========================

      const fechaActual =
        new Date().toLocaleDateString(
          "en-CA",
          {
            timeZone: "America/Managua"
          }
        );

      // =========================
      // GUARDAR
      // =========================

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

      // ======================
      // TÍTULO
      // ======================
      pdf.setFontSize(18);
      pdf.setTextColor("#330775");
      pdf.setFont("helvetica", "bold");
      pdf.text("Reporte General del Hotel", 14, 15);

      pdf.setFontSize(10);
      pdf.setTextColor("#000000");
      pdf.setFont("helvetica", "normal");
      pdf.text(`Periodo: ${fechaDesde} - ${fechaHasta}`, 14, 22);

      // ======================
      // RESUMEN
      // ======================
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Resumen General", 14, 35);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      pdf.text(`Ingresos: C$ ${estadisticas.totalIngresos.toFixed(2)}`, 14, 45);
      pdf.text(`Reservas: ${estadisticas.reservas}`, 14, 52);
      pdf.text(`Efectivo: C$ ${estadisticas.reservasEfectivo.toFixed(2)}`, 14, 59);
      pdf.text(`Tarjeta: C$ ${estadisticas.reservasTarjeta.toFixed(2)}`, 14, 66);
      pdf.text(`Habitaciones ocupadas: ${estadisticas.habitacionesOcupadas}`, 14, 73);

      // ======================
      // GRÁFICO HORA
      // ======================
      const canvas1 = await html2canvas(graficoHoraRef.current);
      const img1 = canvas1.toDataURL("image/png");

      pdf.addImage(img1, "PNG", 10, 80, 190, 70);

      // ======================
      // NUEVA PÁGINA
      // ======================
      pdf.addPage();

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Tipos de Habitación", 14, 15);

      // ======================
      // GRÁFICO PIE
      // ======================
      const canvas2 = await html2canvas(graficoTipoHabitacionRef.current);
      const img2 = canvas2.toDataURL("image/png");

      pdf.addImage(img2, "PNG", 10, 25, 190, 90);

      // ======================
      // TABLA TIPOS
      // ======================
      autoTable(pdf, {
        startY: 120,
        head: [["Tipo Habitación", "Valor"]],
        body: estadisticas.reservasPorTipoHabitacion.map(item => [
          item.name,
          item.value
        ])
      });

      // ======================
      // GUARDAR
      // ======================
      const fechaActual = new Date().toLocaleDateString("en-CA", {
        timeZone: "America/Managua"
      });

      pdf.save(`ReporteGeneral_${fechaActual}.pdf`);

    } catch (error) {
      console.error(error);
      alert("Error generando PDF general");
    }
  };

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
      {/* FILTROS */}
      <Row className="mb-4">

        <Col md={3}>
          <Form.Control
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </Col>

        <Col md={3}>
          <Form.Control
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </Col>

        <Col md={6} className="d-flex gap-2">

          {/* EXPORTAR EXCEL */}
          <Button
            variant="success"
            onClick={descargarExcel}
          >
            <i className="bi bi-file-earmark-excel me-2"></i>
            Exportar Excel
          </Button>

          {/* PDF GENERAL (IMPORTANTE: esta función debe existir) */}
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
          <Card className="shadow border-0">

            <Card.Body ref={graficoHoraRef}>

              <h5 className="mb-3">
                Ingresos por Hora
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

        {/* PIE (YA FUNCIONA AL REGISTRAR HABITACIONES) */}
        <Col lg={4}>

          <Card>

            <Card.Body ref={graficoTipoHabitacionRef}>
              <h5>
                Tipos de Habitación
              </h5>

              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <PieChart>

                  <Pie
                    data={
                      estadisticas.reservasPorTipoHabitacion
                    }
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >

                    {estadisticas.reservasPorTipoHabitacion.map(
                      (_, i) => (
                        <Cell
                          key={i}
                          fill={
                            COLORES[
                            i % COLORES.length
                            ]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>
              </ResponsiveContainer>

              <div className="mt-3">

                <Button
                  variant="danger"
                  onClick={generarPdfTiposHabitacion}
                >
                  <i className="bi bi-file-earmark-pdf me-2"></i>

                  Descargar PDF
                </Button>

              </div>

            </Card.Body>

          </Card>

        </Col>

      </Row>

    </div>
  );
};

export default Inicio;