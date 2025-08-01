package com.pfm.pfmbackend.controller;

import com.pfm.pfmbackend.model.Transaction;
import com.pfm.pfmbackend.service.TransactionService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/{compteId}")
    public ResponseEntity<Transaction> ajouterTransaction(
            @PathVariable Long compteId, @RequestBody Transaction transaction) {
        Transaction newTransaction = transactionService.ajouterTransaction(compteId, transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(newTransaction);
    }

    @GetMapping("/{compteId}")
    public ResponseEntity<List<Transaction>> getTransactions(@PathVariable Long compteId) {
        return ResponseEntity.ok(transactionService.listerTransactions(compteId));
    }
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        // Appeler le service pour récupérer toutes les transactions
        List<Transaction> transactions = transactionService.listerToutesLesTransactions();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/recentes")
    public ResponseEntity<List<Transaction>> getDernieresTransactions(Authentication authentication) {
        String email = authentication.getName();
        List<Transaction> transactions = transactionService.getDernieresTransactions(email);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDepensesParCategorie(Authentication authentication) {
        String email = authentication.getName();
        var stats = transactionService.getDepensesParCategorie(email);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyTransactions(Authentication authentication) {
        String email = authentication.getName(); // ou un champ dans ton principal
        return ResponseEntity.ok(transactionService.getMonthlyTransactionSummary(email));
    }

    @GetMapping("/me")
    public ResponseEntity<List<Transaction>> getMyTransactions(Authentication authentication) {
        String email = authentication.getName();
        List<Transaction> transactions = transactionService.getMyTransactions(email);
        return ResponseEntity.ok(transactions);
    }





}
