// src/components/RouteProtegee.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RouteProtegee({ children }) {
  const { user } = useAuth();

  // Connecté → on affiche la page. Sinon → direction /connexion
  return user ? children : <Navigate to="/connexion" replace />;
}