// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, deconnexion } = useAuth();
  const navigate = useNavigate();

  function quitter() {
    deconnexion();
    navigate('/'); // retour à la page d'arrivée
  }

  return (
    <nav className="navbar">
      {/* Gauche : logo (mène à l'app si connecté, sinon à l'arrivée) */}
      <Link to={user ? '/recettes' : '/'} className="logo">
        <span className="logo-icone">🧊</span>
        <span className="logo-nom">Mon Frigo Malin</span>
      </Link>

      {/* Centre : les liens changent selon l'état */}
      <div className="liens">
        {user ? (
          <>
            <Link to="/recettes" className="lien">Recettes</Link>
            <Link to="/frigo" className="lien">Mon frigo</Link>
            <Link to="/ajouter" className="lien">Ajouter</Link>
          </>
        ) : (
          <>
            <a href="/#fonctionnalites" className="lien">Fonctionnalités</a>
            <a href="/#comment" className="lien">Comment ça marche</a>
          </>
        )}
      </div>

      {/* Droite : boutons */}
      <div className="actions">
        {user ? (
          <>
            <span className="bonjour">Bonjour {user.nom} 👋</span>
            <button onClick={quitter} className="lien-bouton">Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/connexion" className="lien-bouton">Se connecter</Link>
            <Link to="/inscription" className="btn-petit">S'inscrire</Link>
          </>
        )}
      </div>
    </nav>
  );
}