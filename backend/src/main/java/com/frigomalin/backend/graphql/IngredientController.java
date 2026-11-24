package com.frigomalin.backend.graphql;

import com.frigomalin.backend.dto.IngredientDTO;
import com.frigomalin.backend.service.IngredientService;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class IngredientController {

    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @QueryMapping
    public List<IngredientDTO> ingredients() {
        return ingredientService.findAll();
    }
}