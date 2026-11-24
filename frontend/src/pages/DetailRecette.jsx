// src/pages/DetailRecette.jsx
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRecettes } from '../context/RecettesContext';
import { useAuth } from '../context/AuthContext';

export default function DetailRecette() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    toutesLesRecettes, ingredients, nomIngredient,
    chargement, supprimerRecette, ajouterAvis,
  } = useRecettes();

  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState('');
  const [message, setMessage] = useState(''); // message d'erreur du serveur

  // On attend que les recettes soient arrivées du backend
  if (chargement) {
    return <section className="section"><p className="vide">Chargement…</p></section>;
  }

  // On cherche la recette dans la liste venue de la base
  const recette = toutesLesRecettes.find((r) => r.id === Number(id));

  if (!recette) {
    return (
      <section className="section">
        <p className="vide">Recette introuvable 😕</p>
        <div className="boutons">
          <Link to="/recettes" className="btn btn-secondaire">← Retour</Link>
        </div>
      </section>
    );
  }

  const avis = recette.avis; // les avis viennent directement de la base

  // Suis-je l'auteur de cette recette ?
  const estAuteur = recette.auteurEmail && recette.auteurEmail === user?.email;

  async function supprimer() {
    if (window.confirm(`Supprimer la recette « ${recette.titre} » ?`)) {
      const erreur = await supprimerRecette(recette.id);
      if (erreur) setMessage('⚠️ ' + erreur);
      else navigate('/recettes');
    }
  }

  const moyenne = avis.length
    ? (avis.reduce((somme, a) => somme + a.note, 0) / avis.length).toFixed(1)
    : null;

  // Envoie l'avis au backend (mutation "ajouterAvis")
  async function envoyerAvis(e) {
    e.preventDefault();
    const erreur = await ajouterAvis(recette.id, Number(note), commentaire);
    if (erreur) {
      setMessage('⚠️ ' + erreur);
    } else {
      setMessage('');
      setCommentaire('');
    }
  }

  return (
    <section className="section detail">
      <Link to="/recettes" className="retour">← Toutes les recettes</Link>

      {recette.image && (
        <img src={recette.image} alt={recette.titre} className="detail-banniere" />
      )}

      <div className="detail-entete">
        {!recette.image && <div className="detail-emoji">{recette.emoji || '🍽️'}</div>}
        <div>
          <h1 className="detail-titre">{recette.titre}</h1>
          {recette.description && <p className="detail-desc">{recette.description}</p>}
          <div className="infos">
            <span className="info">⏱ {recette.tempsPreparation} min</span>
            {moyenne && <span className="info">⭐ {moyenne} ({avis.length} avis)</span>}
          </div>

          {estAuteur && (
            <div className="detail-actions">
              <Link to={`/modifier/${recette.id}`} className="action-modifier">✏️ Modifier</Link>
              <button type="button" className="action-supprimer" onClick={supprimer}>
                🗑️ Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="detail-colonnes">
        <div className="bloc">
          <h3>🧺 Ingrédients</h3>
          <ul className="liste-simple">
            {recette.ingredientIds.map((idIng) => (
              <li key={idIng}>
                {ingredients.find((i) => i.id === idIng)?.emoji} {nomIngredient(idIng)}
              </li>
            ))}
          </ul>
        </div>

        <div className="bloc">
          <h3>👩‍🍳 Préparation</h3>
          <ol className="liste-etapes">
            {recette.etapes.map((etape, index) => (
              <li key={index}>{etape}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="bloc">
        <h3>💬 Avis</h3>
        {avis.length === 0 && <p className="vide-petit">Pas encore d'avis : soyez le premier !</p>}
        {avis.map((a) => (
          <div className="avis" key={a.id}>
            <div>{'⭐'.repeat(a.note)} {a.utilisateur?.nom && <small>par {a.utilisateur.nom}</small>}</div>
            <p>{a.commentaire}</p>
          </div>
        ))}

        <form className="form-avis" onSubmit={envoyerAvis}>
          <select value={note} onChange={(e) => setNote(e.target.value)}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} ⭐</option>
            ))}
          </select>
          <input value={commentaire} onChange={(e) => setCommentaire(e.target.value)}
                 placeholder="Votre commentaire..." required />
          <button type="submit" className="btn-petit">Publier</button>
        </form>
      </div>
    </section>
  );
}