package com.wishlite.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wishlite.dto.ApiDtos.WishSaveRequest;
import com.wishlite.model.WishProject;
import com.wishlite.repo.WishProjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class WishService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";

    private final WishProjectRepository wishes;
    private final ObjectMapper mapper;

    public WishService(WishProjectRepository wishes, ObjectMapper mapper) {
        this.wishes = wishes;
        this.mapper = mapper;
    }

    public Map<String, Object> save(WishSaveRequest req) {
        WishProject project = new WishProject();
        project.setUserId(req.userId());
        project.setTemplateId(req.templateId());
        project.setTitle(req.title() == null || req.title().isBlank() ? "Untitled wish" : req.title());
        project.setPayloadJson(write(req.payload()));
        ensureShareCode(project);
        return toMap(wishes.save(project));
    }

    public Map<String, Object> update(Long id, WishSaveRequest req) {
        WishProject project = wishes.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wish not found"));
        if (req.templateId() != null) {
            project.setTemplateId(req.templateId());
        }
        if (req.title() != null) {
            project.setTitle(req.title());
        }
        if (req.payload() != null) {
            project.setPayloadJson(write(req.payload()));
        }
        ensureShareCode(project);
        return toMap(wishes.save(project));
    }

    public Map<String, Object> get(Long id) {
        WishProject project = wishes.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wish not found"));
        if (project.getShareCode() == null || project.getShareCode().isBlank()) {
            ensureShareCode(project);
            project = wishes.save(project);
        }
        return toMap(project);
    }

    public Map<String, Object> getByShareCode(String code) {
        WishProject project = wishes.findByShareCode(code)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wish not found"));
        return toMap(project);
    }

    public List<Map<String, Object>> byUser(Long userId) {
        return wishes.findByUserIdOrderByUpdatedAtDesc(userId).stream().map(this::toMap).toList();
    }

    private Map<String, Object> toMap(WishProject project) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", project.getId());
        map.put("userId", project.getUserId());
        map.put("templateId", project.getTemplateId());
        map.put("title", project.getTitle());
        map.put("shareCode", project.getShareCode());
        map.put("sharePath", "/s/" + project.getShareCode());
        map.put("publicUrl", project.getPublicUrl());
        map.put("payload", read(project.getPayloadJson()));
        map.put("createdAt", project.getCreatedAt());
        map.put("updatedAt", project.getUpdatedAt());
        return map;
    }

    private String write(Map<String, Object> payload) {
        try {
            return mapper.writeValueAsString(payload == null ? Map.of() : payload);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid wish payload");
        }
    }

    private Object read(String json) {
        try {
            return mapper.readValue(json, Map.class);
        } catch (Exception e) {
            return Map.of();
        }
    }

    private void ensureShareCode(WishProject project) {
        if (project.getShareCode() != null && !project.getShareCode().isBlank()) {
            return;
        }
        String code;
        do {
            code = randomCode(8);
        } while (wishes.findByShareCode(code).isPresent());
        project.setShareCode(code);
    }

    private static String randomCode(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }

    public Map<String, Object> setPublicUrl(Long id, String publicUrl) {
        if (id == null) {
            return Map.of("publicUrl", publicUrl);
        }
        WishProject project = wishes.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wish not found"));
        project.setPublicUrl(publicUrl);
        return toMap(wishes.save(project));
    }
}
