package com.pfm.pfmbackend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;


@Entity
@Table(name = "TRANSACTION")
@Data
public class Transaction {
    @Id
    @SequenceGenerator(name = "transaction_seq", sequenceName = "TRANSACTION_SEQ", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "transaction_seq")
    private Long id;


    @Column(name = "MONTANT")
    private Double montant;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "DATE_TRANS")
    private LocalDate date;

    @Column(name = "PRODUIT")
    private String produit;

    @Column(name = "TYPE")
    private String type; // "Crédit" ou "Débit"

    @Column(name = "CATEGORIE_TRANSACTION")
    private String categorie;

    @ManyToOne
    @JoinColumn(name = "compt_id", nullable = false)
    private ComptBancaire compteBancaire;


    public Transaction() {}

    public Transaction(Double montant, String description,String produit, LocalDate date, String type, String categorie, ComptBancaire compteBancaire) {
        this.montant = montant;
        this.description = description;
        this.date = date;
        this.type = type;
        this.produit = produit;
        this.categorie = categorie;
        this.compteBancaire = compteBancaire;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getMontant() {
        return montant;
    }

    public void setMontant(Double montant) {
        this.montant = montant;
    }

    public String getProduit() {return produit;}

    public void setProduit(String produit) {
        this.produit = produit;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public ComptBancaire getCompteBancaire() {
        return compteBancaire;
    }

    public void setCompteBancaire(ComptBancaire compteBancaire) {
        this.compteBancaire = compteBancaire;
    }
}
