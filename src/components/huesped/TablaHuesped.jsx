import React, { useState, useEffect } from "react";
import { Table, Spinner, Button, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaHuesped = ({
    huespedes,
    abrirModalEdicion,
    abrirModalEliminacion
}) => {

    const [loading, setLoading] = useState(true);

    // Selector documento
    const [tipoDocumento, setTipoDocumento] = useState("cedula");

    useEffect(() => {

        if (huespedes && huespedes.length > 0) {
            setLoading(false);
        } else {
            setLoading(true);
        }

    }, [huespedes]);

    // Nombre completo
    const nombreCompleto = (huesped) => {

        return `
            ${huesped.primer_nombre || ""}
            ${huesped.segundo_nombre || ""}
            ${huesped.primer_apellido || ""}
            ${huesped.segundo_apellido || ""}
        `.trim();

    };

    return (
        <>
            {loading ? (

                <div className="text-center">

                    <h4>
                        Cargando huéspedes...
                    </h4>

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
                    className="tabla-huesped"
                >

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>
                                Nombre Completo
                            </th>

                            <th>

                                <div className="d-flex align-items-center gap-2">

                                    <span>
                                        Documento
                                    </span>

                                    <Form.Select
                                        size="sm"
                                        style={{
                                            width: "120px",
                                            fontSize: "12px"
                                        }}
                                        value={tipoDocumento}
                                        onChange={(e) =>
                                            setTipoDocumento(e.target.value)
                                        }
                                    >

                                        <option value="cedula">
                                            Cédula
                                        </option>

                                        <option value="pasaporte">
                                            Pasaporte
                                        </option>

                                    </Form.Select>

                                </div>

                            </th>

                            <th className="d-none d-md-table-cell">
                                Lugar Origen
                            </th>

                            <th className="text-center">
                                Acciones
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {huespedes.map((huesped) => (

                            <tr key={huesped.id_huesped}>

                                <td>
                                    {huesped.id_huesped}
                                </td>

                                <td className="fw-semibold">

                                    {nombreCompleto(huesped)}

                                </td>

                                <td>

                                    {tipoDocumento === "cedula"
                                        ? huesped.cedula_pasaporte || "—"
                                        : huesped.pasaporte || "—"
                                    }

                                </td>

                                <td className="d-none d-md-table-cell">

                                    {huesped.lugar_origen || "—"}

                                </td>

                                <td className="text-center">

                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="m-1"
                                        onClick={() =>
                                            abrirModalEdicion(huesped)
                                        }
                                    >

                                        <i className="bi bi-pencil"></i>

                                    </Button>

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() =>
                                            abrirModalEliminacion(huesped)
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

export default TablaHuesped;