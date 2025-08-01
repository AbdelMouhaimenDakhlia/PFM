package com.pfm.pfmbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "COMPT_BANCAIRE")
public class ComptBancaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String iban;

    @Column(nullable = false)
    private Double solde;

    @Column(nullable = false)
    private String devise;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Utilisateur utilisateur;


    private String dateOuverture;


    @OneToMany(mappedBy = "compteBancaire", cascade = CascadeType.ALL)
    private List<Transaction> transactions;


    // Constructeur sans arguments
    public ComptBancaire() {}

    // Constructeur avec arguments
    public ComptBancaire(Long id, String iban, Double solde, String devise, Utilisateur utilisateur, String dateOuverture, List<Transaction> transactions) {
        this.id = id;
        this.iban = iban;
        this.solde = solde;
        this.devise = devise;
        this.utilisateur = utilisateur;
        this.dateOuverture = dateOuverture;

        this.transactions = transactions;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }

    public Double getSolde() {
        return solde;
    }

    public void setSolde(Double solde) {
        this.solde = solde;
    }

    public String getDevise() {
        return devise;
    }

    public void setDevise(String devise) {
        this.devise = devise;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public String getDateOuverture() {
        return dateOuverture;
    }

    public void setDateOuverture(String dateOuverture) {
        this.dateOuverture = dateOuverture;
    }







}
