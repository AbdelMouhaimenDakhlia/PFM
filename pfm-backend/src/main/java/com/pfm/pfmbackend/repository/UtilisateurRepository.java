package com.pfm.pfmbackend.repository;

import com.pfm.pfmbackend.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByEmail(String email);
    @Query("SELECT MAX(u.id) FROM Utilisateur u")
    Optional<Long> findMaxId();

    Optional<Utilisateur> findByCli(String cli);



}
