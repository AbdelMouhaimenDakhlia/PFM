package com.pfm.pfmbackend.dto;

public class RegisterRequest {
    private String nom;
    private String email;
    private String motDePasse;
    private String cli;

    // Getters & Setters
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMotDePasse() { return motDePasse; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }

    public String getCli() { return cli; }
    public void setCli(String cli) { this.cli = cli; }
}
