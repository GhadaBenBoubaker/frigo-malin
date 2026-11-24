package com.frigomalin.backend.dto;

/**
 * Avis sans référence JPA, afin de ne pas créer de sérialisation circulaire.
 */
public record ReviewDTO(
        Long id,
        Integer note,
        String commentaire,
        UserDTO utilisateur,
        Long recetteId
) {
}
