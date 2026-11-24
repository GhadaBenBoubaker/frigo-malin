package com.frigomalin.backend.service;

import com.frigomalin.backend.dto.ReviewDTO;
import com.frigomalin.backend.exception.AccessDeniedOperationException;
import com.frigomalin.backend.exception.BusinessValidationException;
import com.frigomalin.backend.exception.ResourceNotFoundException;
import com.frigomalin.backend.model.Recipe;
import com.frigomalin.backend.model.Review;
import com.frigomalin.backend.model.User;
import com.frigomalin.backend.repository.RecipeRepository;
import com.frigomalin.backend.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

/**
 * Création et gestion des avis; les avis historiques sans auteur ne sont pas modifiables.
 */
@Service
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RecipeRepository recipeRepository;
    private final UserService userService;

    public ReviewService(
            ReviewRepository reviewRepository,
            RecipeRepository recipeRepository,
            UserService userService
    ) {
        this.reviewRepository = reviewRepository;
        this.recipeRepository = recipeRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<ReviewDTO> findByRecipeId(Long recipeId) {
        if (!recipeRepository.existsById(recipeId)) {
            throw new ResourceNotFoundException("Recette introuvable : " + recipeId);
        }
        return reviewRepository.findAllByRecette_IdOrderByIdDesc(recipeId)
                .stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public ReviewDTO findById(Long id) {
        return toDTO(requireReview(id));
    }

    public ReviewDTO create(Long recipeId, Integer note, String commentaire, String utilisateurEmail) {
        validate(note, commentaire);
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Recette introuvable : " + recipeId));
        User user = userService.requireUserByEmail(normalizeEmail(utilisateurEmail));

        Review review = new Review(note, commentaire.trim(), user, recipe);
        recipe.getAvis().add(review);
        return toDTO(reviewRepository.save(review));
    }

    public ReviewDTO update(Long id, Integer note, String commentaire, String utilisateurEmail) {
        validate(note, commentaire);
        Review review = requireReview(id);
        verifyOwner(review, utilisateurEmail);

        review.setNote(note);
        review.setCommentaire(commentaire.trim());
        return toDTO(review);
    }

    public void delete(Long id, String utilisateurEmail) {
        Review review = requireReview(id);
        verifyOwner(review, utilisateurEmail);
        review.getRecette().getAvis().remove(review);
        reviewRepository.delete(review);
    }

    public ReviewDTO toDTO(Review review) {
        return new ReviewDTO(
                review.getId(),
                review.getNote(),
                review.getCommentaire(),
                review.getUtilisateur() == null ? null : userService.toDTO(review.getUtilisateur()),
                review.getRecette().getId()
        );
    }

    private Review requireReview(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Avis introuvable : " + id));
    }

    private void verifyOwner(Review review, String email) {
        if (review.getUtilisateur() == null
                || !review.getUtilisateur().getEmail().equalsIgnoreCase(normalizeEmail(email))) {
            throw new AccessDeniedOperationException("Seul l'auteur de l'avis peut le modifier ou le supprimer.");
        }
    }

    private void validate(Integer note, String commentaire) {
        if (note == null || note < 1 || note > 5) {
            throw new BusinessValidationException("La note doit être comprise entre 1 et 5.");
        }
        if (commentaire == null || commentaire.isBlank() || commentaire.trim().length() > 2000) {
            throw new BusinessValidationException("Le commentaire est obligatoire et limité à 2000 caractères.");
        }
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new BusinessValidationException("L'identité de l'utilisateur est obligatoire.");
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
