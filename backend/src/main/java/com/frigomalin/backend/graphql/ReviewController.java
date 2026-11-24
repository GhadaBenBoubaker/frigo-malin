package com.frigomalin.backend.graphql;

import com.frigomalin.backend.dto.ReviewDTO;
import com.frigomalin.backend.service.ReviewService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.ContextValue;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;

/**
 * Relie la mutation GraphQL "ajouterAvis" (schema.graphqls) au service des avis.
 */
@Controller
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Le nom de la méthode doit être identique à celui de la mutation : ajouterAvis
    @MutationMapping
    public ReviewDTO ajouterAvis(
            @Argument Long recetteId,
            @Argument Integer note,
            @Argument String commentaire,
            // L'email de l'utilisateur connecté (placé par AuthInterceptor)
            @ContextValue(name = "userEmail", required = false) String userEmail) {

        // Identite.exiger refuse la requête si personne n'est connecté
        return reviewService.create(recetteId, note, commentaire, Identite.exiger(userEmail));
    }
}