import React from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaRecepcion = ({
  recepcion = [],
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  if (!recepcion.length) {
    return (
      <div className="text-center py-4">
        <h5 className="text-muted">
          No hay recepcionistas registrados
        </h5>
      </div>
    );
  }

  return (
    <Table
      striped
      bordered
      hover
      responsive
      className="shadow-sm"
    >
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Fecha</th>
          <th>Entrada</th>
          <th>Salida</th>
          <th>Turno</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {recepcion.map((recepcionista) => (
          <tr key={recepcionista.id_recepcionista}>
            <td>{recepcionista.id_recepcionista}</td>
            <td>{recepcionista.nombre}</td>
            <td>{recepcionista.apellido}</td>
            <td>{recepcionista.fecha}</td>
            <td>{recepcionista.hora_entrada}</td>
            <td>{recepcionista.hora_salida}</td>
            <td>{recepcionista.turno}</td>

            <td className="text-center">
              <Button
                variant="warning"
                size="sm"
                className="me-2"
                onClick={() =>
                  abrirModalEdicion(recepcionista)
                }
              >
                <i className="bi bi-pencil-square"></i>
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() =>
                  abrirModalEliminacion(recepcionista)
                }
              >
                <i className="bi bi-trash"></i>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaRecepcion;