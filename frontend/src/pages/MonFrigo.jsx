// src/pages/MonFrigo.jsx
import { useState } from 'react';
import CarteRecette from '../components/CarteRecette';
import { ingredients, recettes, nomIngredient } from '../data/donneesTest';

export default function MonFrigo() {
  // Les numéros des ingrédients cochés (au début : aucun)
  const [coches, setCoches] = useState([]);

  // Coche ou décoche un ingrédient
  function basculer(id) {
    if (coches.includes(id)) {
      setCoches(coches.filter((c) => c !== id)); // déjà coché : on le retire
    } else {
      setCoches([...coches, id]); // pas coché : on l'ajoute
    }
  }

  // Pour chaque recette, on calcule les ingrédients qui manquent
  const resultats = recettes.map((r) => ({
    recette: r,
    manquants: r.ingredientIds.filter((id) => !coches.includes(id)),
  }));

  // Possibles : il ne manque rien
  const possibles = resultats.filter((x) => x.manquants.length === 0);

  // Presque possibles : il manque 1 ou 2 ingrédients,
  // mais on en a au moins un (sinon la recette n'a aucun rapport)
  const presque = resultats.filter(
    (x) =>
      x.manquants.length > 0 &&
      x.manquants.length <= 2 &&
      x.manquants.length < x.recette.ingredientIds.length
  );

  return (
    <section className="section">
      <h2>Qu'est-ce qu'il y a dans votre frigo ?</h2>
      <p className="intro">Cliquez sur les ingrédients que vous avez chez vous.</p>

      {/* Les ingrédients à cocher */}
      <div className="puces centre">
        {ingredients.map((ing) => (
          <button
            key={ing.id}
            onClick={() => basculer(ing.id)}
            className={coches.includes(ing.id) ? 'puce actif' : 'puce'}
          >
            {ing.emoji} {ing.nom}
          </button>
        ))}
      </div>

      {/* Rien de coché : message d'invitation */}
      {coches.length === 0 && (
        <p className="vide">👆 Choisissez au moins un ingrédient pour voir les recettes.</p>
      )}

      {/* Les recettes possibles */}
      {coches.length > 0 && (
        <>
          <h3 className="sous-titre">✅ Vous pouvez cuisiner ({possibles.length})</h3>
          {possibles.length === 0 ? (
            <p className="vide">Pas encore de recette complète, regardez ci-dessous 👇</p>
          ) : (
            <div className="grille">
              {possibles.map((x) => (
                <CarteRecette key={x.recette.id} recette={x.recette} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Les recettes presque possibles */}
      {coches.length > 0 && presque.length > 0 && (
        <>
          <h3 className="sous-titre">🛒 Presque possible ({presque.length})</h3>
          <div className="grille">
            {presque.map((x) => (
              <CarteRecette
                key={x.recette.id}
                recette={x.recette}
                // On transforme les numéros manquants en noms lisibles
                manquants={x.manquants.map(nomIngredient)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}