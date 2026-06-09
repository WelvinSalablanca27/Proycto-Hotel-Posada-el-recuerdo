function registroHuesped(huesped) {
    const {nombre_huesped, apellido_huesped, cedula_huesped, telefono_huesped, correo_huesped, direccion_huesped} = huesped;

    // Campos obligatorios
    if (!nombre_huesped || !apellido_huesped || !cedula_huesped || !telefono_huesped || !correo_huesped || !direccion_huesped) {
        return { valido: false, mensaje: "Todos los campos son obligatorios" };
    }

    // Validar nombre
    const regexNombre = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!regexNombre.test(nombre_huesped)) {
        return { valido: false, mensaje: "El nombre solo puede contener letras" };
    }

    // Validar apellido
    if (!regexNombre.test(apellido_huesped)) {
        return { valido: false, mensaje: "El apellido solo puede contener letras" };
    }

    // Cédula
    const regexCedula = /^[0-9-]+$/;

    if (!regexCedula.test(cedula_huesped)) {
        return { valido: false, mensaje: "La cédula no es válida" };
    }

    // Teléfono
    const regexTelefono = /^[0-9]{8}$/;

    if (!regexTelefono.test(telefono_huesped)) {
        return { valido: false, mensaje: "El teléfono debe contener 8 números" };
    }

    // Correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(correo_huesped)) {
        return { valido: false, mensaje: "El correo no es válido" };
    }

    // Dirección
    if (direccion_huesped && direccion_huesped.length > 255) {
        return { valido: false, mensaje: "La dirección no puede exceder los 255 caracteres" };
    }

    return { valido: true};
}

module.exports = registroHuesped;