import React, { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaRecepcion = ({
    recepcion,
    abrirModalEdicion,
    abrirModalEliminacion
}) => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (recepcion && recepcion.length > 0) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [recepcion]);

    return (
        <>
            {loading ? (
                <div className="text-center">
                    <h4>Cargando recepcionistas...</h4>
                    <Spinner
                        animation="border"
                        variant="success"
                        role="status"
                    />
                </div>
            ) : (
                <Table
                    striped
                    borderless
                    hover
                    responsive
                    size="sm"
                    className="tabla-recepcion"
                >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th className="d-none d-md-table-cell">
                                Hora Entrada
                            </th>
                            <th className="d-none d-md-table-cell">
                                Hora Salida
                            </th>
                            <th>Turno</th>
                            
                            <th className="text-center">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {recepcion.map((recepcionista) => (
                            <tr key={recepcionista.id_recepcionista}>
                                <td>{recepcionista.id_recepcionista}</td>

                                <td>{recepcionista.fecha}</td>

                                <td>{recepcionista.nombre}</td>

                                <td>{recepcionista.apellido}</td>

                                <td className="d-none d-md-table-cell">
                                    {recepcionista.hora_entrada}
                                </td>

                                <td className="d-none d-md-table-cell">
                                    {recepcionista.hora_salida}
                                </td>

                                <td>{recepcionista.turno}</td>

                                

                                <td className="text-center">
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="m-1"
                                        onClick={() =>
                                            abrirModalEdicion(recepcionista)
                                        }
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>

                                    <Button
                                        variant="outline-danger"
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
            )}
        </>
    );
};

export default TablaRecepcion;