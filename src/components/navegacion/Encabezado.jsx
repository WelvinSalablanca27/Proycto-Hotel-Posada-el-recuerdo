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

    const esLogin = rutaActual === "/login";

    const esHabitacion =
        rutaActual === "/habitacion" &&
        localStorage.getItem("usuario-supabase") === null;

    let contenidoMenu;

    if (esLogin) {

        contenidoMenu = (
            <Nav className="ms-auto">
                <Nav.Link
                    onClick={() => manejarNavegacion("/login")}
                    className="text-white"
                >
                    <i className="bi bi-person-fill-lock me-2"></i>
                    Iniciar sesión
                </Nav.Link>
            </Nav>
        );

    } else if (esHabitacion) {

        contenidoMenu = (
            <Nav className="ms-auto">
                <Nav.Link
                    onClick={() => manejarNavegacion("/habitacion")}
                    className={
                        rutaActual === "/habitacion"
                            ? "menu-activo"
                            : "text-white"
                    }
                >
                    <i className="bi bi-images me-2"></i>
                    <strong>Habitaciones</strong>
                </Nav.Link>
            </Nav>
        );

    } else {

        contenidoMenu = (
            <>
                <Nav className="ms-auto d-flex align-items-center gap-2">

                    <Nav.Link
                        onClick={() => manejarNavegacion("/")}
                        className={rutaActual === "/" ? "activo-inicio" : "text-white"}
                    >
                        <i className="bi bi-house-fill me-1 icon-inicio"></i>
                        <strong>Inicio</strong>
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => manejarNavegacion("/huesped")}
                        className={rutaActual === "/huesped" ? "menu-activo" : "text-white"}
                    >
                        <i className="bi bi-people-fill me-1"></i>
                        <strong>Huéspedes</strong>
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => manejarNavegacion("/habitacion")}
                        className={rutaActual === "/habitacion" ? "menu-activo" : "text-white"}
                    >
                        <i className="bi bi-door-open-fill me-1"></i>
                        <strong>Habitaciones</strong>
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => manejarNavegacion("/reserva")}
                        className={rutaActual === "/reserva" ? "menu-activo" : "text-white"}
                    >
                        <i className="bi bi-calendar-check-fill me-1"></i>
                        <strong>Reservas</strong>
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => manejarNavegacion("/recepcion")}
                        className={rutaActual === "/recepcion" ? "menu-activo" : "text-white"}
                    >
                        <i className="bi bi-person-workspace me-1"></i>
                        <strong>Recepción</strong>
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => manejarNavegacion("/dashboard")}
                        className={rutaActual === "/dashboard" ? "menu-activo" : "text-white"}
                    >
                        <i className="bi bi-bar-chart-fill me-1"></i>
                        <strong>Dashboard</strong>
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => setMostrarChatIA(true)}
                        className="text-white"
                        title="Asistente IA"
                    >
                        <i className="bi bi-robot fs-5"></i>
                    </Nav.Link>

                    {!mostrarMenu && (
                        <Nav.Link
                            onClick={cerrarSesion}
                            className="text-white"
                            title="Cerrar sesión"
                        >
                            <i className="bi bi-box-arrow-right fs-5"></i>
                        </Nav.Link>
                    )}

                </Nav>

                {mostrarMenu && (
                    <div className="mt-3 p-3 rounded bg-light text-dark">

                        <p className="mb-2">
                            <i className="bi bi-envelope-fill me-2"></i>
                            {localStorage.getItem("usuario-supabase")?.toLowerCase() || "Usuario"}
                        </p>

                        <button
                            className="btn btn-outline-danger mt-2 w-100"
                            onClick={cerrarSesion}
                        >
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Cerrar sesión
                        </button>

                    </div>
                )}
            </>
        );
    }

    return (
        <Navbar
            expand="lg"
            fixed="top"
            className="color-navbar shadow-lg"
            variant="dark"
        >
            <Container fluid className="px-4">

                <Navbar.Brand
                    onClick={() =>
                        manejarNavegacion(
                            esHabitacion ? "/habitacion" : "/"
                        )
                    }
                    className="text-white fw-bold d-flex align-items-center me-4"
                    style={{ cursor: "pointer" }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        width="40"
                        height="40"
                        className="rounded-circle me-2"
                    />

                    <div>
                        <h4 className="mb-0 fw-bold">
                           Hotel "Posada El Recuerdo"
                        </h4>
                    </div>

                </Navbar.Brand>

                <ChatIA
                    mostrar={mostrarChatIA}
                    onCerrar={() => setMostrarChatIA(false)}
                />

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
                            Menú Hotelero
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