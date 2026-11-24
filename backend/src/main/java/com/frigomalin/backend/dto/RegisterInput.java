package com.frigomalin.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Entrée d'inscription réutilisable par le futur resolver GraphQL.
 */
public record RegisterInput(
        @NotBlank @Size(max = 100) String nom,
        @NotBlank @Email @Size(max = 254) String email,
        @NotBlank @Size(min = 6, max = 72) String motDePasse
) {
}
