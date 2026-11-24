package com.frigomalin.backend.dto;

import java.util.List;

/**
 * Représentation de recette alignée sur les propriétés consommées par React.
 */
public record RecipeDTO(
        Long id,
        String titre,
        String description,
        String image,
        String emoji,
        Integer tempsPreparation,
        List<String> etapes,
        List<Long> ingredientIds,
        String auteurEmail,
        List<ReviewDTO> avis
) {
}
