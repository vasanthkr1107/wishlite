package com.wishlite.dto;

import java.util.List;
import java.util.Map;

public class ApiDtos {

    public record AuthRequest(String email, String password, String displayName) {}

    public record AuthResponse(Long userId, String email, String displayName, String token) {}

    public record RecommendRequest(String occasion, String recipient, String tone) {}

    public record GenerateRequest(
            String templateId,
            String occasion,
            String recipient,
            String tone,
            String fromName,
            String toName,
            String extraDetails,
            String kind
    ) {}

    public record WishSaveRequest(Long userId, String templateId, String title, Map<String, Object> payload) {}

    public record TemplateGame(
            String type,
            String title,
            String intro,
            List<Map<String, Object>> questions,
            String revealPrompt
    ) {}

    public record SitePage(
            String slug,
            String nav,
            String kind,
            String title,
            String subtitle,
            String body,
            String cta,
            List<String> prompts
    ) {}

    public record TemplateDefinition(
            String id,
            String name,
            String occasion,
            String tagline,
            String description,
            String styleFeel,
            String accent,
            String layout,
            String cta,
            List<String> features,
            List<String> sampleQuotes,
            TemplateGame game,
            List<SitePage> pages
    ) {}
}
