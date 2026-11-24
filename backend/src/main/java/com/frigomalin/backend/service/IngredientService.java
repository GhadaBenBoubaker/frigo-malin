package com.frigomalin.backend.service;

import com.frigomalin.backend.dto.IngredientDTO;
import com.frigomalin.backend.exception.BusinessValidationException;
import com.frigomalin.backend.exception.DuplicateResourceException;
import com.frigomalin.backend.exception.ResourceNotFoundException;
import com.frigomalin.backend.model.Ingredient;
import com.frigomalin.backend.repository.IngredientRepository;
import com.frigomalin.backend.repository.RecipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Logique métier du catalogue d'ingrédients.
 */
@Service
@Transactional
public class IngredientService {

    private final IngredientRepository ingredientRepository;
    private final RecipeRepository recipeRepository;

    public IngredientService(IngredientRepository ingredientRepository, RecipeRepository recipeRepository) {
        this.ingredientRepository = ingredientRepository;
        this.recipeRepository = recipeRepository;
    }

    @Transactional(readOnly = true)
    public List<IngredientDTO> findAll() {
        return ingredientRepository.findAll().stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public IngredientDTO findById(Long id) {
        return toDTO(requireIngredient(id));
    }

    public IngredientDTO create(IngredientDTO input) {
        validate(input);
        String nom = input.nom().trim();
        if (ingredientRepository.existsByNomIgnoreCase(nom)) {
            throw new DuplicateResourceException("Cet ingrédient existe déjà.");
        }

        Ingredient ingredient = new Ingredient(nom, cleanEmoji(input.emoji()));
        return toDTO(ingredientRepository.save(ingredient));
    }

    public IngredientDTO update(Long id, IngredientDTO input) {
        validate(input);
        Ingredient ingredient = requireIngredient(id);
        String nom = input.nom().trim();
        if (ingredientRepository.existsByNomIgnoreCaseAndIdNot(nom, id)) {
            throw new DuplicateResourceException("Cet ingrédient existe déjà.");
        }

        ingredient.setNom(nom);
        ingredient.setEmoji(cleanEmoji(input.emoji()));
        return toDTO(ingredient);
    }

    public void delete(Long id) {
        Ingredient ingredient = requireIngredient(id);
        if (recipeRepository.existsByIngredients_Id(id)) {
            throw new BusinessValidationException("Cet ingrédient est encore utilisé par une recette.");
        }
        ingredientRepository.delete(ingredient);
    }

    @Transactional(readOnly = true)
    public Ingredient requireIngredient(Long id) {
        return ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingrédient introuvable : " + id));
    }

    public IngredientDTO toDTO(Ingredient ingredient) {
        return new IngredientDTO(ingredient.getId(), ingredient.getNom(), ingredient.getEmoji());
    }

    private void validate(IngredientDTO input) {
        if (input == null || input.nom() == null || input.nom().isBlank()) {
            throw new BusinessValidationException("Le nom de l'ingrédient est obligatoire.");
        }
        if (input.nom().trim().length() > 120 || (input.emoji() != null && input.emoji().length() > 16)) {
            throw new BusinessValidationException("Le nom ou l'emoji dépasse la longueur autorisée.");
        }
    }

    private String cleanEmoji(String emoji) {
        return emoji == null || emoji.isBlank() ? null : emoji.trim();
    }
}
