import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import logo from "../../assets/logo.png";
import { supabase } from "../../database/supabaseconfig";
import ChatIA from "../ia/chatIA";


const Encabezado = () => {

    const [mostrarMenu, setMostrarMenu] = useState(false);
    const [mostrarChatIA, setMostrarChatIA] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const rutaActual = location.pathname;

    const manejarToggle = () => setMostrarMenu(!mostrarMenu);

    const manejarNavegacion = (ruta) => {
        navigate(ruta);
        setMostrarMenu(false);
    };

    const cerrarSesion = async () => {

        try {

            const { error } = await supabase.auth.signOut();

            if (error) throw error;

            localStorage.removeItem("usuario-supabase");

            setMostrarMenu(false);

            navigate("/login");

        } catch (err) {

            console.error("Error cerrando sesión:", err.message);
        }
    };

    const esLogin = location.pathname === "/login";

    const esHabitacion =
        location.pathname === "/habitacion" &&
        localStorage.getItem("usuario-supabase") === null;

    let contenidoMenu;

    if (esLogin) {

        contenidoMenu = (
            <Nav className="ms-auto pe-2">

                <Nav.Link
                    onClick={() => manejarNavegacion("/login")}
                    className="text-white"
                >
                    <i className="bi-person-fill-lock me-2"></i>

                    Iniciar sesión
                </Nav.Link>

            </Nav>
        );

    } else {

        if (esHabitacion) {

            contenidoMenu = (
                <Nav className="ms-auto pe-2">

                    <Nav.Link
                        onClick={() => manejarNavegacion("/habitacion")}
                        className={
                            rutaActual === "/habitacion"
                                ? "menu-activo"
                                : "text-white"
                        }
                    >
                        <i className="bi-images me-2"></i>

                        <strong>Habitacion</strong>
                    </Nav.Link>

                </Nav>
            );

        } else {

            contenidoMenu = (
                <>
                    <Nav className="ms-auto pe-2">

                        <Nav.Link
                            onClick={() => manejarNavegacion("/")}
                            className={mostrarMenu ? "color-texto-marca" : "text-white"}
                        >
                            {mostrarMenu ? <i className="bi-house-fill me-2"></i> : null}
                            <strong>Inicio</strong>
                        </Nav.Link>

                        <Nav.Link
                            onClick={() => manejarNavegacion("/huesped")}
                            className={mostrarMenu ? "menu-activo" : "text-white"}
                        >
                            {mostrarMenu ? (
                                <i className="bi-people-fill me-2"></i>
                            ) : null}
                            <strong>Huéspedes</strong>
                        </Nav.Link>

                        <Nav.Link
                            onClick={() => manejarNavegacion("/habitacion")}
                            className={mostrarMenu ? "color-texto-marca" : "text-white"}
                        >
                            {mostrarMenu ? (
                                <i className="bi-door-open-fill me-2"></i>
                            ) : null}
                            <strong>Habitaciones</strong>
                        </Nav.Link>

                        <Nav.Link
                            onClick={() => manejarNavegacion("/reserva")}
                            className={mostrarMenu ? "color-texto-marca" : "text-white"}
                        >
                            {mostrarMenu ? (
                                <i className="bi-calendar-check-fill me-2"></i>
                            ) : null}
                            <strong>Reservas</strong>
                        </Nav.Link>

                        <Nav.Link
                            onClick={() => manejarNavegacion("/recepcion")}
                            className={mostrarMenu ? "color-texto-marca" : "text-white"}
                        >
                            {mostrarMenu ? (
                                <i className="bi-person-workspace me-2"></i>
                            ) : null}
                            <strong>Recepción</strong>
                        </Nav.Link>

                        <Nav.Link
                            onClick={() => manejarNavegacion("/dashboard")}
                            className={mostrarMenu ? "color-texto-marca" : "text-white"}
                        >
                            {mostrarMenu ? (
                                <i className="bi-bar-chart-fill me-2"></i>
                            ) : null}
                            <strong>Dashboard</strong>
                        </Nav.Link>

                        {/* Chat IA */}
                        <Nav.Link
                            onClick={() => setMostrarChatIA(true)}
                            className="text-white"
                        >
                            <i className="bi bi-robot me-2"></i>
                        </Nav.Link>

                        <hr />

                        {/* Cerrar sesión */}
                        {mostrarMenu ? null : (
                            <Nav.Link
                                onClick={cerrarSesion}
                                className="text-white"
                            >
                                <i className="bi-box-arrow-right me-2"></i>
                            </Nav.Link>
                        )}

                        <hr />
                    </Nav>

                    {/* info usuario */}
                    {mostrarMenu && (
                        <div className="mt-3 p-3 rounded bg-light text-dark">
                            <p className="mb-2">
                                <i className="bi-envelope-fill me-2"></i>
                                {localStorage.getItem("usuario-supabase")?.toLowerCase() || "Usuario"}
                            </p>

                            <button
                                className="btn btn-outline-danger mt-3 w-100"
                                onClick={cerrarSesion}
                            >
                                <i className="bi-box-arrow-right me-2"></i>
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </>
            );
        }
    }

    return (

        <Navbar
            expand="md"
            fixed="top"
            className="color-navbar shadow-lg"
            variant="dark"
        >
            <Container>

                <Navbar.Brand
                    onClick={() =>
                        manejarNavegacion(
                            esHabitacion ? "/habitacion" : "/"
                        )
                    }
                    className="text-white fw-bold d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                >
                    <img
                        alt=""
                        src={logo}
                        width="45"
                        height="45"
                        className="d-inline-block me-2"
                    />

                    <strong>
                        <h4 className="mb-0">
                            Hoteleria Posada el Recuerdo
                        </h4>
                    </strong>
                </Navbar.Brand>
                <ChatIA mostrar={mostrarChatIA}
                 onCerrar={() => 
                 setMostrarChatIA(false)} />

                {!esLogin && (

                    <Navbar.Toggle
                        aria-controls="menu-offcanvas"
                        onClick={manejarToggle}
                    />
                )}

                <Navbar.Offcanvas
                    id="menu-offcanvas"
                    placement="end"
                    show={mostrarMenu}
                    onHide={() => setMostrarMenu(false)}
                >
                    <Offcanvas.Header closeButton>

                        <Offcanvas.Title>
                            Menú Hoteleria
                        </Offcanvas.Title>

                    </Offcanvas.Header>

                    <Offcanvas.Body>
                        {contenidoMenu}
                    </Offcanvas.Body>

                </Navbar.Offcanvas>
            </Container>

        </Navbar>
    );
};
export default Encabezado;