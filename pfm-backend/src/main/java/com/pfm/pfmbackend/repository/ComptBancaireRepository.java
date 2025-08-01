package com.pfm.pfmbackend.repository;


import com.pfm.pfmbackend.model.ComptBancaire;
import com.pfm.pfmbackend.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComptBancaireRepository extends JpaRepository<ComptBancaire, Long> {
    List<ComptBancaire> findByUtilisateur(Utilisateur utilisateur);
    Optional<ComptBancaire> findByIban(String iban);
    Optional<ComptBancaire> findFirstByUtilisateur(Utilisateur utilisateur);

    @Query("SELECT MAX(c.id) FROM ComptBancaire c")
    Optional<Long> findMaxId();


}
