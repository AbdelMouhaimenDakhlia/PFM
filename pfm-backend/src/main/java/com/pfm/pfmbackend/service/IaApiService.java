// src/main/java/com/pfm/pfmbackend/service/IaApiService.java

package com.pfm.pfmbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.util.List;
import java.util.Map;

@Service
public class IaApiService {

    @Autowired
    private RestTemplate restTemplate;

    public Object getMontantsFromFlask(String clientId) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://prediction:5000/api/predict/" + clientId;
            ResponseEntity<Object> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(new HttpHeaders()),
                    Object.class
            );
            return response.getBody();
        } catch (Exception e) {
            return Map.of("error", "Erreur appel Flask : " + e.getMessage());
        }
    }
    public List<String> getRecommendationsFromXgb(String clientId, int topN) {
        String flaskUrl = "http://recommandation:5000/api/recommend?client_id=" + clientId + "&top_n=" + topN;

        RestTemplate restTemplate = new RestTemplate();
        try {
            Map<String, Object> response = restTemplate.getForObject(flaskUrl, Map.class);
            if (response != null && response.containsKey("recommendations")) {
                return (List<String>) response.get("recommendations");
            }
        } catch (Exception e) {
            e.printStackTrace();



        }
        return List.of(); // retour vide si erreur
    }
}
