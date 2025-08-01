package com.pfm.pfmbackend.controller;


import com.pfm.pfmbackend.model.IAResult;
import com.pfm.pfmbackend.service.IAResultService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ia-results")
public class IAResultController {

    private final IAResultService iaResultService;

    public IAResultController(IAResultService iaResultService) {
        this.iaResultService = iaResultService;
    }

    @PostMapping("/{transactionId}")
    public ResponseEntity<IAResult> ajouterResultat(
            @PathVariable Long transactionId, @RequestBody IAResult iaResult) {
        IAResult newIAResult = iaResultService.ajouterResultat(transactionId, iaResult);
        return ResponseEntity.status(HttpStatus.CREATED).body(newIAResult);
    }

    @GetMapping("/{categorie}")
    public ResponseEntity<List<IAResult>> getResultats(@PathVariable String categorie) {
        return ResponseEntity.ok(iaResultService.listerResultats(categorie));
    }
}
