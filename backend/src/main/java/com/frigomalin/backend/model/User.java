package com.frigomalin.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

/**
 * Utilisateur de l'application. Le mot de passe persisté est toujours un hash BCrypt.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, unique = true, length = 254)
    private String email;

    @Column(nullable = false, length = 100)
    private String motDePasse;

    // Un utilisateur peut publier plusieurs recettes; le côté propriétaire est Recipe.auteur.
    @OneToMany(mappedBy = "auteur")
    private List<Recipe> recettes = new ArrayList<>();

    // Un utilisateur peut écrire plusieurs avis; le côté propriétaire est Review.utilisateur.
    @OneToMany(mappedBy = "utilisateur")
    private List<Review> avis = new ArrayList<>();

    protected User() {
    }

    public User(String nom, String email, String motDePasse) {
        this.nom = nom;
        this.email = email;
        this.motDePasse = motDePasse;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public List<Recipe> getRecettes() {
        return recettes;
    }

    public List<Review> getAvis() {
        return avis;
    }
}
