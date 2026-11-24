// src/graphql/queries.js
import { gql } from '@apollo/client';

// Toutes les recettes, avec leurs avis
export const RECETTES = gql`
  query Recettes {
    recettes {
      id
      titre
      description
      image
      emoji
      tempsPreparation
      etapes
      ingredientIds
      auteurEmail
      avis {
        id
        note
        commentaire
        utilisateur {
          nom
        }
      }
    }
  }
`;

// Tous les ingrédients possibles
export const INGREDIENTS = gql`
  query Ingredients {
    ingredients {
      id
      nom
      emoji
    }
  }
`;