const registroHabitacion = require('./registroHabitacion');

describe("Validacion de habitación", () => {

    test("Prueba 1: No permite campos vacíos", () => {

        const habitacion = { numero_habitacion: "", tipo_habitacion: "", tipo_camas: "", tipo_clima: "", precio: "", estado: ""
        };

        const resultado = registroHabitacion(habitacion);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toBe("Todos los campos son obligatorios");

    });

    test("Prueba 2: El número de habitación debe ser numérico", () => {

        const habitacion = { numero_habitacion: "A12", tipo_habitacion: "Suite", tipo_camas: "2 camas", tipo_clima: "Aire acondicionado",
            precio: "100", estado: "Disponible"
        };

        const resultado = registroHabitacion(habitacion);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toBe("El número de habitación debe ser numérico");

    });

    test("Prueba 3: El precio debe ser mayor que 0", () => {

        const habitacion = {numero_habitacion: "101", tipo_habitacion: "Suite", tipo_camas: "2 camas",
        tipo_clima: "Aire acondicionado",  precio: "-50", estado: "Disponible"
        };
        
        const resultado = registroHabitacion(habitacion);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toBe("El precio debe ser mayor que 0");

    });

    test("Prueba 4: El estado debe ser válido", () => {

        const habitacion = { numero_habitacion: "101", tipo_habitacion: "Suite",
            tipo_camas: "2 camas", tipo_clima: "Aire acondicionado", precio: "100", estado: "Ocupadaaa"
        };

        const resultado = registroHabitacion(habitacion);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toBe("El estado no es válido");

    });
    test("Prueba 5: Registrar habitación válida", () => {

        const habitacion = { numero_habitacion: "101", tipo_habitacion: "Suite", tipo_camas: "2 camas",
            tipo_clima: "Aire acondicionado", precio: "100", estado: "Disponible"
        };

        const resultado = registroHabitacion(habitacion);

        expect(resultado.valido).toBe(true);

    });

});