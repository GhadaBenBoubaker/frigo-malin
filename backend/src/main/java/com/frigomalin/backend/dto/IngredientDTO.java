package com.frigomalin.backend.dto;

/**
 * Forme d'un ingrédient destinée aux requêtes de l'interface.
 */
public record IngredientDTO(Long id, String nom, String emoji) {
}
