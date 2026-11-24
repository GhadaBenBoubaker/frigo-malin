package com.frigomalin.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Avis d'un utilisateur sur une recette; l'auteur est facultatif uniquement pour les avis importés.
 */
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer note;

    @Column(nullable = false, length = 2000)
    private String commentaire;

    // Nullable pour préserver les avis de démonstration dont l'auteur n'est pas fourni.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User utilisateur;

    // Tout avis correspond à une recette; côté inverse, Recipe.avis évite les cycles de DTO.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recette;

    protected Review() {
    }

    public Review(Integer note, String commentaire, User utilisateur, Recipe recette) {
        this.note = note;
        this.commentaire = commentaire;
        this.utilisateur = utilisateur;
        this.recette = recette;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNote() {
        return note;
    }

    public void setNote(Integer note) {
        this.note = note;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public User getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(User utilisateur) {
        this.utilisateur = utilisateur;
    }

    public Recipe getRecette() {
        return recette;
    }

    public void setRecette(Recipe recette) {
        this.recette = recette;
    }
}
