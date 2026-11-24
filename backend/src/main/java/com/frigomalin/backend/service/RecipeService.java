package com.frigomalin.backend.service;

import com.frigomalin.backend.dto.RecipeDTO;
import com.frigomalin.backend.exception.AccessDeniedOperationException;
import com.frigomalin.backend.exception.BusinessValidationException;
import com.frigomalin.backend.exception.ResourceNotFoundException;
import com.frigomalin.backend.model.Ingredient;
import com.frigomalin.backend.model.Recipe;
import com.frigomalin.backend.model.User;
import com.frigomalin.backend.repository.IngredientRepository;
import com.frigomalin.backend.repository.RecipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;

/**
 * Règles métier des recettes, y compris les contrôles d'appartenance.
 */
@Service
@Transactional
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;
    private final UserService userService;
    private final ReviewService reviewService;

    public RecipeService(
            RecipeRepository recipeRepository,
            IngredientRepository ingredientRepository,
            UserService userService,
            ReviewService reviewService
    ) {
        this.recipeRepository = recipeRepository;
        this.ingredientRepository = ingredientRepository;
        this.userService = userService;
        this.reviewService = reviewService;
    }

    @Transactional(readOnly = true)
    public List<RecipeDTO> findAll() {
        return recipeRepository.findAll().stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public RecipeDTO findById(Long id) {
        return toDTO(requireRecipe(id));
    }

    @Transactional(readOnly = true)
    public List<RecipeDTO> findByAuthorEmail(String email) {
        String normalizedEmail = normalizeEmail(email);
        return recipeRepository.findAllByAuteur_EmailIgnoreCaseOrderByIdDesc(normalizedEmail)
                .stream().map(this::toDTO).toList();
    }

    public RecipeDTO create(RecipeDTO input, String auteurEmail) {
        validate(input);
        User auteur = userService.requireUserByEmail(normalizeEmail(auteurEmail));
        Recipe recipe = new Recipe(
                input.titre().trim(),
                cleanDescription(input.description()),
                input.image(),
                cleanEmoji(input.emoji()),
                input.tempsPreparation()
        );
        recipe.setEtapes(cleanSteps(input.etapes()));
        recipe.setIngredients(loadIngredients(input.ingredientIds()));
        recipe.setAuteur(auteur);
        return toDTO(recipeRepository.save(recipe));
    }

    public RecipeDTO update(Long id, RecipeDTO input, String auteurEmail) {
        validate(input);
        Recipe recipe = requireRecipe(id);
        verifyOwner(recipe, auteurEmail);

        recipe.setTitre(input.titre().trim());
        recipe.setDescription(cleanDescription(input.description()));
        recipe.setImage(input.image());
        recipe.setEmoji(cleanEmoji(input.emoji()));
        recipe.setTempsPreparation(input.tempsPreparation());
        recipe.setEtapes(cleanSteps(input.etapes()));
        recipe.setIngredients(loadIngredients(input.ingredientIds()));
        return toDTO(recipe);
    }

    public void delete(Long id, String auteurEmail) {
        Recipe recipe = requireRecipe(id);
        verifyOwner(recipe, auteurEmail);
        recipeRepository.delete(recipe);
    }

    public RecipeDTO toDTO(Recipe recipe) {
        return new RecipeDTO(
                recipe.getId(),
                recipe.getTitre(),
                recipe.getDescription(),
                recipe.getImage(),
                recipe.getEmoji(),
                recipe.getTempsPreparation(),
                List.copyOf(recipe.getEtapes()),
                recipe.getIngredients().stream().map(Ingredient::getId).toList(),
                recipe.getAuteur() == null ? null : recipe.getAuteur().getEmail(),
                recipe.getAvis().stream().map(reviewService::toDTO).toList()
        );
    }

    private Recipe requireRecipe(Long id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recette introuvable : " + id));
    }

    private void verifyOwner(Recipe recipe, String email) {
        if (recipe.getAuteur() == null
                || !recipe.getAuteur().getEmail().equalsIgnoreCase(normalizeEmail(email))) {
            throw new AccessDeniedOperationException("Seul l'auteur de la recette peut la modifier ou la supprimer.");
        }
    }

    private List<Ingredient> loadIngredients(List<Long> ingredientIds) {
        if (ingredientIds == null || ingredientIds.isEmpty()) {
            throw new BusinessValidationException("Choisissez au moins un ingrédient.");
        }
        LinkedHashSet<Long> ids = new LinkedHashSet<>(ingredientIds);
        if (ids.contains(null)) {
            throw new BusinessValidationException("Un identifiant d'ingrédient est invalide.");
        }

        List<Ingredient> ingredients = new ArrayList<>();
        for (Long id : ids) {
            ingredients.add(ingredientRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Ingrédient introuvable : " + id
                    )));
        }
        return ingredients;
    }

    private void validate(RecipeDTO input) {
        if (input == null || input.titre() == null || input.titre().isBlank()) {
            throw new BusinessValidationException("Le titre de la recette est obligatoire.");
        }
        if (input.titre().trim().length() > 160) {
            throw new BusinessValidationException("Le titre est limité à 160 caractères.");
        }
        if (input.description() != null && input.description().length() > 2000) {
            throw new BusinessValidationException("La description est limitée à 2000 caractères.");
        }
        if (input.tempsPreparation() == null || input.tempsPreparation() < 1) {
            throw new BusinessValidationException("Le temps de préparation doit être supérieur à zéro.");
        }
        if (input.etapes() == null || input.etapes().isEmpty()
                || input.etapes().stream().anyMatch(etape -> etape == null || etape.isBlank()
                || etape.trim().length() > 1000)) {
            throw new BusinessValidationException("Ajoutez des étapes valides (1000 caractères maximum chacune).");
        }
    }

    private List<String> cleanSteps(List<String> steps) {
        return new ArrayList<>(steps.stream().map(String::trim).toList());
    }

    private String cleanDescription(String description) {
        return description == null || description.isBlank() ? null : description.trim();
    }

    private String cleanEmoji(String emoji) {
        return emoji == null || emoji.isBlank() ? null : emoji.trim();
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new BusinessValidationException("L'identité de l'auteur est obligatoire.");
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
