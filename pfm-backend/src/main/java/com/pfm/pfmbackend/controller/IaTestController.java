package com.pfm.pfmbackend.controller;

import com.pfm.pfmbackend.service.IaApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
public class IaTestController {

    @Autowired
    private IaApiService iaApiService;

    @GetMapping("/predict-montant")
    public Object getMontantPredictions(@RequestParam String clientId) {
        return iaApiService.getMontantsFromFlask(clientId);
    }

    @GetMapping("/recommend")
    public List<String> getRecommendations(@RequestParam String clientId, @RequestParam(defaultValue = "5") int topN) {
        return iaApiService.getRecommendationsFromXgb(clientId, topN);
    }
}
