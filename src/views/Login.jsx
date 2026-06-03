import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioLogin from '../components/login/FormularioLogin';
import { supabase } from '../database/supabaseconfig';

const Login = () => {

  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navegar = useNavigate();

  useEffect(() => {

    const handleResize = () =>
      setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);

  }, []);

  const iniciarSesion = async () => {

    try {

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: usuario,
          password: contrasena
        });

      if (error) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      if (data.user) {

        localStorage.setItem(
          "usuario-supabase",
          usuario
        );

        navegar("/");

      }

    } catch (err) {

      setError("Error al conectar con el servidor");

      console.error(
        "Error en la solicitud:",
        err
      );

    }
  };

  useEffect(() => {

    const usuarioGuardado =
      localStorage.getItem(
        "usuario-supabase"
      );

    if (usuarioGuardado) {
      navegar("/");
    }

  }, [navegar]);

  return (

    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background:
          "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #00bfa5 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        padding: 0,
        margin: 0,
      }}
    >

      <div
        style={{
          background:
            "rgba(255,255,255,0.12)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border:
            "1px solid rgba(255,255,255,0.25)",
          borderRadius: "32px",
          boxShadow: `
            0 20px 50px rgba(0,0,0,0.35),
            inset 0 0 20px rgba(255,255,255,0.08)
          `,
          overflow: "hidden",
          maxWidth: "1000px",
          width: "88%",
          display: "flex",
          flexDirection:
            isMobile ? "column" : "row",
          minHeight:
            isMobile ? "auto" : "620px",
          position: "relative",
          transition: "all 0.3s ease",
        }}
      >

        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background:
              "rgba(255,255,255,0.08)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "-80px",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background:
              "rgba(255,255,255,0.06)",
          }}
        />

        <div
          style={{
            flex: 1,
            padding:
              isMobile
                ? "40px 20px"
                : "60px 50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}
        >

          <div
            style={{
              textAlign: "center",
              marginBottom: "35px",
            }}
          >

            <h1
              style={{
                fontWeight: "800",
                color: "#ffffff",
                margin: 0,
                fontSize: "2.5rem"
              }}
            >
              Bienvenido
            </h1>

            <h4
              style={{
                fontWeight: "500",
                color: "#d9fdf8",
                marginTop: "10px"
              }}
            >
              Sistema Hotelero
            </h4>

          </div>

          <div
            style={{
              width: "100%",
              maxWidth: "350px",
            }}
          >

            <FormularioLogin
              usuario={usuario}
              contrasena={contrasena}
              error={error}
              setUsuario={setUsuario}
              setContrasena={setContrasena}
              iniciarSesion={iniciarSesion}
            />

          </div>

          <div
            style={{
              marginTop: "25px",
              fontSize: "0.9rem",
              textAlign: "center",
              color: "#d9fdf8",
            }}
          >
            Acceso seguro • Solo personal autorizado
          </div>

        </div>

        {!isMobile && (

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "50px",
              zIndex: 1,
              color: "#ffffff",
              textAlign: "center",
            }}
          >

            <div
              style={{
                width: "220px",
                height: "220px",
                borderRadius: "30px",
                backgroundImage:
                  "url('https://i.pinimg.com/736x/09/3f/a9/093fa9ddb76f5e0f18d2d2c4680ba336.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                marginBottom: "25px",
                boxShadow:
                  "0 8px 25px rgba(0,0,0,0.25)"
              }}
            ></div>
            <h2
              style={{
                fontWeight: "700",
                marginBottom: "15px"
              }}
            >
              Gestión Hotelera
            </h2>

            <p
              style={{
                fontSize: "1rem",
                lineHeight: "1.7",
                color: "#e8fdfb",
                maxWidth: "320px"
              }}
            >
              Administra huéspedes, habitaciones,
              reservas y reportes desde un solo lugar.
            </p>

          </div>

        )}

      </div>

    </div>

  );
};

export default Login;