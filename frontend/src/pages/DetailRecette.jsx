// src/pages/DetailRecette.jsx
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { nomIngredient, ingredients } from '../data/donneesTest';
import { useRecettes } from '../context/RecettesContext';
import { useAuth } from '../context/AuthContext';

export default function DetailRecette() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toutesLesRecettes, supprimerRecette } = useRecettes();

  // On cherche la recette dans TOUTES les recettes (départ + ajoutées)
  const recette = toutesLesRecettes.find((r) => r.id === Number(id));

  const [avis, setAvis] = useState(recette?.avis ?? []);
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState('');

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

  // Suis-je l'auteur de cette recette ? (seules les recettes ajoutées ont un auteur)
  const estAuteur = recette.auteurEmail && recette.auteurEmail === user?.email;

  function supprimer() {
    if (window.confirm(`Supprimer la recette « ${recette.titre} » ?`)) {
      supprimerRecette(recette.id);
      navigate('/recettes');
    }
  }

  const moyenne = avis.length
    ? (avis.reduce((somme, a) => somme + a.note, 0) / avis.length).toFixed(1)
    : null;

  function envoyerAvis(e) {
    e.preventDefault();
    const nouvelAvis = { id: Date.now(), note: Number(note), commentaire };
    // Plus tard : ici on appellera la mutation GraphQL "ajouterAvis"
    setAvis([nouvelAvis, ...avis]);
    setCommentaire('');
  }

  return (
    <section className="section detail">
      <Link to="/recettes" className="retour">← Toutes les recettes</Link>

      {/* Grande photo si la recette en a une */}
      {recette.image && (
        <img src={recette.image} alt={recette.titre} className="detail-banniere" />
      )}

      <div className="detail-entete">
        {/* L'emoji ne s'affiche que s'il n'y a pas de photo */}
        {!recette.image && <div className="detail-emoji">{recette.emoji || '🍽️'}</div>}
        <div>
          <h1 className="detail-titre">{recette.titre}</h1>
          {recette.description && <p className="detail-desc">{recette.description}</p>}
          <div className="infos">
            <span className="info">⏱ {recette.tempsPreparation} min</span>
            {moyenne && <span className="info">⭐ {moyenne} ({avis.length} avis)</span>}
          </div>

          {/* Boutons visibles seulement pour l'auteur */}
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
            <div>{'⭐'.repeat(a.note)}</div>
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