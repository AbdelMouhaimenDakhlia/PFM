package com.pfm.pfmbackend.controller;

import org.springframework.batch.core.*;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/batch")
public class BatchController {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job transactionJob;

    @PostMapping("/categorize")
    public String launchCategorizationJob() {
        try {
            JobParameters params = new JobParametersBuilder()
                    .addLong("time", System.currentTimeMillis()) // clé unique à chaque lancement
                    .toJobParameters();


            JobExecution execution = jobLauncher.run(transactionJob, params);

            return "🟢 Job lancé avec le statut : " + execution.getStatus();
        } catch (Exception e) {
            e.printStackTrace();
            return "🔴 Erreur lors de l'exécution du job : " + e.getMessage();
        }
    }
}
