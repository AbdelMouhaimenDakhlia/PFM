package com.pfm.pfmbackend.batch.processor;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.pfm.pfmbackend.batch.dto.TransactionCsvDTO;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

@Component
public class TransactionItemProcessor implements ItemProcessor<TransactionCsvDTO, TransactionCsvDTO> {

    private final ObjectMapper mapper = new ObjectMapper();
    
    @Value("${pfm.ia.classification.url}")
    private String classificationUrl;

    @Override
    public TransactionCsvDTO process(TransactionCsvDTO item) throws Exception {
        String description = item.getBhLib();

        try {
            URL url = new URL(classificationUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            conn.setRequestProperty("User-Agent", "Java-SpringBatch/1.0");
            conn.setDoOutput(true);
            conn.setConnectTimeout(10000); // 10 secondes
            conn.setReadTimeout(10000);    // 10 secondes

            // Créer le JSON correctement avec Jackson
            ObjectNode jsonRequest = mapper.createObjectNode();
            jsonRequest.put("description", description);
            String jsonInput = mapper.writeValueAsString(jsonRequest);
            
            try (OutputStream os = conn.getOutputStream()) {
                os.write(jsonInput.getBytes());
                os.flush();
            }

            int responseCode = conn.getResponseCode();

            String response;
            if (responseCode >= 200 && responseCode < 300) {
                Scanner scanner = new Scanner(conn.getInputStream());
                response = scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
                scanner.close();
            } else {
                Scanner scanner = new Scanner(conn.getErrorStream());
                response = scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
                scanner.close();
                System.err.println("❌ Erreur API HTTP " + responseCode + ": " + response);
                item.setCategorie("ERREUR_API");
                return item;
            }

            JsonNode jsonNode = mapper.readTree(response);
            JsonNode categoryNode = jsonNode.get("categorie_predite");

            if (categoryNode == null || categoryNode.isNull()) {
                item.setCategorie("INCONNUE");
            } else {
                String categorie = categoryNode.asText();
                item.setCategorie(categorie);
            }

        } catch (Exception e) {
            System.err.println("❌ Erreur API: " + e.getMessage());
            item.setCategorie("ERREUR_API");
        }

        return item;
    }
}


