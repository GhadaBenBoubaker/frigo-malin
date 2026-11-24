// src/graphql/mutations.js

/*fichier contient les actions : inscription, connexion, ajout, modification et 
suppression de recette, ajout d'avis.*/
import { gql } from '@apollo/client';

export const INSCRIPTION = gql`
  mutation Inscription($input: RegisterInput!) {
    inscription(input: $input) {
      token
      user { id nom email }
    }
  }
`;

export const CONNEXION = gql`
  mutation Connexion($input: LoginInput!) {
    connexion(input: $input) {
      token
      user { id nom email }
    }
  }
`;

export const AJOUTER_RECETTE = gql`
  mutation AjouterRecette($input: RecetteInput!) {
    ajouterRecette(input: $input) { id }
  }
`;

export const MODIFIER_RECETTE = gql`
  mutation ModifierRecette($id: Int!, $input: RecetteInput!) {
    modifierRecette(id: $id, input: $input) { id }
  }
`;

export const SUPPRIMER_RECETTE = gql`
  mutation SupprimerRecette($id: Int!) {
    supprimerRecette(id: $id)
  }
`;

export const AJOUTER_AVIS = gql`
  mutation AjouterAvis($recetteId: Int!, $note: Int!, $commentaire: String!) {
    ajouterAvis(recetteId: $recetteId, note: $note, commentaire: $commentaire) { id }
  }
`;