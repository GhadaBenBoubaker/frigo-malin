package com.frigomalin.backend.config;

import com.frigomalin.backend.model.Ingredient;
import com.frigomalin.backend.model.Recipe;
import com.frigomalin.backend.repository.IngredientRepository;
import com.frigomalin.backend.repository.RecipeRepository;
import com.frigomalin.backend.repository.ReviewRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Charge les ingrédients, recettes et avis du frontend sans doublonner ni écraser les données existantes.
 */
@Component
public class DemoDataInitializer implements ApplicationRunner {

    private final IngredientRepository ingredientRepository;
    private final RecipeRepository recipeRepository;
    private final ReviewRepository reviewRepository;
    private final JdbcTemplate jdbcTemplate;

    public DemoDataInitializer(
            IngredientRepository ingredientRepository,
            RecipeRepository recipeRepository,
            ReviewRepository reviewRepository,
            JdbcTemplate jdbcTemplate
    ) {
        this.ingredientRepository = ingredientRepository;
        this.recipeRepository = recipeRepository;
        this.reviewRepository = reviewRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        Map<Long, Ingredient> ingredients = loadIngredients();
        Map<Long, Recipe> recipes = loadRecipes(ingredients);
        loadReviews(recipes);
    }

    private Map<Long, Ingredient> loadIngredients() {
        List<SeedIngredient> seeds = List.of(
                new SeedIngredient(1L, "Œufs", "🥚"),
                new SeedIngredient(2L, "Tomates", "🍅"),
                new SeedIngredient(3L, "Riz", "🍚"),
                new SeedIngredient(4L, "Fromage", "🧀"),
                new SeedIngredient(5L, "Pommes de terre", "🥔"),
                new SeedIngredient(6L, "Oignons", "🧅"),
                new SeedIngredient(7L, "Thon", "🐟"),
                new SeedIngredient(8L, "Lentilles", "🫘"),
                new SeedIngredient(9L, "Pâtes", "🍝"),
                new SeedIngredient(10L, "Carottes", "🥕"),
                new SeedIngredient(11L, "Poulet", "🍗"),
                new SeedIngredient(12L, "Laitue", "🥬")
        );
        Map<Long, Ingredient> result = new LinkedHashMap<>();
        for (SeedIngredient seed : seeds) {
            if (!exists("ingredients", seed.id())) {
                jdbcTemplate.update(
                        "INSERT INTO ingredients (id, nom, emoji) VALUES (?, ?, ?)",
                        seed.id(), seed.nom(), seed.emoji()
                );
            }
            Ingredient ingredient = ingredientRepository.findById(seed.id())
                    .orElseThrow(() -> new IllegalStateException("Échec du chargement d'un ingrédient initial."));
            result.put(seed.id(), ingredient);
        }
        return result;
    }

    private Map<Long, Recipe> loadRecipes(Map<Long, Ingredient> ingredients) {
        List<SeedRecipe> seeds = List.of(
                new SeedRecipe(1L, "Omelette aux tomates", "Une omelette moelleuse, prête en un clin d'œil.",
                        "/images/recettes/omelette.png", "🍳", 10, List.of(1L, 2L, 6L),
                        List.of("Coupez les oignons et les tomates en petits morceaux.",
                                "Faites-les revenir 3 minutes dans une poêle.",
                                "Battez les œufs, versez-les sur les légumes.",
                                "Laissez cuire 3 minutes, pliez et servez.")),
                new SeedRecipe(2L, "Riz sauté aux œufs", "Le plat parfait pour finir les restes de riz.",
                        "/images/recettes/riz-aux-oeufs.png", "🍚", 15, List.of(3L, 1L, 6L, 10L),
                        List.of("Faites cuire le riz si besoin.",
                                "Faites revenir oignons et carottes coupés finement.",
                                "Ajoutez le riz, puis les œufs battus.",
                                "Mélangez jusqu'à ce que les œufs soient cuits.")),
                new SeedRecipe(3L, "Salade de thon", "Fraîche, légère et sans cuisson.",
                        "/images/recettes/salade_thon.png", "🥗", 5, List.of(7L, 2L, 12L),
                        List.of("Lavez et découpez la laitue et les tomates.",
                                "Ajoutez le thon égoutté.",
                                "Assaisonnez avec huile, citron et sel.")),
                new SeedRecipe(4L, "Soupe de lentilles", "Une soupe réconfortante pour les jours frais.",
                        "/images/recettes/Soupe_de_lentilles.png", "🍲", 35, List.of(8L, 6L, 10L, 5L),
                        List.of("Épluchez et coupez tous les légumes.",
                                "Mettez-les dans une casserole avec les lentilles.",
                                "Couvrez d'eau et laissez cuire 30 minutes.",
                                "Mixez si vous aimez une soupe lisse.")),
                new SeedRecipe(5L, "Pâtes au fromage", "Le classique qui sauve tous les soirs.",
                        "/images/recettes/pates-fromage.png", "🍝", 15, List.of(9L, 4L),
                        List.of("Faites cuire les pâtes dans l'eau salée.",
                                "Égouttez, puis ajoutez le fromage râpé.",
                                "Mélangez jusqu'à ce qu'il fonde.")),
                new SeedRecipe(6L, "Gratin de pommes de terre", "Doré et fondant, idéal à partager.",
                        "/images/recettes/Gratin_de_pommes_de_terre.png", "🥘", 40, List.of(5L, 4L, 6L),
                        List.of("Coupez les pommes de terre en rondelles.",
                                "Disposez-les dans un plat avec les oignons.",
                                "Couvrez de fromage râpé.",
                                "Enfournez 30 minutes à 180 °C."))
        );
        Map<Long, Recipe> result = new LinkedHashMap<>();
        for (SeedRecipe seed : seeds) {
            if (!exists("recipes", seed.id())) {
                jdbcTemplate.update(
                        """
                        INSERT INTO recipes
                            (id, titre, description, image, emoji, temps_preparation, author_id)
                        VALUES (?, ?, ?, ?, ?, ?, NULL)
                        """,
                        seed.id(), seed.titre(), seed.description(), seed.image(), seed.emoji(),
                        seed.tempsPreparation()
                );
            }
            for (int index = 0; index < seed.etapes().size(); index++) {
                if (!existsStep(seed.id(), index)) {
                    jdbcTemplate.update(
                            "INSERT INTO recipe_steps (recipe_id, step_order, step_text) VALUES (?, ?, ?)",
                            seed.id(), index, seed.etapes().get(index)
                    );
                }
            }
            for (int index = 0; index < seed.ingredientIds().size(); index++) {
                Long ingredientId = seed.ingredientIds().get(index);
                if (!ingredients.containsKey(ingredientId)) {
                    throw new IllegalStateException("Un ingrédient de démonstration est introuvable : " + ingredientId);
                }
                if (!existsAssociation(seed.id(), ingredientId)) {
                    jdbcTemplate.update(
                            "INSERT INTO recipe_ingredient (recipe_id, ingredient_id, ingredient_order) VALUES (?, ?, ?)",
                            seed.id(), ingredientId, index
                    );
                }
            }
            Recipe recipe = recipeRepository.findById(seed.id())
                    .orElseThrow(() -> new IllegalStateException("Échec du chargement d'une recette initiale."));
            result.put(seed.id(), recipe);
        }
        return result;
    }

    private void loadReviews(Map<Long, Recipe> recipes) {
        List<SeedReview> seeds = List.of(
                new SeedReview(1L, 1L, 5, "Simple et délicieux !"),
                new SeedReview(2L, 2L, 4, "Très rapide."),
                new SeedReview(3L, 2L, 5, "Mon plat préféré du soir."),
                new SeedReview(4L, 4L, 5, "Parfaite en hiver.")
        );
        for (SeedReview seed : seeds) {
            if (!exists("reviews", seed.id())) {
                jdbcTemplate.update(
                        """
                        INSERT INTO reviews (id, note, commentaire, user_id, recipe_id)
                        VALUES (?, ?, ?, NULL, ?)
                        """,
                        seed.id(), seed.note(), seed.commentaire(), seed.recipeId()
                );
            }
            if (!recipes.containsKey(seed.recipeId()) || !reviewRepository.existsById(seed.id())) {
                throw new IllegalStateException("Échec du chargement d'un avis initial : " + seed.id());
            }
        }
    }

    private boolean exists(String table, Long id) {
        return jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM " + table + " WHERE id = ?",
                Integer.class,
                id
        ) > 0;
    }

    private boolean existsStep(Long recipeId, int order) {
        return jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM recipe_steps WHERE recipe_id = ? AND step_order = ?",
                Integer.class,
                recipeId,
                order
        ) > 0;
    }

    private boolean existsAssociation(Long recipeId, Long ingredientId) {
        return jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM recipe_ingredient WHERE recipe_id = ? AND ingredient_id = ?",
                Integer.class,
                recipeId,
                ingredientId
        ) > 0;
    }

    private record SeedIngredient(Long id, String nom, String emoji) {
    }

    private record SeedRecipe(
            Long id,
            String titre,
            String description,
            String image,
            String emoji,
            Integer tempsPreparation,
            List<Long> ingredientIds,
            List<String> etapes
    ) {
    }

    private record SeedReview(Long id, Long recipeId, Integer note, String commentaire) {
    }
}
