package com.pfm.pfmbackend.controller;

import com.pfm.pfmbackend.model.ComptBancaire;
import com.pfm.pfmbackend.service.ComptBancaireService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comptes")

public class ComptBancaireController {

    private final ComptBancaireService comptBancaireService;

    public ComptBancaireController(ComptBancaireService comptBancaireService) {
        this.comptBancaireService = comptBancaireService;
    }


    @PostMapping("/{utilisateurId}")
    public ResponseEntity<ComptBancaire> ajouterCompte(@PathVariable Long utilisateurId, @RequestBody ComptBancaire compte) {
        ComptBancaire newCompte = comptBancaireService.ajouterCompte(utilisateurId, compte);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCompte);
    }

    @GetMapping("/{utilisateurId}")
    public ResponseEntity<List<ComptBancaire>> getComptes(@PathVariable Long utilisateurId) {
        return ResponseEntity.ok(comptBancaireService.listerComptes(utilisateurId));
    }

    @GetMapping
    public ResponseEntity<List<ComptBancaire>> getTousLesComptes() {
        // Appeler le service pour récupérer tous les comptes bancaires
        List<ComptBancaire> comptes = comptBancaireService.listerTousLesComptes();
        return ResponseEntity.ok(comptes);
    }

    @GetMapping("/id")
    public Optional<Long> findMaxId() {
        return comptBancaireService.findMaxId();
    }


    @GetMapping("/me")
    public ResponseEntity<List<ComptBancaire>> getMesComptes(Authentication authentication) {
        String email = authentication.getName();
        List<ComptBancaire> comptes = comptBancaireService.listerComptesParEmail(email);
        return ResponseEntity.ok(comptes);
    }

    @GetMapping("/solde/total")
    public ResponseEntity<Double> getSoldeTotal(Authentication authentication) {
        String email = authentication.getName();
        double total = comptBancaireService.calculerSoldeTotal(email);
        return ResponseEntity.ok(total);
    }



}
