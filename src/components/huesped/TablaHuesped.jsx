import React, { useState, useEffect } from "react";
import {
    Table,
    Spinner,
    Button,
    Form,
    Badge
} from "react-bootstrap";

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

    // Detectar cédula
    const esCedula = (documento) => {

        if (!documento) return false;

        return documento.includes("-");

    };

    // Detectar pasaporte
    const esPasaporte = (documento) => {

        if (!documento) return false;

        return !documento.includes("-");

    };

    // Filtrar automáticamente
    const huespedesFiltrados = huespedes.filter((huesped) => {

        const documento =
            huesped.cedula_pasaporte || "";

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

                    <h4 className="mb-4 text-primary fw-bold">

                        Cargando huéspedes...

                    </h4>

                    <Spinner
                        animation="border"
                        variant="primary"
                        role="status"
                        style={{
                            width: "4rem",
                            height: "4rem"
                        }}
                    />

                </div>

            ) : (

                <div className="table-responsive">

                    <Table
                        striped
                        borderless
                        hover
                        responsive
                        size="lg"
                        className="tabla-huesped align-middle"
                        style={{
                            fontSize: "16px",
                            borderRadius: "18px",
                            overflow: "hidden",
                            boxShadow:
                                "0 8px 25px rgba(0,0,0,0.12)",
                            backgroundColor: "#fff"
                        }}
                    >

                        {/* HEADER */}
                        <thead
                            style={{
                                background:
                                    "linear-gradient(135deg, #0019d4, #0048ff)",
                                color: "#fff",
                                fontSize: "16px",
                                height: "75px",
                                verticalAlign: "middle"
                            }}
                        >

                            <tr>

                                <th
                                    style={{
                                        minWidth: "80px",
                                        padding: "20px"
                                    }}
                                >
                                    ID
                                </th>

                                <th
                                    style={{
                                        padding: "20px"
                                    }}
                                >
                                    Nombre Completo
                                </th>

                                <th
                                    style={{
                                        minWidth: "300px",
                                        padding: "20px"
                                    }}
                                >

                                    <div
                                        className="d-flex align-items-center gap-3"
                                        style={{
                                            background: "#ffffff",
                                            padding: "8px 14px",
                                            borderRadius: "14px",
                                            width: "fit-content",
                                            boxShadow:
                                                "0 3px 10px rgba(0,0,0,0.15)"
                                        }}
                                    >

                                        {/* TEXTO */}
                                        <div
                                            className="d-flex align-items-center gap-2"
                                            style={{
                                                color: "#0019d4",
                                                fontWeight: "700",
                                                fontSize: "15px"
                                            }}
                                        >

                                            <i className="bi bi-credit-card-2-front-fill"></i>

                                            Documento

                                        </div>

                                        {/* SELECT */}
                                        <Form.Select
                                            size="sm"
                                            value={tipoDocumento}
                                            onChange={(e) =>
                                                setTipoDocumento(
                                                    e.target.value
                                                )
                                            }
                                            style={{
                                                width: "145px",
                                                borderRadius: "12px",
                                                border:
                                                    tipoDocumento === "cedula"
                                                        ? "2px solid #0d6efd"
                                                        : "2px solid #198754",
                                                backgroundColor:
                                                    tipoDocumento === "cedula"
                                                        ? "#eef4ff"
                                                        : "#eefcf3",
                                                color:
                                                    tipoDocumento === "cedula"
                                                        ? "#0d6efd"
                                                        : "#198754",
                                                fontWeight: "700",
                                                cursor: "pointer",
                                                transition:
                                                    "0.3s ease"
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

                                <th
                                    className="d-none d-md-table-cell"
                                    style={{
                                        padding: "20px"
                                    }}
                                >
                                    Lugar Origen
                                </th>

                                <th
                                    className="text-center"
                                    style={{
                                        minWidth: "150px",
                                        padding: "20px"
                                    }}
                                >
                                    Acciones
                                </th>

                            </tr>

                        </thead>

                        {/* BODY */}
                        <tbody>

                            {huespedesFiltrados.length > 0 ? (

                                huespedesFiltrados.map((huesped) => {

                                    const documento =
                                        huesped.cedula_pasaporte || "";

                                    return (

                                        <tr
                                            key={huesped.id_huesped}
                                            style={{
                                                transition:
                                                    "0.2s ease"
                                            }}
                                        >

                                            {/* ID */}
                                            <td
                                                className="fw-bold text-primary"
                                                style={{
                                                    padding: "18px",
                                                    verticalAlign: "middle"
                                                }}
                                            >

                                                {huesped.id_huesped}

                                            </td>

                                            {/* NOMBRE */}
                                            <td
                                                className="fw-semibold"
                                                style={{
                                                    padding: "18px",
                                                    verticalAlign: "middle"
                                                }}
                                            >

                                                {nombreCompleto(huesped)}

                                            </td>

                                            {/* DOCUMENTO */}
                                            <td
                                                style={{
                                                    padding: "18px",
                                                    verticalAlign: "middle"
                                                }}
                                            >

                                                <div className="d-flex align-items-center gap-3">

                                                    <Badge
                                                        bg={
                                                            esCedula(documento)
                                                                ? "primary"
                                                                : "success"
                                                        }
                                                        style={{
                                                            fontSize: "13px",
                                                            padding:
                                                                "10px 14px",
                                                            borderRadius:
                                                                "12px"
                                                        }}
                                                    >

                                                        {esCedula(documento)
                                                            ? "Cédula"
                                                            : "Pasaporte"}

                                                    </Badge>

                                                    <span
                                                        className="fw-bold"
                                                        style={{
                                                            fontSize: "15px"
                                                        }}
                                                    >

                                                        {documento || "—"}

                                                    </span>

                                                </div>

                                            </td>

                                            {/* LUGAR */}
                                            <td
                                                className="d-none d-md-table-cell"
                                                style={{
                                                    padding: "18px",
                                                    verticalAlign: "middle"
                                                }}
                                            >

                                                {huesped.lugar_origen || "—"}

                                            </td>

                                            {/* BOTONES */}
                                            <td
                                                className="text-center"
                                                style={{
                                                    padding: "18px",
                                                    verticalAlign: "middle"
                                                }}
                                            >

                                                <Button
                                                    variant="outline-warning"
                                                    size="md"
                                                    className="me-2"
                                                    style={{
                                                        padding:
                                                            "8px 14px",
                                                        borderRadius:
                                                            "10px"
                                                    }}
                                                    onClick={() =>
                                                        abrirModalEdicion(
                                                            huesped
                                                        )
                                                    }
                                                >

                                                    <i className="bi bi-pencil-fill"></i>

                                                </Button>

                                                <Button
                                                    variant="outline-danger"
                                                    size="md"
                                                    style={{
                                                        padding:
                                                            "8px 14px",
                                                        borderRadius:
                                                            "10px"
                                                    }}
                                                    onClick={() =>
                                                        abrirModalEliminacion(
                                                            huesped
                                                        )
                                                    }
                                                >

                                                    <i className="bi bi-trash-fill"></i>

                                                </Button>

                                            </td>

                                        </tr>

                                    );

                                })

                            ) : (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="text-center py-5 text-muted fw-bold"
                                        style={{
                                            fontSize: "18px"
                                        }}
                                    >

                                        <i className="bi bi-folder-x me-2"></i>

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