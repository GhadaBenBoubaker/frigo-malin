// src/pages/Connexion.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Connexion() {
  const { connexion } = useAuth();
  const navigate = useNavigate();

  // Ce que l'utilisateur tape
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');

    // "async" + "await" : on attend la réponse du serveur
  async function envoyer(e) {
    e.preventDefault(); // empêche le rechargement de la page
    const message = await connexion(email, motDePasse);

    if (message) {
      setErreur(message); // il y a eu un problème
    } else {
      navigate('/recettes'); // succès : direction l'app
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-carte" onSubmit={envoyer}>
        <h2>Content de vous revoir 👋</h2>
        <p className="auth-sous-titre">Connectez-vous pour retrouver vos recettes.</p>

        {erreur && <div className="erreur">{erreur}</div>}

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
               placeholder="vous@exemple.com" required />

        <label>Mot de passe</label>
        <input type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)}
               placeholder="••••••••" required />

        <button type="submit" className="btn btn-principal btn-plein">Se connecter</button>

        <p className="auth-bas">
          Pas encore de compte ? <Link to="/inscription">S'inscrire</Link>
        </p>
      </form>
    </div>
  );
}