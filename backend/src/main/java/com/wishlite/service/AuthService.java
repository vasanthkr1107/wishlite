package com.wishlite.service;

import com.wishlite.dto.ApiDtos.AuthRequest;
import com.wishlite.dto.ApiDtos.AuthResponse;
import com.wishlite.model.UserAccount;
import com.wishlite.repo.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;

@Service
public class AuthService {

    private final UserAccountRepository users;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserAccountRepository users) {
        this.users = users;
    }

    public AuthResponse register(AuthRequest req) {
        if (req.email() == null || req.password() == null || req.displayName() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email, password and name are required");
        }
        if (users.existsByEmailIgnoreCase(req.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        UserAccount user = new UserAccount();
        user.setEmail(req.email().trim().toLowerCase());
        user.setDisplayName(req.displayName().trim());
        user.setPasswordHash(encoder.encode(req.password()));
        users.save(user);
        return toResponse(user);
    }

    public AuthResponse login(AuthRequest req) {
        UserAccount user = users.findByEmailIgnoreCase(req.email() == null ? "" : req.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        if (!encoder.matches(req.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        return toResponse(user);
    }

    public UserAccount require(Long userId) {
        return users.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please sign in"));
    }

    private AuthResponse toResponse(UserAccount user) {
        String token = Base64.getEncoder().encodeToString(
                (user.getId() + ":" + UUID.randomUUID()).getBytes(StandardCharsets.UTF_8));
        return new AuthResponse(user.getId(), user.getEmail(), user.getDisplayName(), token);
    }
}
