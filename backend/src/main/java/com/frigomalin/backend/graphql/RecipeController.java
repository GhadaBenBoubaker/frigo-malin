package com.frigomalin.backend.graphql;

import com.frigomalin.backend.dto.RecipeDTO;
import com.frigomalin.backend.service.RecipeService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.ContextValue;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @QueryMapping
    public List<RecipeDTO> recettes() {
        return recipeService.findAll();
    }

    @QueryMapping
    public RecipeDTO recetteParId(@Argument Long id) {
        return recipeService.findById(id);
    }

    @QueryMapping
    public List<RecipeDTO> mesRecettes(@ContextValue(name = "userEmail", required = false) String userEmail) {
        return recipeService.findByAuthorEmail(Identite.exiger(userEmail));
    }

    @MutationMapping
    public RecipeDTO ajouterRecette(
            @Argument RecetteInput input,
            @ContextValue(name = "userEmail", required = false) String userEmail) {
        return recipeService.create(input.toDTO(), Identite.exiger(userEmail));
    }

    @MutationMapping
    public RecipeDTO modifierRecette(
            @Argument Long id,
            @Argument RecetteInput input,
            @ContextValue(name = "userEmail", required = false) String userEmail) {
        return recipeService.update(id, input.toDTO(), Identite.exiger(userEmail));
    }

    @MutationMapping
    public boolean supprimerRecette(
            @Argument Long id,
            @ContextValue(name = "userEmail", required = false) String userEmail) {
        recipeService.delete(id, Identite.exiger(userEmail));
        return true;
    }
}