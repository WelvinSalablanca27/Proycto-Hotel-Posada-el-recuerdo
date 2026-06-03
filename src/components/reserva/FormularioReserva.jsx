import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";

import { supabase } from "../../database/supabaseconfig";

import TarjetaReserva from "./TarjetasReserva";

const FormularioReserva = () => {

    // 🔹 Estado donde se guardan las reservas
    const [reservas, setReservas] = useState([]);

    // 🔹 Obtener reservas desde Supabase
    const obtenerReservas = async () => {

        const { data, error } = await supabase
            .from("reserva")
            .select("*");

        if (error) {
            console.log("Error obteniendo reservas:", error);
        } else {
            console.log(data);
            setReservas(data);
        }
    };

    // 🔹 Se ejecuta al cargar el componente
    useEffect(() => {
        obtenerReservas();
    }, []);

    // 🔹 Abrir modal editar
    const abrirModalEdicion = (reserva) => {
        console.log("Editar:", reserva);
    };

    // 🔹 Abrir modal eliminar
    const abrirModalEliminacion = (reserva) => {
        console.log("Eliminar:", reserva);
    };

    return (
        <Container className="mt-5 pt-5">

            {/* BOTÓN DE PRUEBA */}
            <div className="d-flex justify-content-end mb-3">

                <Button variant="primary">
                    Nueva Reserva
                </Button>

            </div>

            {/* TARJETAS */}
            <TarjetaReserva
                reservas={reservas}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
            />

        </Container>
    );
};

export default FormularioReserva;