package com.pfm.pfmbackend.controller;

import com.pfm.pfmbackend.dto.AuthRequest;
import com.pfm.pfmbackend.dto.AuthResponse;
import com.pfm.pfmbackend.security.JwtUtil;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import com.pfm.pfmbackend.model.Utilisateur;
import com.pfm.pfmbackend.repository.UtilisateurRepository;
import com.pfm.pfmbackend.dto.RegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil,
                          UtilisateurRepository utilisateurRepository, PasswordEncoder passwordEncoder) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getMotDePasse())
            );

            String token = jwtUtil.generateToken(request.getEmail());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Email ou mot de passe incorrect");
        }
    }


    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email déjà utilisé");
        }

        Utilisateur newUser = new Utilisateur();
        newUser.setNom(request.getNom());
        newUser.setEmail(request.getEmail());
        newUser.setCli(request.getCli());
        newUser.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));

        utilisateurRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body("Utilisateur enregistré");
    }
}

