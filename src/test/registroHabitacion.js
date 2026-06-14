function registroHabitacion(habitacion) {
    const { numero_habitacion, tipo_habitacion, tipo_camas,
        tipo_clima, precio, estado } = habitacion;

    const num = Number(numero_habitacion);
    const pre = Number(precio);

    if (
        numero_habitacion === "" || numero_habitacion == null ||
        tipo_habitacion === "" || tipo_habitacion == null ||
        tipo_camas === "" || tipo_camas == null ||
        tipo_clima === "" || tipo_clima == null ||
        precio === "" || precio == null ||
        estado === "" || estado == null
    ) {
        return { valido: false, mensaje: "Todos los campos son obligatorios" };
    }
    if (isNaN(num)) {
        return { valido: false, mensaje: "El número de habitación debe ser numérico" };
    }

    if (num <= 0) {
        return { valido: false, mensaje: "El número de habitación debe ser válido" };
    }

    if (typeof tipo_habitacion !== "string") {
        return { valido: false, mensaje: "El tipo de habitación solo puede contener letras" };
    }

    if (isNaN(pre) || pre <= 0) {
        return { valido: false, mensaje: "El precio debe ser mayor que 0" };
    }

    const estadosValidos = ["Disponible", "Ocupada", "Mantenimiento"];

    if (!estadosValidos.includes(estado)) {
        return { valido: false, mensaje: "El estado no es válido" };
    }

    if (typeof tipo_camas !== "string") {
        return { valido: false, mensaje: "El tipo de camas solo puede contener letras" };
    }

    if (typeof tipo_clima !== "string") {
        return { valido: false, mensaje: "El tipo de clima solo puede contener letras" };
    }

    return { valido: true };
}

module.exports = registroHabitacion;