import React from "react";
import { Form, InputGroup } from "react-bootstrap";

const CuadrosBusquedas = ({ textoBusqueda, manejarCambioBusqueda }) => {

    // 🔎 Componente de búsqueda reutilizable
    // Recibe el texto actual y la función para actualizarlo desde el padre
    return (
        <InputGroup
            style={{ width: "100%", borderRadius: "0.37rem" }}
            className="shadow-sm"
        >

            {/* 🔍 Ícono de búsqueda */}
            <InputGroup.Text>
                <i className="bi bi-search"></i>
            </InputGroup.Text>

            {/* ✏️ Input de búsqueda controlado */}
            <Form.Control
                type="text"
                placeholder="Buscar..."
                value={textoBusqueda}
                onChange={manejarCambioBusqueda}
            />

        </InputGroup>
    );
};

export default CuadrosBusquedas;