import React, { useState } from "react";
import { Table, Spinner, Button, Card, Form } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaHuespedes = ({
    huespedes = [],
    cargando = false,
    abrirModalEdicion,
    abrirModalEliminacion
}) => {

    const [tipoGeneral, setTipoGeneral] = useState("cedula");

    const isMobile = useMediaQuery({
        maxWidth: 767
    });

    // FORMATEAR CÉDULA
    const formatearCedula = (cedula = "") => {

        const numeros =
            cedula.replace(/\D/g, "").slice(0, 13);

        if (numeros.length <= 3)
            return numeros;

        if (numeros.length <= 9)
            return `${numeros.slice(0, 3)}-${numeros.slice(3)}`;

        return `${numeros.slice(0, 3)}-${numeros.slice(3, 9)}-${numeros.slice(9)}`;
    };

    // CARGANDO
    if (cargando) {

        return (

            <div className="text-center my-5">

                <Spinner
                    animation="border"
                    variant="success"
                />

                <p className="mt-2 text-muted">
                    Cargando huéspedes...
                </p>

            </div>
        );
    }

    // SIN DATOS
    if (huespedes.length === 0) {

        return (
            <p className="text-center text-muted">
                No hay huéspedes registrados.
            </p>
        );
    }

    // =========================
    // VISTA MÓVIL
    // =========================
    if (isMobile) {

        return (

            <div>

                <div className="d-flex flex-column gap-3">

                    {huespedes.map((huesped) => (

                        <Card
                            key={huesped.id_huesped}
                            className="shadow-sm border-0"
                            style={{
                                borderRadius: "15px",
                                background: "rgba(255,255,255,0.97)",
                                border: "2px solid #471987"
                            }}
                        >

                            <Card.Body className="p-3">

                                <div className="d-flex justify-content-between align-items-start mb-2">

                                    <div>

                                        <div className="fw-bold text-success fs-5">

                                            #{huesped.id_huesped}

                                        </div>

                                        <div className="fw-semibold">

                                            {huesped.primer_nombre}{" "}
                                            {huesped.segundo_nombre}{" "}
                                            {huesped.primer_apellido}{" "}
                                            {huesped.segundo_apellido}

                                        </div>

                                    </div>

                                    <div className="d-grid gap-1">

                                        <Button
                                            size="sm"
                                            variant="info"
                                            onClick={() =>
                                                abrirModalEdicion(huesped)
                                            }
                                        >
                                            Editar
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() =>
                                                abrirModalEliminacion(huesped)
                                            }
                                        >
                                            Eliminar
                                        </Button>

                                    </div>

                                </div>

                                {/* SELECT DENTRO DE LA TARJETA */}
                                <div className="d-flex justify-content-between align-items-center mb-2">

                                    <span
                                        style={{
                                            color: "#0d6efd",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Tipo Documento
                                    </span>

                                    <Form.Select
                                        size="sm"
                                        style={{
                                            width: "120px"
                                        }}
                                        value={tipoGeneral}
                                        onChange={(e) =>
                                            setTipoGeneral(
                                                e.target.value
                                            )
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

                                <hr className="my-2 border-success" />

                                <div className="small">

                                    <div className="d-flex justify-content-between mb-1">

                                        <span
                                            style={{
                                                color: "#0d6efd",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            Documento:
                                        </span>
                                        <span>

                                            {tipoGeneral === "cedula"

                                                ? (
                                                    huesped.cedula_pasaporte
                                                )
                                                    ? formatearCedula(
                                                        huesped.cedula_pasaporte
                                                    )
                                                    : ""

                                                : (
                                                    huesped.pasaporte || ""
                                                )
                                            }

                                        </span>

                                    </div>

                                    <div className="d-flex justify-content-between">

                                        <span
                                            style={{
                                                color: "#0d6efd",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            Lugar origen:
                                        </span>

                                        <span>
                                            {huesped.lugar_origen || "-"}
                                        </span>

                                    </div>

                                </div>

                            </Card.Body>

                        </Card>

                    ))}

                </div>

            </div>
        );
    }

    // =========================
    // VISTA ESCRITORIO
    // =========================
    return (

        <div style={{
            maxHeight: "550px",
            overflowY: "auto"
        }}>

            <Table
                striped
                bordered
                hover
                responsive
                className="shadow-sm"
            >

                <thead
                    className="table-success"
                    style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 10
                    }}
                >

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
                                        fontSize: "12px",
                                        padding: "2px 6px"
                                    }}
                                    value={tipoGeneral}
                                    onChange={(e) =>
                                        setTipoGeneral(
                                            e.target.value
                                        )
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

                        <th>
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

                            <td>

                                {huesped.primer_nombre}{" "}
                                {huesped.segundo_nombre}{" "}
                                {huesped.primer_apellido}{" "}
                                {huesped.segundo_apellido}

                            </td>

                            <td>

                                {tipoGeneral === "cedula"

                                    ? (
                                        huesped.cedula_pasaporte
                                    )
                                        ? formatearCedula(
                                            huesped.cedula_pasaporte
                                        )
                                        : ""

                                    : (
                                        huesped.pasaporte || ""
                                    )
                                }

                            </td>

                            <td>
                                {huesped.lugar_origen}
                            </td>

                            <td className="text-center">

                                <Button
                                    variant="info"
                                    size="sm"
                                    className="m-1"
                                    onClick={() =>
                                        abrirModalEdicion(huesped)
                                    }
                                >

                                    ✏️ Editar

                                </Button>

                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                        abrirModalEliminacion(huesped)
                                    }
                                >

                                    🗑️ Eliminar

                                </Button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </Table>

        </div>
    );
};

export default TablaHuespedes;