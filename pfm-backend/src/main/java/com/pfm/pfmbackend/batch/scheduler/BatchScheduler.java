package com.pfm.pfmbackend.batch.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import jakarta.annotation.PostConstruct;

@Component
@RequiredArgsConstructor
public class BatchScheduler {

    private final JobLauncher jobLauncher;
    private final Job transactionCategorizationJob;

    @Value("${pfm.batch.csv.path}")
    private String csvPath; // injecté via application.properties

    private long lastModified = 0;

    @PostConstruct
    public void init() {
        System.out.println("🚀 BatchScheduler initialisé. Surveillance du fichier : " + csvPath);
        System.out.println("📋 Le batch sera lancé automatiquement si le fichier est modifié.");
    }

    @Scheduled(fixedDelay = 5000)
    public void runIfFileChanged() {
        try {
            Path path = Path.of(csvPath);
            System.out.println("🕒 Vérification du fichier CSV à : " + csvPath);
            
            if (!Files.exists(path)) {
                System.out.println("❌ Le fichier CSV n'existe pas : " + csvPath);
                return;
            }

            long currentModified = Files.getLastModifiedTime(path).toMillis();

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
            LocalDateTime currentDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(currentModified), ZoneId.systemDefault());
            LocalDateTime lastRunDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(lastModified), ZoneId.systemDefault());

            
            System.out.println("📁 Date de modification actuelle : " + currentDateTime.format(formatter));
            System.out.println("🧠 Date de dernière exécution connue : " + lastRunDateTime.format(formatter));

            if (currentModified > lastModified) {
                JobParameters params = new JobParametersBuilder()
                        .addString("filePath", csvPath)
                        .addLong("time", Instant.now().toEpochMilli())
                        .toJobParameters();

                System.out.println("🚀 Fichier modifié. Lancement du job Spring Batch...");
                jobLauncher.run(transactionCategorizationJob, params);
                lastModified = currentModified;
            } else {
                System.out.println("⏸️ Pas de changement détecté. Job non lancé.");
            }
        } catch (Exception e) {
            System.err.println("❌ Erreur planification batch : " + e.getMessage());
        }
    }
}
