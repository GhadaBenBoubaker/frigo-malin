package com.frigomalin.backend.graphql;

import com.frigomalin.backend.dto.RecipeDTO;

import java.util.List;


/*RecipeDTO contient des champs que le client ne doit pas 
envoyer (id, auteurEmail, avis). toDTO() les met à null et réutilise votre RecipeService tel que */
/**
 * Correspond à "input RecetteInput" du schéma (sans id, auteur ni avis).
 */
public record RecetteInput(
        String titre,
        String description,
        String image,
        String emoji,
        Integer tempsPreparation,
        List<String> etapes,
        List<Long> ingredientIds
) {
    public RecipeDTO toDTO() {
        return new RecipeDTO(null, titre, description, image, emoji,
                tempsPreparation, etapes, ingredientIds, null, List.of());
    }
}