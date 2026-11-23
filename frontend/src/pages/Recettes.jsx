// src/pages/Recettes.jsx
import { useState } from 'react';
import CarteRecette from '../components/CarteRecette';
import { recettes, nomIngredient } from '../data/donneesTest';

// Met un texte en minuscules et sans accents : "Pâtes" devient "pates".
// Comme ça, la recherche trouve les mots même si on oublie les accents.
function simplifier(texte) {
  return texte
    .normalize('NFD')                // sépare les lettres de leurs accents
    .replace(/[\u0300-\u036f]/g, '') // supprime les accents
    .toLowerCase();
}

export default function Recettes() {
  // Ce que l'utilisateur a tapé dans la barre (au début : rien)
  const [recherche, setRecherche] = useState('');

  const motCherche = simplifier(recherche.trim());

  // On garde seulement les recettes qui correspondent
  const resultats = recettes.filter((r) => {
    // Si la barre est vide, on garde tout
    if (motCherche === '') return true;

    // On regroupe le titre et les noms des ingrédients dans un seul texte
    const texteRecette = simplifier(
      r.titre + ' ' + r.ingredientIds.map(nomIngredient).join(' ')
    );

    // La recette est gardée si ce texte contient le mot cherché
    return texteRecette.includes(motCherche);
  });

  return (
    <section className="section">
      <h2>Toutes les recettes</h2>

      {/* La barre de recherche */}
      <div className="recherche">
        <span className="recherche-icone">🔍</span>
        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher une recette ou un ingrédient..."
        />

        {/* Le bouton ✕ apparaît seulement si quelque chose est écrit */}
        {recherche && (
          <button
            type="button"
            className="recherche-effacer"
            onClick={() => setRecherche('')}
            aria-label="Effacer la recherche"
          >
            ✕
          </button>
        )}
      </div>

      {/* Le nombre de résultats, affiché seulement pendant une recherche */}
      {motCherche !== '' && (
        <p className="resultats-compteur">
          {resultats.length} recette{resultats.length > 1 ? 's' : ''} trouvée
          {resultats.length > 1 ? 's' : ''}
        </p>
      )}

      {/* Aucun résultat : un message à la place de la liste */}
      {resultats.length === 0 ? (
        <p className="vide">Aucune recette ne correspond à « {recherche} » 😕</p>
      ) : (
        <div className="grille">
          {resultats.map((r) => (
            <CarteRecette key={r.id} recette={r} />
          ))}
        </div>
      )}
    </section>
  );
}