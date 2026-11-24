package com.frigomalin.backend.dto;

/**
 * Données publiques d'un utilisateur; le mot de passe n'est jamais exposé.
 */
public record UserDTO(Long id, String nom, String email) {
}
