package com.pfm.pfmbackend.service;


import com.pfm.pfmbackend.model.IAResult;
import com.pfm.pfmbackend.model.Transaction;
import com.pfm.pfmbackend.repository.IAResultRepository;
import com.pfm.pfmbackend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IAResultService {

    private final IAResultRepository iaResultRepository;
    private final TransactionRepository transactionRepository;

    public IAResultService(TransactionRepository transactionRepository, IAResultRepository iaResultRepository) {
        this.iaResultRepository = iaResultRepository;
        this.transactionRepository = transactionRepository;
    }

    public IAResult ajouterResultat(Long transactionId, IAResult iaResult) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction introuvable"));
        iaResult.setTransaction(transaction);
        return iaResultRepository.save(iaResult);
    }

    public List<IAResult> listerResultats(String categorie) {
        return iaResultRepository.findByCategoriePredite(categorie);
    }
}
