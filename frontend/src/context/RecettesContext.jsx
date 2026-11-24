// src/context/RecettesContext.jsx
import { createContext, useContext, useState } from 'react';
import { recettes as recettesTest } from '../data/donneesTest';
import { useAuth } from './AuthContext';

const RecettesContext = createContext();

// Le nom sous lequel la liste est gardée dans le navigateur
const CLE = 'recettesAjoutees';

export function RecettesProvider({ children }) {
  const { user } = useAuth(); // l'utilisateur connecté

  // Les recettes ajoutées, relues au démarrage depuis le navigateur
  const [ajoutees, setAjoutees] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CLE) || '[]');
    } catch {
      return [];
    }
  });

  // Met à jour la liste à l'écran ET dans le navigateur.
  // Renvoie false si le navigateur n'a plus de place.
  function sauvegarder(liste) {
    setAjoutees(liste);
    try {
      localStorage.setItem(CLE, JSON.stringify(liste));
      return true;
    } catch {
      return false;
    }
  }

  // Ajoute une recette (le numéro vient de l'heure, donc il est unique)
  function ajouterRecette(donnees) {
    const nouvelle = { ...donnees, id: Date.now(), auteurEmail: user.email, avis: [] };
    return sauvegarder([nouvelle, ...ajoutees]);
  }

  // Modifie une recette : on remplace seulement les champs envoyés
  function modifierRecette(id, donnees) {
    return sauvegarder(ajoutees.map((r) => (r.id === id ? { ...r, ...donnees } : r)));
  }

  // Supprime une recette
  function supprimerRecette(id) {
    sauvegarder(ajoutees.filter((r) => r.id !== id));
  }

  // Seulement MES recettes (celles dont je suis l'auteur)
  const mesRecettes = ajoutees.filter((r) => r.auteurEmail === user?.email);

  // Toutes les recettes : les ajoutées + celles de départ
  const toutesLesRecettes = [...ajoutees, ...recettesTest];

  return (
    <RecettesContext.Provider
      value={{ toutesLesRecettes, mesRecettes, ajouterRecette, modifierRecette, supprimerRecette }}
    >
      {children}
    </RecettesContext.Provider>
  );
}

// Raccourci pour l'utiliser dans n'importe quelle page
export function useRecettes() {
  return useContext(RecettesContext);
}