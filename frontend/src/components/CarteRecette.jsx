// src/components/CarteRecette.jsx
import { Link } from 'react-router-dom';

// "manquants" est facultatif : la liste des ingrédients qu'il manque
export default function CarteRecette({ recette, manquants = [] }) {
  return (
    <Link to={`/recette/${recette.id}`} className="carte">
      <div className="carte-image">
        {/* Image si elle existe, sinon l'emoji de la recette */}
        {recette.image ? <img src={recette.image} alt={recette.titre} /> : recette.emoji || '🍽️'}
      </div>
      <div className="carte-corps">
        <h3>{recette.titre}</h3>
        <p>⏱ {recette.tempsPreparation} min</p>

        {/* Affiché seulement s'il manque quelque chose */}
        {manquants.length > 0 && (
          <p className="manque">🛒 Il manque : {manquants.join(', ')}</p>
        )}
      </div>
    </Link>
  );
}