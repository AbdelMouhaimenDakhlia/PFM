package com.pfm.pfmbackend.batch.dto;

import lombok.Data;

@Data
public class TransactionCsvDTO {
    private String bhLib;   // libellé (ex: Salaire)
    private String dco;     // date opération (ex: 2024-12-01)
    private Double mon;     // montant (ex: 2500.00)
    private String sen;     // type (c credite ,d debit)
    private String iban;    // compte (ex: TN5900...)
    private String produit;



    private String categorie;  // prédite par l'API

    // GETTERS & SETTERS
    public String getBhLib() { return bhLib; }
    public void setBhLib(String bhLib) { this.bhLib = bhLib; }

    public String getProduit() {
        return produit;
    }

    public void setProduit(String produit) {
        this.produit = produit;
    }

    public String getDco() { return dco; }
    public void setDco(String dco) { this.dco = dco; }

    public Double getMon() { return mon; }
    public void setMon(Double mon) { this.mon = mon; }

    public String getSen() { return sen; }
    public void setSen(String sen) { this.sen = sen; }

    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }

    public String getCategorie() { return categorie; }
    public void setCategorie(String categorie) { this.categorie = categorie; }
}

