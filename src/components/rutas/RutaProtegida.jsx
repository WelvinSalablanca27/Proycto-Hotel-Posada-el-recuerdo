import { Navigate } from "react-router-dom";

const RutaProtegida = ({ children }) => {
    const usuario = localStorage.getItem("usuario-supabase");

    // 🔥 SI NO HAY USUARIO → LO MANDA A HABITACION
    if (!usuario) {
        return <Navigate to="/habitacion" replace />;
    }

    return children;
};

export default RutaProtegida;