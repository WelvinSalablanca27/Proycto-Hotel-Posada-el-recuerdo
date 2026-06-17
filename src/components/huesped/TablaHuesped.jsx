import React, { useState, useEffect } from "react";
import { Table, Spinner, Button, Form, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaHuesped = ({
    huespedes,
    abrirModalEdicion,
    abrirModalEliminacion
}) => {

    const [loading, setLoading] = useState(true);

    // Selector de documento
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
        `.replace(/\s+/g, " ").trim();

    };

    // Detectar automáticamente si es cédula
    // Cédula = tiene guiones
    const esCedula = (documento) => {

        if (!documento) return false;

        return documento.includes("-");

    };

    // Detectar automáticamente si es pasaporte
    // Pasaporte = NO tiene guiones
    const esPasaporte = (documento) => {

        if (!documento) return false;

        return !documento.includes("-");

    };

    // Filtrar documentos automáticamente
    const huespedesFiltrados = huespedes.filter((huesped) => {

        const documento = huesped.cedula_pasaporte || "";

        if (tipoDocumento === "cedula") {

            return esCedula(documento);

        }

        if (tipoDocumento === "pasaporte") {

            return esPasaporte(documento);

        }

        return true;

    });

    return (
        <>
            {loading ? (

                <div className="text-center py-5">

                    <h5 className="mb-3 text-secondary">
                        Cargando huéspedes...
                    </h5>

                    <Spinner
                        animation="border"
                        variant="primary"
                        role="status"
                    />

                </div>

            ) : (

                <div className="table-responsive">

                    <Table
                                                     striped
                                                     borderless
                                                     hover
                                                     responsive
                                                     size="sm"
                                                     className="tabla-huesped"
                                                 >
                        <thead
                            style={{
                                backgroundColor: "#0019d4",
                                color: "#fff"
                            }}
                        >

                            <tr>

                                <th style={{ minWidth: "70px" }}>
                                    ID
                                </th>

                                <th>
                                    Nombre Completo
                                </th>

                                <th style={{ minWidth: "260px" }}>

                                    <div className="d-flex align-items-center justify-content-between gap-2">

                                        <span>
                                            Documento
                                        </span>

                                        <Form.Select
                                            size="sm"
                                            value={tipoDocumento}
                                            onChange={(e) =>
                                                setTipoDocumento(
                                                    e.target.value
                                                )
                                            }
                                            style={{
                                                width: "140px",
                                                fontSize: "13px",
                                                fontWeight: "500"
                                            }}
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

                                <th
                                    className="text-center"
                                    style={{ minWidth: "130px" }}
                                >
                                    Acciones
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {huespedesFiltrados.length > 0 ? (

                                huespedesFiltrados.map((huesped) => {

                                    const documento =
                                        huesped.cedula_pasaporte || "";

                                    return (

                                        <tr key={huesped.id_huesped}>

                                            <td className="fw-semibold">

                                                {huesped.id_huesped}

                                            </td>

                                            <td className="fw-semibold">

                                                {nombreCompleto(huesped)}

                                            </td>

                                            <td>

                                                <div className="d-flex align-items-center gap-2">

                                                    <Badge
                                                        bg={
                                                            esCedula(documento)
                                                                ? "primary"
                                                                : "success"
                                                        }
                                                    >

                                                        {esCedula(documento)
                                                            ? "Cédula"
                                                            : "Pasaporte"}

                                                    </Badge>

                                                    <span className="fw-medium">

                                                        {documento || "—"}

                                                    </span>

                                                </div>

                                            </td>

                                            <td className="d-none d-md-table-cell">

                                                {huesped.lugar_origen || "—"}

                                            </td>

                                            <td className="text-center">

                                                <Button
                                                    variant="outline-warning"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() =>
                                                        abrirModalEdicion(
                                                            huesped
                                                        )
                                                    }
                                                >

                                                    <i className="bi bi-pencil"></i>

                                                </Button>

                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() =>
                                                        abrirModalEliminacion(
                                                            huesped
                                                        )
                                                    }
                                                >

                                                    <i className="bi bi-trash"></i>

                                                </Button>

                                            </td>

                                        </tr>

                                    );

                                })

                            ) : (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="text-center py-4 text-muted fw-semibold"
                                    >

                                        No hay registros de{" "}
                                        {tipoDocumento === "cedula"
                                            ? "cédulas"
                                            : "pasaportes"}

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </Table>

                </div>

            )}
        </>
    );
};

export default TablaHuesped;