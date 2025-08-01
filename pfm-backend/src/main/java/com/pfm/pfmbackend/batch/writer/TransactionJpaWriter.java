package com.pfm.pfmbackend.batch.writer;

import com.pfm.pfmbackend.batch.dto.TransactionCsvDTO;
import com.pfm.pfmbackend.model.ComptBancaire;
import com.pfm.pfmbackend.model.Transaction;
import com.pfm.pfmbackend.repository.ComptBancaireRepository;
import com.pfm.pfmbackend.repository.TransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Component
public class TransactionJpaWriter implements ItemWriter<TransactionCsvDTO> {

    private static final Logger logger = LoggerFactory.getLogger(TransactionJpaWriter.class);
    private final ComptBancaireRepository compteRepo;
    private final TransactionRepository transactionRepo;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public TransactionJpaWriter(ComptBancaireRepository compteRepo, TransactionRepository transactionRepo) {
        this.compteRepo = compteRepo;
        this.transactionRepo = transactionRepo;
    }

    @Override
    public void write(Chunk<? extends TransactionCsvDTO> items) {
        int success = 0;
        int failed = 0;

        for (TransactionCsvDTO dto : items) {
            Optional<ComptBancaire> compteOpt = compteRepo.findByIban(dto.getIban());

            if (compteOpt.isEmpty()) {
                logger.warn("❌ IBAN introuvable : {}", dto.getIban());
                failed++;
                continue;
            }

            ComptBancaire compte = compteOpt.get();
            LocalDate parsedDate = parseDate(dto.getDco());

            if (parsedDate == null) {
                logger.warn("❌ Date invalide pour IBAN {} : {}", dto.getIban(), dto.getDco());
                failed++;
                continue;
            }

            boolean exists = !transactionRepo.findMatchingTransaction(
                    dto.getMon(),
                    dto.getBhLib(),
                    parsedDate,
                    convertirType(dto.getSen()),
                    compte
            ).isEmpty();

            if (exists) {
                logger.info("⚠️ Transaction déjà existante (IBAN: {})", dto.getIban());
                continue;
            }

            try {
                Transaction transaction = new Transaction();
                transaction.setMontant(dto.getMon());
                transaction.setDescription(dto.getBhLib());
                transaction.setType(convertirType(dto.getSen()));
                transaction.setDate(parsedDate);
                transaction.setCategorie(dto.getCategorie());
                transaction.setCompteBancaire(compte);
                transaction.setProduit(dto.getProduit());

                transactionRepo.save(transaction);

                logger.info("✅ Transaction insérée pour IBAN {} | Montant: {} | Catégorie: {} | Date: {} | Type: {} | Produit: {}",
                        dto.getIban(), dto.getMon(), dto.getCategorie(), transaction.getDate(), transaction.getType(), transaction.getProduit());

                success++;
            } catch (Exception e) {
                logger.error("❌ Erreur lors de l'insertion de la transaction (IBAN: {}) : {}", dto.getIban(), e.getMessage());
                failed++;
            }
        }

        logger.info("🔄 Résumé du chunk : {} transactions insérées, {} rejetées.", success, failed);
    }

    private String convertirType(String sen) {
        if (sen == null) return null;
        return switch (sen.trim().toUpperCase()) {
            case "C" -> "Crédit";
            case "D" -> "Débit";
            default -> "Inconnu";
        };
    }

    private LocalDate parseDate(String dco) {
        try {
            return LocalDate.parse(dco.trim(), formatter);
        } catch (Exception e) {
            logger.error("❌ Erreur parsing date : {} ➜ {}", dco, e.getMessage());
            return null;
        }
    }
}
