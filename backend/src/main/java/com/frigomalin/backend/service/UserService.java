package com.frigomalin.backend.service;

import com.frigomalin.backend.dto.LoginInput;
import com.frigomalin.backend.dto.RegisterInput;
import com.frigomalin.backend.dto.UserDTO;
import com.frigomalin.backend.exception.AccessDeniedOperationException;
import com.frigomalin.backend.exception.BusinessValidationException;
import com.frigomalin.backend.exception.DuplicateResourceException;
import com.frigomalin.backend.exception.ResourceNotFoundException;
import com.frigomalin.backend.model.User;
import com.frigomalin.backend.repository.RecipeRepository;
import com.frigomalin.backend.repository.ReviewRepository;
import com.frigomalin.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;

/**
 * Règles métier liées aux comptes et à l'authentification par mot de passe.
 */
@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            RecipeRepository recipeRepository,
            ReviewRepository reviewRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDTO> findAll() {
        return userRepository.findAll().stream().map(this::toDTO).toList();
    }

    public UserDTO findById(Long id) {
        return toDTO(requireUser(id));
    }

    public UserDTO findByEmail(String email) {
        return toDTO(requireUserByEmail(normalizeEmail(email)));
    }

    public UserDTO register(RegisterInput input) {
        if (input == null) {
            throw new BusinessValidationException("Les données d'inscription sont obligatoires.");
        }
        String nom = requiredText(input.nom(), "Le nom est obligatoire.");
        String email = normalizeEmail(input.email());
        String motDePasse = requiredText(input.motDePasse(), "Le mot de passe est obligatoire.");

        if (nom.length() > 100 || email.length() > 254) {
            throw new BusinessValidationException("Le nom ou l'email dépasse la longueur autorisée.");
        }
        if (!email.contains("@")) {
            throw new BusinessValidationException("L'adresse email n'est pas valide.");
        }
        int longueurMotDePasse = motDePasse.getBytes(StandardCharsets.UTF_8).length;
        if (motDePasse.length() < 6 || longueurMotDePasse > 72) {
            throw new BusinessValidationException(
                    "Le mot de passe doit contenir au moins 6 caractères et ne pas dépasser 72 octets UTF-8."
            );
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateResourceException("Cet email est déjà utilisé.");
        }

        User user = new User(nom, email, passwordEncoder.encode(motDePasse));
        return toDTO(userRepository.save(user));
    }

    public UserDTO login(LoginInput input) {
        if (input == null) {
            throw new BusinessValidationException("Les identifiants sont obligatoires.");
        }
        String email = normalizeEmail(input.email());
        String motDePasse = requiredText(input.motDePasse(), "Le mot de passe est obligatoire.");
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AccessDeniedOperationException("Email ou mot de passe incorrect."));

        if (!passwordEncoder.matches(motDePasse, user.getMotDePasse())) {
            throw new AccessDeniedOperationException("Email ou mot de passe incorrect.");
        }
        return toDTO(user);
    }

    public UserDTO update(Long id, String nom, String email) {
        User user = requireUser(id);
        String nouveauNom = requiredText(nom, "Le nom est obligatoire.");
        String nouvelEmail = normalizeEmail(email);

        if (nouveauNom.length() > 100 || nouvelEmail.length() > 254 || !nouvelEmail.contains("@")) {
            throw new BusinessValidationException("Le nom ou l'email n'est pas valide.");
        }
        if (userRepository.existsByEmailIgnoreCaseAndIdNot(nouvelEmail, id)) {
            throw new DuplicateResourceException("Cet email est déjà utilisé.");
        }

        user.setNom(nouveauNom);
        user.setEmail(nouvelEmail);
        return toDTO(user);
    }

    public void delete(Long id) {
        User user = requireUser(id);
        if (recipeRepository.existsByAuteur_Id(id) || reviewRepository.existsByUtilisateur_Id(id)) {
            throw new BusinessValidationException(
                    "Le compte ne peut pas être supprimé tant qu'il possède des recettes ou des avis."
            );
        }
        userRepository.delete(user);
    }

    @Transactional(readOnly = true)
    public User requireUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + id));
    }

    @Transactional(readOnly = true)
    public User requireUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable."));
    }

    public UserDTO toDTO(User user) {
        return new UserDTO(user.getId(), user.getNom(), user.getEmail());
    }

    private String normalizeEmail(String email) {
        String normalized = requiredText(email, "L'email est obligatoire.").toLowerCase(Locale.ROOT);
        if (normalized.length() > 254 || !normalized.contains("@")) {
            throw new BusinessValidationException("L'adresse email n'est pas valide.");
        }
        return normalized;
    }

    private String requiredText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new BusinessValidationException(message);
        }
        return value.trim();
    }
}
