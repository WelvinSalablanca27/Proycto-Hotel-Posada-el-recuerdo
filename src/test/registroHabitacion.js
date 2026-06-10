function registroHabitacion(habitacion) {

    const {
        numero_habitacion,
        tipo_habitacion,
        tipo_camas,
        tipo_clima,
        precio,
        estado
    } = habitacion;

    // Campos obligatorios
    if (
        !numero_habitacion ||
        !tipo_habitacion ||
        !tipo_camas ||
        !tipo_clima ||
        !precio ||
        !estado
    ) {

        return {
            valido: false,
            mensaje: "Todos los campos son obligatorios"
        };

    }

    // Número de habitación
    if (
        isNaN(numero_habitacion) ||
        Number(numero_habitacion) <= 0
    ) {

        return {
            valido: false,
            mensaje: "El número de habitación debe ser numérico"
        };

    }

    // Expresiones regulares
    const regexTexto =
        /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;

    const regexCamas =
        /^[a-zA-Z0-9ÁÉÍÓÚáéíóúÑñ\s]+$/;

    // Tipo de habitación
    if (!regexTexto.test(tipo_habitacion)) {

        return {
            valido: false,
            mensaje: "El tipo de habitación solo puede contener letras"
        };

    }

    // Tipo de camas
    if (!regexCamas.test(tipo_camas)) {

        return {
            valido: false,
            mensaje: "El tipo de camas solo puede contener letras y números"
        };

    }

    // Tipo de clima
    if (!regexTexto.test(tipo_clima)) {

        return {
            valido: false,
            mensaje: "El tipo de clima solo puede contener letras"
        };

    }

    // Precio
    if (
        isNaN(precio) ||
        Number(precio) <= 0
    ) {

        return {
            valido: false,
            mensaje: "El precio debe ser mayor que 0"
        };

    }

    // Estado
    const estadosValidos = [
        "Disponible",
        "Ocupada",
        "Mantenimiento"
    ];

    if (!estadosValidos.includes(estado)) {

        return {
            valido: false,
            mensaje: "El estado no es válido"
        };

    }

    return {
        valido: true
    };

}

module.exports = registroHabitacion;