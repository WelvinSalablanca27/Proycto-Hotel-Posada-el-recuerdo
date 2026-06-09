const registroHuesped = require('./registroHuesped');

console.log('Prueba 1: El huésped no se registra con campos vacíos');
describe("Validacion de huésped", () => {
    it("No permite campos vacíos", () => {
        const huesped = {
            nombre_huesped: "",
            apellido_huesped: "",
            cedula_huesped: "",
            telefono_huesped: "",
            correo_huesped: "",
            direccion_huesped: ""
        };

        const resultado = registroHuesped(huesped);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toBe("Todos los campos son obligatorios");
    });

    console.log('Prueba 2: El nombre del huésped solo debe contener letras');
    it("No permite números en el nombre", () => {
        const huesped = {
            nombre_huesped: "Juan123",
            apellido_huesped: "Pérez",
            cedula_huesped: "001-123456-0001",
            telefono_huesped: "88887777",
            correo_huesped: "juan@gmail.com",
            direccion_huesped: "Managua"
        };

        const resultado = registroHuesped(huesped);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toBe("El nombre solo puede contener letras");
    });

    console.log('Prueba 3: El teléfono del huésped debe tener 8 números');
    it("No permite teléfonos inválidos", () => {
        const huesped = {
            nombre_huesped: "Juan",
            apellido_huesped: "Pérez",
            cedula_huesped: "001-123456-0001",
            telefono_huesped: "123",
            correo_huesped: "juan@gmail.com",
            direccion_huesped: "Managua"
        };

        const resultado = registroHuesped(huesped);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toBe("El teléfono debe contener 8 números");
    });

    console.log('Prueba 4: El correo del huésped debe ser válido');
    it("No permite correos inválidos", () => {
        const huesped = {
            nombre_huesped: "Juan",
            apellido_huesped: "Pérez",
            cedula_huesped: "001-123456-0001",
            telefono_huesped: "88887777",
            correo_huesped: "juangmail.com",
            direccion_huesped: "Managua"
        };

        const resultado = registroHuesped(huesped);

        expect(resultado.valido).toBe(false);
        expect(resultado.mensaje).toBe("El correo no es válido");
    });

    console.log('Prueba 5: El huésped se registra correctamente');
    it("Agregar huésped válido", () => {
        const huesped = {
            nombre_huesped: "Juan",
            apellido_huesped: "Pérez",
            cedula_huesped: "001-123456-0001",
            telefono_huesped: "88887777",
            correo_huesped: "juan@gmail.com",
            direccion_huesped: "Managua"
        };

        const resultado = registroHuesped(huesped);

        expect(resultado.valido).toBe(true);
    });
});