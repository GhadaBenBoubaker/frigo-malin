// src/context/RecettesContext.jsx
import { createContext, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAuth } from './AuthContext';
import { RECETTES, INGREDIENTS } from '../graphql/queries';
import {
  AJOUTER_RECETTE,
  MODIFIER_RECETTE,
  SUPPRIMER_RECETTE,
  AJOUTER_AVIS,
} from '../graphql/mutations';
import { messageErreur } from '../utils/erreurs';

const RecettesContext = createContext();

export function RecettesProvider({ children }) {
  const { user, deconnexion } = useAuth();

  // On lit les recettes et les ingrédients dans la base
  const { data: dataRecettes, loading: chargement, error: erreur, refetch } = useQuery(RECETTES);
  const { data: dataIngredients } = useQuery(INGREDIENTS);

  const [mutAjouter] = useMutation(AJOUTER_RECETTE);
  const [mutModifier] = useMutation(MODIFIER_RECETTE);
  const [mutSupprimer] = useMutation(SUPPRIMER_RECETTE);
  const [mutAvis] = useMutation(AJOUTER_AVIS);

  const toutesLesRecettes = dataRecettes?.recettes ?? [];
  const ingredients = dataIngredients?.ingredients ?? [];

  // Le nom d'un ingrédient à partir de son numéro
  function nomIngredient(id) {
    return ingredients.find((i) => i.id === id)?.nom ?? '';
  }

  // Seulement MES recettes (celles dont je suis l'auteur)
  const mesRecettes = toutesLesRecettes.filter(
    (r) => r.auteurEmail && r.auteurEmail === user?.email
  );

  // Lance une action sur le serveur, puis recharge la liste.
  // Renvoie un message d'erreur, ou null si tout va bien.
  async function executer(action) {
    try {
      await action();
      await refetch(); // on recharge les recettes à jour
      return null;
    } catch (e) {
      const message = messageErreur(e);
      // Le jeton n'est plus valide (ex : backend redémarré) : on déconnecte
      if (message.includes('Connexion requise')) deconnexion();
      return message;
    }
  }

  const ajouterRecette = (donnees) =>
    executer(() => mutAjouter({ variables: { input: donnees } }));

  const modifierRecette = (id, donnees) =>
    executer(() => mutModifier({ variables: { id, input: donnees } }));

  const supprimerRecette = (id) =>
    executer(() => mutSupprimer({ variables: { id } }));

  const ajouterAvis = (recetteId, note, commentaire) =>
    executer(() => mutAvis({ variables: { recetteId, note, commentaire } }));

  return (
    <RecettesContext.Provider
      value={{
        toutesLesRecettes,
        mesRecettes,
        ingredients,
        nomIngredient,
        chargement,
        erreur,
        ajouterRecette,
        modifierRecette,
        supprimerRecette,
        ajouterAvis,
      }}
    >
      {children}
    </RecettesContext.Provider>
  );
}

export function useRecettes() {
  return useContext(RecettesContext);
}