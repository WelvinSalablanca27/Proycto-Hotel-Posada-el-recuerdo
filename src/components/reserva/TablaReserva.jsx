import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaReserva = ({ reservas, abrirEdicion }) => {

  return (

    <Table
      striped
      hover
      responsive
      size="sm"
      className="tabla-reserva"
    >

      <thead>

        <tr>

          <th>ID</th>

          <th>Entrada</th>

          <th>Huésped</th>

          <th>Habitación</th>

          <th>Pago</th>

          <th className="text-end">
            Monto
          </th>

          <th className="text-center">
            Acciones
          </th>

        </tr>

      </thead>

      <tbody>

        {reservas.map((reserva) => (

          <tr key={reserva.id_reserva}>

            <td>
              #{reserva.id_reserva}
            </td>

            <td>

              {new Date(
                reserva.hora_entrada
              ).toLocaleString("es-NI")}

            </td>

            <td>

              {reserva.huesped?.primer_nombre}{" "}
              {reserva.huesped?.primer_apellido}

            </td>

            <td>

              #{reserva.habitacion?.numero_habitacion} {" "}
              {reserva.habitacion?.tipo_habitacion}

            </td>

            <td>

              <span className="badge bg-info">

                {reserva.forma_pago}

              </span>

            </td>

            <td className="text-end fw-bold">

              C$
              {parseFloat(
                reserva.monto || 0
              ).toFixed(2)}

            </td>

            <td className="text-center">

              <Button
                variant="outline-warning"
                size="sm"
                onClick={() =>
                  abrirEdicion(reserva)
                }
              >

                <i className="bi bi-pencil"></i>

              </Button>

            </td>

          </tr>

        ))}

      </tbody>

    </Table>

  );
};

export default TablaReserva;