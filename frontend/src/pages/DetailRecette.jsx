// src/pages/DetailRecette.jsx
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { recettes, nomIngredient, ingredients } from '../data/donneesTest';

export default function DetailRecette() {
  // On lit le numéro dans l'adresse, puis on cherche la recette
  const { id } = useParams();
  const recette = recettes.find((r) => r.id === Number(id));

  // Les avis de la recette + le formulaire pour en ajouter
  const [avis, setAvis] = useState(recette?.avis ?? []);
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState('');

  // Recette introuvable (mauvaise adresse)
  if (!recette) {
    return (
      <section className="section">
        <p className="vide">Recette introuvable 😕</p>
        <div className="boutons"><Link to="/recettes" className="btn btn-secondaire">← Retour</Link></div>
      </section>
    );
  }

  // Moyenne des notes (affichée seulement s'il y a des avis)
  const moyenne = avis.length
    ? (avis.reduce((somme, a) => somme + a.note, 0) / avis.length).toFixed(1)
    : null;

  function envoyerAvis(e) {
    e.preventDefault(); // empêche le rechargement de la page
    const nouvelAvis = { id: Date.now(), note: Number(note), commentaire };
    // Plus tard : ici on appellera la mutation GraphQL "ajouterAvis"
    setAvis([nouvelAvis, ...avis]); // on l'ajoute en haut de la liste
    setCommentaire('');
  }

  return (
    <section className="section detail">
      <Link to="/recettes" className="retour">← Toutes les recettes</Link>

      {/* En-tête : emoji, titre, temps, note moyenne */}
      <div className="detail-entete">
        <div className="detail-emoji">{recette.emoji}</div>
        <div>
          <h1 className="detail-titre">{recette.titre}</h1>
          <p className="detail-desc">{recette.description}</p>
          <div className="infos">
            <span className="info">⏱ {recette.tempsPreparation} min</span>
            {moyenne && <span className="info">⭐ {moyenne} ({avis.length} avis)</span>}
          </div>
        </div>
      </div>

      <div className="detail-colonnes">
        {/* Colonne gauche : ingrédients */}
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

        {/* Colonne droite : étapes numérotées */}
        <div className="bloc">
          <h3>👩‍🍳 Préparation</h3>
          <ol className="liste-etapes">
            {recette.etapes.map((etape, index) => (
              <li key={index}>{etape}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* Les avis */}
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
          <input
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Votre commentaire..."
            required
          />
          <button type="submit" className="btn-petit">Publier</button>
        </form>
      </div>
    </section>
  );
}