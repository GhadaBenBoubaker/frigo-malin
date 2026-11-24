package com.frigomalin.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

/**
 * Ingrédient sélectionnable dans le frigo et associé à plusieurs recettes.
 */
@Entity
@Table(name = "ingredients")
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String nom;

    @Column(length = 16)
    private String emoji;

    // Relation inverse : Recipe porte la table d'association recette_ingredient.
    @ManyToMany(mappedBy = "ingredients")
    private List<Recipe> recettes = new ArrayList<>();

    protected Ingredient() {
    }

    public Ingredient(String nom, String emoji) {
        this.nom = nom;
        this.emoji = emoji;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getEmoji() {
        return emoji;
    }

    public void setEmoji(String emoji) {
        this.emoji = emoji;
    }

    public List<Recipe> getRecettes() {
        return recettes;
    }
}
