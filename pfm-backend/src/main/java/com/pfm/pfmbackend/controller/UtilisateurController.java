package com.pfm.pfmbackend.controller;

import com.pfm.pfmbackend.model.Utilisateur;
import com.pfm.pfmbackend.repository.UtilisateurRepository; // Import nécessaire pour le repository
import com.pfm.pfmbackend.service.UtilisateurService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;
    private final UtilisateurRepository utilisateurRepository; // Injection du repository

    public UtilisateurController(UtilisateurService utilisateurService, UtilisateurRepository utilisateurRepository) {
        this.utilisateurService = utilisateurService;
        this.utilisateurRepository = utilisateurRepository; // Initialisation du repository
    }

    @PostMapping("/register")
    public ResponseEntity<Utilisateur> enregistrerUtilisateur(@RequestBody Utilisateur utilisateur) {
        Utilisateur newUser = utilisateurService.enregistrerUtilisateur(utilisateur);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @GetMapping("/{email}")
    public ResponseEntity<Utilisateur> getUtilisateur(@PathVariable String email) {
        return utilisateurService.trouverParEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Utilisateur>> getAllUtilisateurs() {
        return ResponseEntity.ok(utilisateurService.listerUtilisateurs());
    }

    @GetMapping("/id")
    public Optional<Long> findMaxId() {
        return utilisateurService.findMaxId();
    }

    @GetMapping("/me")
    public ResponseEntity<Utilisateur> getUserInfo(Authentication authentication) {
        String email = authentication.getName(); // récupère l'email depuis le token JWT
        return utilisateurService.trouverParEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateNomUtilisateur(@RequestBody Map<String, String> payload, Authentication authentication) {
        String email = authentication.getName(); // récupère l'email de l'authentification
        Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findByEmail(email);

        if (!utilisateurOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé");
        }

        Utilisateur utilisateur = utilisateurOpt.get();
        String nouveauNom = payload.get("nom");

        if (nouveauNom == null || nouveauNom.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Le nom ne peut pas être vide");
        }

        utilisateur.setNom(nouveauNom);
        utilisateurRepository.save(utilisateur);
        return ResponseEntity.ok().body(Map.of("message", "Nom mis à jour avec succès"));
    }
}
