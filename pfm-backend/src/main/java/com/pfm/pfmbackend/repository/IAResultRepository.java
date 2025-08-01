package com.pfm.pfmbackend.repository;

import com.pfm.pfmbackend.model.IAResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IAResultRepository extends JpaRepository<IAResult, Long> {
    List<IAResult> findByCategoriePredite(String categorie);
}

