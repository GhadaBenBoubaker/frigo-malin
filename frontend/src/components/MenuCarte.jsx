// src/components/MenuCarte.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// "recette" : la recette concernée
// "onSupprimer" : la fonction à lancer quand on clique sur Supprimer
export default function MenuCarte({ recette, onSupprimer }) {
  const [ouvert, setOuvert] = useState(false); // le menu est-il ouvert ?
  const conteneur = useRef(null);              // pour savoir où l'on clique

  // Ferme le menu quand on clique n'importe où en dehors
  useEffect(() => {
    function clicDehors(e) {
      if (conteneur.current && !conteneur.current.contains(e.target)) {
        setOuvert(false);
      }
    }
    document.addEventListener('mousedown', clicDehors);
    // Nettoyage : on retire l'écoute quand le composant disparaît
    return () => document.removeEventListener('mousedown', clicDehors);
  }, []);

  return (
    <div className="menu-carte" ref={conteneur}>
      {/* Le bouton avec les trois points */}
      <button
        type="button"
        className="menu-bouton"
        onClick={() => setOuvert(!ouvert)} // ouvre si fermé, ferme si ouvert
        aria-label="Options de la recette"
      >
        ⋮
      </button>

      {/* La liste, visible seulement quand le menu est ouvert */}
      {ouvert && (
        <div className="menu-liste">
          <Link to={`/modifier/${recette.id}`} className="menu-item">
            ✏️ Modifier
          </Link>
          <button
            type="button"
            className="menu-item menu-item-danger"
            onClick={() => {
              setOuvert(false); // on ferme le menu
              onSupprimer();    // puis on lance la suppression
            }}
          >
            🗑️ Supprimer
          </button>
        </div>
      )}
    </div>
  );
}