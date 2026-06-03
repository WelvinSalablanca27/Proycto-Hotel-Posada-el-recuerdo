import React, { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaHabitaciones = ({
    habitacion,
    abrirModalEdicion,
    abrirModalEliminacion
}) => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (habitacion && habitacion.length > 0) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [habitacion]);

    return (
        <>
            {loading ? (
                <div className="text-center">
                    <h4>Cargando habitaciones...</h4>
                    <Spinner animation="border" variant="success" role="status" />
                </div>
            ) : (
               <Table
                                   striped
                                   borderless
                                   hover
                                   responsive
                                   size="sm"
                                   className="tabla-habitacion"
                               >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Número</th>
                            <th>Tipo</th>
                            <th className="d-none d-md-table-cell">Camas</th>
                            <th className="d-none d-md-table-cell">Clima</th>
                            <th>Precio</th>
                            <th>Estado</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {habitacion.map((habitacion) => (
                            <tr key={habitacion.id_habitacion}>
                                <td>{habitacion.id_habitacion}</td>
                                <td>{habitacion.numero_habitacion}</td>
                                <td>{habitacion.tipo_habitacion}</td>
                                <td>{habitacion.tipo_camas}</td>
                                <td>{habitacion.tipo_clima}</td>
                                <td>${habitacion.precio}</td>
                                <td className="d-none d-md-table-cell">{habitacion.estado}</td>
                                <td className="text-center">
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="m-1"
                                        onClick={() => abrirModalEdicion(habitacion)}
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => abrirModalEliminacion(habitacion)}
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

export default TablaHabitaciones;