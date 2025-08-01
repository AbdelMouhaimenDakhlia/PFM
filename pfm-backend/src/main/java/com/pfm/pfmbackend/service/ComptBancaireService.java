package com.pfm.pfmbackend.service;

import com.pfm.pfmbackend.model.ComptBancaire;
import com.pfm.pfmbackend.model.Utilisateur;
import com.pfm.pfmbackend.repository.ComptBancaireRepository;
import com.pfm.pfmbackend.repository.UtilisateurRepository;


import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ComptBancaireService {

    private final ComptBancaireRepository comptBancaireRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ComptBancaireService(ComptBancaireRepository comptBancaireRepository, UtilisateurRepository utilisateurRepository) {
        this.comptBancaireRepository = comptBancaireRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    public ComptBancaire ajouterCompte(Long utilisateurId, ComptBancaire compte) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        compte.setUtilisateur(utilisateur);
        return comptBancaireRepository.save(compte);
    }

    public List<ComptBancaire> listerComptes(Long utilisateurId) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        return comptBancaireRepository.findByUtilisateur(utilisateur);
    }

    public List<ComptBancaire> listerTousLesComptes() {
        // Récupérer tous les comptes bancaires
        return comptBancaireRepository.findAll();
    }

    public Optional<Long> findMaxId() {
        return comptBancaireRepository.findMaxId();
    }


    public List<ComptBancaire> listerComptesParEmail(String email) {
        Utilisateur user = utilisateurRepository.findByEmail(email).orElseThrow();
        return comptBancaireRepository.findByUtilisateur(user);
    }

    public double calculerSoldeTotal(String email) {
        Utilisateur user = utilisateurRepository.findByEmail(email).orElseThrow();
        return comptBancaireRepository.findByUtilisateur(user)
                .stream()
                .mapToDouble(ComptBancaire::getSolde)
                .sum();
    }



}

