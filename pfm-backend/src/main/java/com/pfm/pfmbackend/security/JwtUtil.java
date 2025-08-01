package com.pfm.pfmbackend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Key;
import java.util.Date;
import java.util.Base64;

@Component
public class JwtUtil {

    // Clé encodée en Base64 (exemple généré une fois puis fixé)
    private static final String SECRET = "h+7KkHAYYgf2lBJn1GOpjvz9HgRz9zOQm1UcqO0VQ7E=";

    private final Key secretKey = Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET));

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuer("pfm-app")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 jour
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername());
    }
}

