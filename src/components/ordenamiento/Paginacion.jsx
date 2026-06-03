import React from "react";
import Pagination from "react-bootstrap/Pagination";
import { Row, Col, Form } from "react-bootstrap";

const Paginacion = ({
    registrosPorPagina,
    totalRegistros,
    paginaActual,
    establecerPaginaActual,
    establecerRegistrosPorPagina
}) => {

    // 📌 Calcular total de páginas según registros
    const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);

    // 🔁 Cambiar página con validación de límites
    const cambiarPagina = (numeroPagina) => {
        if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
            establecerPaginaActual(numeroPagina);
        }
    };

    // 🔢 Cambiar cantidad de registros por página
    const cambiarCantidadRegistros = (evento) => {
        establecerRegistrosPorPagina(Number(evento.target.value));
        establecerPaginaActual(1); // 🔄 Reinicia a página 1
    };

    // 📌 Generación dinámica de botones de paginación
    const elementosPaginacion = [];
    const maximoPaginasAMostrar = 3;

    // 📍 Página inicial del rango visible
    let paginaInicio = Math.max(
        1,
        paginaActual - Math.floor(maximoPaginasAMostrar / 2)
    );

    // 📍 Página final del rango visible
    let paginaFin = Math.min(
        totalPaginas,
        paginaInicio + maximoPaginasAMostrar - 1
    );

    // 🔄 Ajuste si no se completan las páginas visibles
    if (paginaFin - paginaInicio + 1 < maximoPaginasAMostrar) {
        paginaInicio = Math.max(
            1,
            paginaFin - maximoPaginasAMostrar + 1
        );
    }

    // 📌 Crear items de paginación
    for (
        let numeroPagina = paginaInicio;
        numeroPagina <= paginaFin;
        numeroPagina++
    ) {
        elementosPaginacion.push(
            <Pagination.Item
                key={numeroPagina}
                active={numeroPagina === paginaActual}
                onClick={() => cambiarPagina(numeroPagina)}
            >
                {numeroPagina}
            </Pagination.Item>
        );
    }

    return (
        <Row className="mt-1 align-items-center">

            {/* 📌 Selector de cantidad de registros */}
            <Col xs="auto">
                <Form.Select
                    size="sm"
                    value={registrosPorPagina}
                    onChange={cambiarCantidadRegistros}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={500}>500</option>
                </Form.Select>
            </Col>

            {/* 📌 Controles de paginación */}
            <Col className="d-flex justify-content-center">
                <Pagination className="shadow-sm mt-2">

                    {/* ⏮️ Primera página */}
                    <Pagination.First
                        onClick={() => cambiarPagina(1)}
                        disabled={paginaActual === 1}
                    />

                    {/* ◀️ Página anterior */}
                    <Pagination.Prev
                        onClick={() => cambiarPagina(paginaActual - 1)}
                        disabled={paginaActual === 1}
                    />

                    {/* ... izquierda */}
                    {paginaInicio > 1 && <Pagination.Ellipsis />}

                    {/* 🔢 Números de página */}
                    {elementosPaginacion}

                    {/* ... derecha */}
                    {paginaFin < totalPaginas && <Pagination.Ellipsis />}

                    {/* ▶️ Siguiente página */}
                    <Pagination.Next
                        onClick={() => cambiarPagina(paginaActual + 1)}
                        disabled={paginaActual === totalPaginas}
                    />

                    {/* ⏭️ Última página */}
                    <Pagination.Last
                        onClick={() => cambiarPagina(totalPaginas)}
                        disabled={paginaActual === totalPaginas}
                    />

                </Pagination>
            </Col>

        </Row>
    );
};

export default Paginacion;