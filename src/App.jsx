// Importaciones de librerías
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Importaciones de componentes
import Encabezado from "./components/navegacion/Encabezado";
import RutaProtegida from "./components/rutas/RutaProtegida";

// Importaciones de vistas
import Inicio from "./views/Inicio";
import Huesped from "./views/Huesped";
import Habitacion from "./views/Habitacion";
import Reserva from "./views/Reserva";
import Recepcion from "./views/Recepcion";
import Login from "./views/Login";
import Pagina404 from "./views/Pagina404";

const App = () => {
  return (
    <Router>
      <Encabezado />

      <main className="margen-superior-main">
        <Routes>

          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />
          <Route path="/huesped" element={<Huesped />} /> {/* Ruta pública */}
          <Route path="/habitacion" element={<RutaProtegida><Habitacion /></RutaProtegida>} />
          <Route path="/reserva" element={<RutaProtegida><Reserva /></RutaProtegida>} />
          <Route path="/recepcion" element={<RutaProtegida><Recepcion /></RutaProtegida>} />


          {/* Página no encontrada */}
          <Route path="*" element={<Pagina404 />} />

        </Routes>
      </main>
    </Router>
  );
};

export default App;