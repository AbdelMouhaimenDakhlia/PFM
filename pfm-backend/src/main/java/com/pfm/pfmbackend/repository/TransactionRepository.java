package com.pfm.pfmbackend.repository;

import com.pfm.pfmbackend.model.ComptBancaire;
import com.pfm.pfmbackend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByCompteBancaire(ComptBancaire compte);

    boolean existsByMontantAndDescriptionAndDateAndTypeAndCompteBancaire(
            Double montant, String description, LocalDate date, String type, ComptBancaire compte);

    @Query("SELECT t FROM Transaction t WHERE t.montant = :montant AND t.description = :description AND t.date = :date AND t.type = :type AND t.compteBancaire = :compteBancaire")
    List<Transaction> findMatchingTransaction(
            @Param("montant") Double montant,
            @Param("description") String description,
            @Param("date") LocalDate date,
            @Param("type") String type,
            @Param("compteBancaire") ComptBancaire compteBancaire
    );


    List<Transaction> findByCompteBancaireInOrderByDateDesc(List<ComptBancaire> comptes);
    List<Transaction> findByCompteBancaireIn(List<ComptBancaire> comptes);
    @Query(value = "SELECT * FROM ( " +
            "SELECT t.* FROM TRANSACTION t " +
            "WHERE t.compt_id IN :comptes " +
            "ORDER BY t.date_trans DESC " +
            ") WHERE ROWNUM <= 5", nativeQuery = true)
    List<Transaction> findTop5ByCompteIdIn(@Param("comptes") List<Long> compteIds);


    @Query(value = "SELECT TO_CHAR(t.date_trans, 'YYYY-MM') AS mois, SUM(t.montant) AS total " +
            "FROM transaction t " +
            "JOIN compt_bancaire cb ON t.compt_id = cb.id " +
            "JOIN utilisateur u ON cb.user_id = u.id " +
            "WHERE u.email = :email " +
            "GROUP BY TO_CHAR(t.date_trans, 'YYYY-MM') " +
            "ORDER BY mois DESC", nativeQuery = true)
    List<Object[]> getMonthlyTotals(@Param("email") String email);







}

