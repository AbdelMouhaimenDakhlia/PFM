package com.pfm.pfmbackend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "UTILISATEUR")
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String motDePasse;

    @Column(unique = true)
    private String cli;


    @OneToMany(mappedBy = "utilisateur", cascade = CascadeType.ALL)
    private List<ComptBancaire> comptes;

    public Utilisateur() {}

    // Constructeur sans id (utilisé pour les insertions)
    public Utilisateur(String nom, String email, String motDePasse, String cli) {
        this.nom = nom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.cli = cli;
    }

    // Constructeur avec tous les champs
    public Utilisateur(Long id, String nom, String email, String motDePasse, String cli) {
        this.id = id;
        this.nom = nom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.cli = cli;

    }


    // Getters et Setters
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

    public String getCli() {
        return cli;
    }

    public void setCli(String cli) {
        this.cli = cli;
    }

}
