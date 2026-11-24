// src/pages/Recettes.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import CarteRecette from '../components/CarteRecette';
import { nomIngredient } from '../data/donneesTest';
import { useRecettes } from '../context/RecettesContext';
import MenuCarte from '../components/MenuCarte';
// Met un texte en minuscules et sans accents : "Pâtes" devient "pates"
function simplifier(texte) {
  return texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function Recettes() {
  const { toutesLesRecettes, mesRecettes, supprimerRecette } = useRecettes();
  const [recherche, setRecherche] = useState('');

  const motCherche = simplifier(recherche.trim());

  // Une recette correspond si son titre ou un de ses ingrédients contient le mot
  function correspond(r) {
    if (motCherche === '') return true;
    const texte = simplifier(r.titre + ' ' + r.ingredientIds.map(nomIngredient).join(' '));
    return texte.includes(motCherche);
  }

  // Mes recettes (filtrées par la recherche)
  const mesResultats = mesRecettes.filter(correspond);

  // Les autres recettes : toutes sauf les miennes (pour ne pas les voir en double)
  const mesIds = mesRecettes.map((r) => r.id);
  const autresResultats = toutesLesRecettes.filter(
    (r) => !mesIds.includes(r.id) && correspond(r)
  );

  // Suppression avec confirmation
  function supprimer(r) {
    if (window.confirm(`Supprimer la recette « ${r.titre} » ?`)) {
      supprimerRecette(r.id);
    }
  }

  const total = mesResultats.length + autresResultats.length;

  return (
    <section className="section">
      <h2>Recettes</h2>

      {/* Barre de recherche */}
      <div className="recherche">
        <span className="recherche-icone">🔍</span>
        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher une recette ou un ingrédient..."
        />
        {recherche && (
          <button type="button" className="recherche-effacer" onClick={() => setRecherche('')}
                  aria-label="Effacer la recherche">✕</button>
        )}
      </div>

      {motCherche !== '' && (
        <p className="resultats-compteur">
          {total} recette{total > 1 ? 's' : ''} trouvée{total > 1 ? 's' : ''}
        </p>
      )}

      {/* Aucun résultat du tout */}
      {motCherche !== '' && total === 0 && (
        <p className="vide">Aucune recette ne correspond à « {recherche} » 😕</p>
      )}

      {/* ----- PARTIE 1 : TOUTES LES RECETTES (en haut) ----- */}
      {autresResultats.length > 0 && (
        <>
          <h3 className="sous-titre">🍽️ Toutes les recettes</h3>
          <div className="grille">
            {autresResultats.map((r) => (
              <CarteRecette key={r.id} recette={r} />
            ))}
          </div>
        </>
      )}

      {/* ----- PARTIE 2 : MES RECETTES AJOUTÉES (en bas) ----- */}
      {/* Pendant une recherche, on cache cette partie si elle est vide */}
      {(motCherche === '' || mesResultats.length > 0) && (
        <>
          <h3 className="sous-titre">📌 Mes recettes ajoutées</h3>

          {mesRecettes.length === 0 ? (
            // Pas encore de recette ajoutée : une invitation
            <div className="vide-carte">
              <p>Vous n'avez pas encore ajouté de recette.</p>
              <Link to="/ajouter" className="btn btn-principal">+ Ajouter ma première recette</Link>
            </div>
          ) : (
            <div className="grille">
              {mesResultats.map((r) => (
               <div className="carte-wrap" key={r.id}>
  <CarteRecette recette={r} />
  {/* Le menu ⋮ est placé dans le coin de la carte grâce au CSS */}
  <MenuCarte recette={r} onSupprimer={() => supprimer(r)} />
</div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}