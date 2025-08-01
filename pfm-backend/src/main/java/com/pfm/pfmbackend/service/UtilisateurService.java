package com.pfm.pfmbackend.service;

import com.pfm.pfmbackend.model.Utilisateur;
import com.pfm.pfmbackend.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;

    }

    public Utilisateur enregistrerUtilisateur(Utilisateur utilisateur) {
        // Supprimer l'encodage du mot de passe pour le moment
        // utilisateur.setMotDePasse(passwordEncoder.encode(utilisateur.getMotDePasse()));
        return utilisateurRepository.save(utilisateur);
    }

    public Optional<Utilisateur> trouverParEmail(String email) {
        return utilisateurRepository.findByEmail(email);
    }

    public List<Utilisateur> listerUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    public Optional<Long> findMaxId() {
        return utilisateurRepository.findMaxId();
    }
}
