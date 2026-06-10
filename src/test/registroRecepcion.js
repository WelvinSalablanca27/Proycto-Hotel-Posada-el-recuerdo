function registroRecepcion(recepcion) {

    const {
        fecha_entrada,
        fecha_salida,
        huesped,
        habitacion,
        metodo_pago,
        estado
    } = recepcion;

    // Campos obligatorios
    if (
        !fecha_entrada ||
        !fecha_salida ||
        !huesped ||
        !habitacion ||
        !metodo_pago ||
        !estado
    ) {

        return {
            valido: false,
            mensaje: "Todos los campos son obligatorios"
        };

    }

    // Validar fechas
    const entrada = new Date(fecha_entrada);
    const salida = new Date(fecha_salida);

    if (salida <= entrada) {

        return {
            valido: false,
            mensaje: "La fecha de salida debe ser mayor que la fecha de entrada"
        };

    }

    // Validar huésped
    const regexTexto =
        /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!regexTexto.test(huesped)) {

        return {
            valido: false,
            mensaje: "El nombre del huésped solo puede contener letras"
        };

    }

    // Validar habitación
    if (
        isNaN(habitacion) ||
        Number(habitacion) <= 0
    ) {

        return {
            valido: false,
            mensaje: "El número de habitación debe ser numérico"
        };

    }

    // Métodos de pago válidos
    const metodosValidos = [
        "Efectivo",
        "Tarjeta",
        "Transferencia"
    ];

    if (!metodosValidos.includes(metodo_pago)) {

        return {
            valido: false,
            mensaje: "El método de pago no es válido"
        };

    }

    // Estados válidos
    const estadosValidos = [
        "Pendiente",
        "Confirmada",
        "Finalizada"
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

module.exports = registroRecepcion;