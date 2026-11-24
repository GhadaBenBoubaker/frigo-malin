package com.frigomalin.backend.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;

/**
 * Recette et relations vers son auteur, ses ingrédients, ses étapes et ses avis.
 */
@Entity
@Table(name = "recipes")
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String titre;

    @Column(length = 2000)
    private String description;

    // Les recettes personnelles peuvent contenir une data-URI JPEG réduite par le frontend.
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    @Column(columnDefinition = "LONGTEXT")
    private String image;

    @Column(length = 16)
    private String emoji;

    @Column(nullable = false)
    private Integer tempsPreparation;

    // @ElementCollection conserve l'ordre des étapes sans créer une entité supplémentaire.
    @ElementCollection
    @CollectionTable(name = "recipe_steps", joinColumns = @JoinColumn(name = "recipe_id"))
    @OrderColumn(name = "step_order")
    @Column(name = "step_text", nullable = false, length = 1000)
    private List<String> etapes = new ArrayList<>();

    // Une recette possède plusieurs ingrédients et un ingrédient peut servir à plusieurs recettes.
    @ManyToMany
    @JoinTable(
            name = "recipe_ingredient",
            joinColumns = @JoinColumn(name = "recipe_id"),
            inverseJoinColumns = @JoinColumn(name = "ingredient_id")
    )
    @OrderColumn(name = "ingredient_order")
    private List<Ingredient> ingredients = new ArrayList<>();

    // Les recettes de démonstration n'ont pas d'auteur dans le frontend d'origine.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User auteur;

    // Les avis appartiennent à cette recette; cascade supprime ses avis en même temps qu'elle.
    @OneToMany(mappedBy = "recette", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Review> avis = new ArrayList<>();

    protected Recipe() {
    }

    public Recipe(String titre, String description, String image, String emoji, Integer tempsPreparation) {
        this.titre = titre;
        this.description = description;
        this.image = image;
        this.emoji = emoji;
        this.tempsPreparation = tempsPreparation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getEmoji() {
        return emoji;
    }

    public void setEmoji(String emoji) {
        this.emoji = emoji;
    }

    public Integer getTempsPreparation() {
        return tempsPreparation;
    }

    public void setTempsPreparation(Integer tempsPreparation) {
        this.tempsPreparation = tempsPreparation;
    }

    public List<String> getEtapes() {
        return etapes;
    }

    public void setEtapes(List<String> etapes) {
        this.etapes = etapes;
    }

    public List<Ingredient> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<Ingredient> ingredients) {
        this.ingredients = ingredients;
    }

    public User getAuteur() {
        return auteur;
    }

    public void setAuteur(User auteur) {
        this.auteur = auteur;
    }

    public List<Review> getAvis() {
        return avis;
    }
}
