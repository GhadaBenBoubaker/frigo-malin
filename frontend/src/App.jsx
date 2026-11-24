// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import RouteProtegee from './components/RouteProtegee';
import Landing from './pages/Landing';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Recettes from './pages/Recettes';
import MonFrigo from './pages/MonFrigo';
import DetailRecette from './pages/DetailRecette';
import AjouterRecette from './pages/AjouterRecette';

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<Landing />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />

        {/* Pages privées : il faut être connecté */}
        <Route path="/recettes" element={<RouteProtegee><Recettes /></RouteProtegee>} />
        <Route path="/frigo" element={<RouteProtegee><MonFrigo /></RouteProtegee>} />
        <Route path="/recette/:id" element={<RouteProtegee><DetailRecette /></RouteProtegee>} />
<Route path="/ajouter" element={<RouteProtegee><AjouterRecette key="ajout" /></RouteProtegee>} />
<Route path="/modifier/:id" element={<RouteProtegee><AjouterRecette key="modif" /></RouteProtegee>} />
        {/* Adresse inconnue → retour à l'accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}