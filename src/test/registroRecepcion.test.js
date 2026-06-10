const registroRecepcion = require('./registroRecepcion');

describe("Validacion de recepción", () => {

    test("Prueba 1: No permite campos vacíos", () => {

        const recepcion = {
            fecha_entrada: "",
            fecha_salida: "",
            huesped: "",
            habitacion: "",
            metodo_pago: "",
            estado: ""
        };

        const resultado = registroRecepcion(recepcion);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toBe("Todos los campos son obligatorios");

    });

    test("Prueba 2: La fecha de salida debe ser mayor", () => {

        const recepcion = {
            fecha_entrada: "2026-06-10",
            fecha_salida: "2026-06-09",
            huesped: "Juan Perez",
            habitacion: "101",
            metodo_pago: "Efectivo",
            estado: "Pendiente"
        };

        const resultado = registroRecepcion(recepcion);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toBe(
            "La fecha de salida debe ser mayor que la fecha de entrada"
        );

    });

    test("Prueba 3: El huésped solo debe contener letras", () => {

        const recepcion = {
            fecha_entrada: "2026-06-10",
            fecha_salida: "2026-06-12",
            huesped: "Juan123",
            habitacion: "101",
            metodo_pago: "Efectivo",
            estado: "Pendiente"
        };

        const resultado = registroRecepcion(recepcion);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toBe(
            "El nombre del huésped solo puede contener letras"
        );

    });

    test("Prueba 4: El número de habitación debe ser numérico", () => {

        const recepcion = {
            fecha_entrada: "2026-06-10",
            fecha_salida: "2026-06-12",
            huesped: "Juan Perez",
            habitacion: "A12",
            metodo_pago: "Efectivo",
            estado: "Pendiente"
        };

        const resultado = registroRecepcion(recepcion);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toBe(
            "El número de habitación debe ser numérico"
        );

    });

    test("Prueba 5: El método de pago debe ser válido", () => {

        const recepcion = {
            fecha_entrada: "2026-06-10",
            fecha_salida: "2026-06-12",
            huesped: "Juan Perez",
            habitacion: "101",
            metodo_pago: "Cheque",
            estado: "Pendiente"
        };

        const resultado = registroRecepcion(recepcion);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toBe(
            "El método de pago no es válido"
        );

    });

    test("Prueba 6: La recepción se registra correctamente", () => {

        const recepcion = {
            fecha_entrada: "2026-06-10",
            fecha_salida: "2026-06-12",
            huesped: "Juan Perez",
            habitacion: "101",
            metodo_pago: "Efectivo",
            estado: "Pendiente"
        };

        const resultado = registroRecepcion(recepcion);

        expect(resultado.valido).toBe(true);

    });

});