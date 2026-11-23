// src/pages/Inscription.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Inscription() {
  const { inscription } = useAuth();
  const navigate = useNavigate();

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');

  function envoyer(e) {
    e.preventDefault();

    // Vérification simple avant d'envoyer
    if (motDePasse.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const message = inscription(nom, email, motDePasse);

    if (message) {
      setErreur(message);
    } else {
      navigate('/recettes');
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-carte" onSubmit={envoyer}>
        <h2>Créer un compte 🎉</h2>
        <p className="auth-sous-titre">C'est gratuit et ça prend 30 secondes.</p>

        {erreur && <div className="erreur">{erreur}</div>}

        <label>Prénom</label>
        <input value={nom} onChange={(e) => setNom(e.target.value)}
               placeholder="Ghada" required />

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
               placeholder="vous@exemple.com" required />

        <label>Mot de passe</label>
        <input type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)}
               placeholder="6 caractères minimum" required />

        <button type="submit" className="btn btn-principal btn-plein">Créer mon compte</button>

        <p className="auth-bas">
          Déjà un compte ? <Link to="/connexion">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}