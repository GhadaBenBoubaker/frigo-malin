package com.frigomalin.backend.graphql;

import com.frigomalin.backend.dto.ReviewDTO;
import com.frigomalin.backend.service.ReviewService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.ContextValue;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;


/*chaque méthode porte le même nom que l'opération du schéma. Elle appelle une seule méthode de service, 
sans aucune logique métier dupliquée. */
@Controller
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @MutationMapping
    public ReviewDTO ajouterAvis(
            @Argument Long recetteId,
            @Argument Integer note,
            @Argument String commentaire,
            @ContextValue(name = "userEmail", required = false) String userEmail) {
        return reviewService.create(recetteId, note, commentaire, Identite.exiger(userEmail));
    }
}