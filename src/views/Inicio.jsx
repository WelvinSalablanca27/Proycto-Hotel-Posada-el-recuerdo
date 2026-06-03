import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const Inicio = () => {

    // DATOS GUARDADOS
    const huespedes =
        JSON.parse(localStorage.getItem("huespedes")) || [];

    const habitaciones =
        JSON.parse(localStorage.getItem("habitaciones")) || [];

    const reservas =
        JSON.parse(localStorage.getItem("reservas")) || [];

    // INGRESOS AUTOMÁTICOS
    const ingresosTotales = reservas.reduce(
        (total, reserva) =>
            total + Number(reserva.total || 0),
        0
    );

    return (

        <Container fluid className="mt-3">

            {/* TITULO */}
            <Row className="mb-4">

                <Col>

                    <h2 className="fw-bold">
                        <i className="bi bi-house-fill me-2"></i>
                        Inicio
                    </h2>

                    <p className="text-muted">
                        Bienvenido al sistema de gestión hotelera.
                    </p>

                </Col>

            </Row>

            {/* TARJETAS */}
            <Row className="g-4">

                {/* huesped */}
                <Col xs={12} md={6} lg={3}>

                    <Link
                        to="/huesped"
                        className="text-decoration-none"
                    >

                        <Card
                            className="shadow border-0 rounded-4 h-100"
                            style={{
                                cursor: "pointer",
                                transition: "0.3s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(-5px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                            }}
                        >

                            <Card.Body>

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>

                                        <h6 className="text-muted">
                                            Huéspedes
                                        </h6>


                                    </div>

                                    <i className="bi bi-people-fill fs-1 text-primary"></i>

                                </div>

                            </Card.Body>

                        </Card>

                    </Link>

                </Col>

                {/* HABITACIONES */}
                <Col xs={12} md={6} lg={3}>

                    <Link
                        to="/habitacion"
                        className="text-decoration-none"
                    >

                        <Card
                            className="shadow border-0 rounded-4 h-100"
                            style={{
                                cursor: "pointer",
                                transition: "0.3s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(-5px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                            }}
                        >

                            <Card.Body>

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>

                                        <h6 className="text-muted">
                                            Habitaciones
                                        </h6>

                                    </div>

                                    <i className="bi bi-door-open-fill fs-1 text-success"></i>

                                </div>

                            </Card.Body>

                        </Card>

                    </Link>

                </Col>

                {/* RESERVAS */}
                <Col xs={12} md={6} lg={3}>

                    <Link
                        to="/reserva"
                        className="text-decoration-none"
                    >

                        <Card
                            className="shadow border-0 rounded-4 h-100"
                            style={{
                                cursor: "pointer",
                                transition: "0.3s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(-5px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                            }}
                        >

                            <Card.Body>

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>

                                        <h6 className="text-muted">
                                            Reservas
                                        </h6>


                                    </div>

                                    <i className="bi bi-calendar-check-fill fs-1 text-warning"></i>

                                </div>

                            </Card.Body>

                        </Card>

                    </Link>

                </Col>

                {/* INGRESOS */}
                <Col xs={12} md={6} lg={3}>

                    <Link
                        to="/recepcion"
                        className="text-decoration-none"
                    >

                        <Card
                            className="shadow border-0 rounded-4 h-100"
                            style={{
                                cursor: "pointer",
                                transition: "0.3s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(-5px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                            }}
                        >

                            <Card.Body>

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>

                                        <h6 className="text-muted">
                                            Ingresos
                                        </h6>

                                    
                                    </div>

                                    <i className="bi bi-cash-stack fs-1 text-danger"></i>

                                </div>

                            </Card.Body>

                        </Card>

                    </Link>

                </Col>

            </Row>

            {/* INFORMACION */}
            <Row className="mt-5">

                <Col>

                    <Card className="shadow border-0 rounded-4">

                        <Card.Body>

                            <h4 className="fw-bold mb-3">
                                Información General
                            </h4>

                            <p className="text-muted">
                                Desde este panel podrás administrar huéspedes,
                                habitaciones, reservas y visualizar información
                                importante del sistema hotelero.
                            </p>

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

        </Container>

    );
};

export default Inicio;