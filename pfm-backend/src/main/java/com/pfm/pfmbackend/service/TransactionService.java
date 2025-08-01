package com.pfm.pfmbackend.service;

import com.pfm.pfmbackend.model.ComptBancaire;
import com.pfm.pfmbackend.model.Transaction;
import com.pfm.pfmbackend.model.Utilisateur;
import com.pfm.pfmbackend.repository.ComptBancaireRepository;
import com.pfm.pfmbackend.repository.TransactionRepository;


import com.pfm.pfmbackend.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final ComptBancaireRepository comptBancaireRepository;
    private final UtilisateurRepository utilisateurRepository;

    public TransactionService(TransactionRepository transactionRepository, ComptBancaireRepository comptBancaireRepository,UtilisateurRepository utilisateurRepository) {
        this.comptBancaireRepository = comptBancaireRepository;
        this.transactionRepository = transactionRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    public Transaction ajouterTransaction(Long compteId, Transaction transaction) {
        ComptBancaire compte = comptBancaireRepository.findById(compteId)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));
        transaction.setCompteBancaire(compte);
        return transactionRepository.save(transaction);
    }

    public List<Transaction> listerTransactions(Long compteId) {
        ComptBancaire compte = comptBancaireRepository.findById(compteId)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));
        return transactionRepository.findByCompteBancaire(compte);
    }
    public List<Transaction> listerToutesLesTransactions() {
        // Récupérer toutes les transactions
        return transactionRepository.findAll();
    }

    public List<Transaction> getMyTransactions(String email) {
        Utilisateur user = utilisateurRepository.findByEmail(email).orElseThrow();
        List<ComptBancaire> comptes = comptBancaireRepository.findByUtilisateur(user);
        return transactionRepository.findByCompteBancaireInOrderByDateDesc(comptes);
    }
    public List<Transaction> getDernieresTransactions(String email) {
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        List<ComptBancaire> comptes = comptBancaireRepository.findByUtilisateur(user);

        // Extraction des IDs
        List<Long> compteIds = comptes.stream()
                .map(ComptBancaire::getId)
                .toList();

        return transactionRepository.findTop5ByCompteIdIn(compteIds);
    }

    public Map<String, Double> getDepensesParCategorie(String email) {
        Utilisateur user = utilisateurRepository.findByEmail(email).orElseThrow();
        List<ComptBancaire> comptes = comptBancaireRepository.findByUtilisateur(user);
        List<Transaction> transactions = transactionRepository.findByCompteBancaireIn(comptes);

        return transactions.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getCategorie,
                        Collectors.summingDouble(Transaction::getMontant)
                ));
    }

    public List<Map<String, Object>> getMonthlyTransactionSummary(String email) {
        List<Object[]> results = transactionRepository.getMonthlyTotals(email);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("mois", row[0]);
            map.put("total", row[1]);
            response.add(map);
        }

        return response;
    }



}
