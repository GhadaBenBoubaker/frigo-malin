package com.frigomalin.backend.repository;

import com.frigomalin.backend.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    List<Recipe> findAllByAuteur_EmailIgnoreCaseOrderByIdDesc(String email);

    boolean existsByAuteur_Id(Long auteurId);

    boolean existsByIngredients_Id(Long ingredientId);
}
