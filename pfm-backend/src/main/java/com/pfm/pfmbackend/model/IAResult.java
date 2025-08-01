package com.pfm.pfmbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "IA_RESULT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IAResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String categoriePredite;

    @Temporal(TemporalType.DATE)
    private Date datePrevu = new Date();

    private Double montantPrevu;

    private String recommandation;

    @OneToOne
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    // Constructeurs, getter et setter
    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }
}
