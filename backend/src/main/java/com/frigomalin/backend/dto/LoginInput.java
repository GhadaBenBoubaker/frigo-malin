package com.frigomalin.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Identifiants d'authentification; le mot de passe n'est jamais renvoyé en DTO.
 */
public record LoginInput(
        @NotBlank @Email String email,
        @NotBlank String motDePasse
) {
}
