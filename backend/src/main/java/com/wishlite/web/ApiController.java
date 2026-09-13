package com.wishlite.web;

import com.wishlite.catalog.TemplateCatalog;
import com.wishlite.dto.ApiDtos.*;
import com.wishlite.service.AiAssistService;
import com.wishlite.service.AuthService;
import com.wishlite.service.PublishService;
import com.wishlite.service.UploadService;
import com.wishlite.service.WishService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final TemplateCatalog catalog;
    private final AiAssistService ai;
    private final AuthService auth;
    private final WishService wishes;
    private final UploadService uploads;
    private final PublishService publisher;

    public ApiController(TemplateCatalog catalog, AiAssistService ai, AuthService auth,
                         WishService wishes, UploadService uploads, PublishService publisher) {
        this.catalog = catalog;
        this.ai = ai;
        this.auth = auth;
        this.wishes = wishes;
        this.uploads = uploads;
        this.publisher = publisher;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "app", "wish-lite");
    }

    @GetMapping("/templates")
    public List<TemplateDefinition> templates() {
        return catalog.all();
    }

    @GetMapping("/templates/{id}")
    public TemplateDefinition template(@PathVariable String id) {
        return catalog.byId(id).orElseThrow();
    }

    @PostMapping("/ai/recommend")
    public Map<String, Object> recommend(@RequestBody RecommendRequest req) {
        return ai.recommend(req.occasion(), req.recipient(), req.tone());
    }

    @PostMapping("/ai/generate")
    public Map<String, Object> generate(@RequestBody GenerateRequest req) {
        return ai.generate(req);
    }

    @PostMapping("/auth/register")
    public AuthResponse register(@RequestBody AuthRequest req) {
        return auth.register(req);
    }

    @PostMapping("/auth/login")
    public AuthResponse login(@RequestBody AuthRequest req) {
        return auth.login(req);
    }

    @PostMapping("/wishes")
    public Map<String, Object> createWish(@RequestBody WishSaveRequest req) {
        return wishes.save(req);
    }

    @PutMapping("/wishes/{id}")
    public Map<String, Object> updateWish(@PathVariable Long id, @RequestBody WishSaveRequest req) {
        return wishes.update(id, req);
    }

    @GetMapping("/share/{code}")
    public Map<String, Object> getByShare(@PathVariable String code) {
        return wishes.getByShareCode(code);
    }

    @GetMapping("/wishes/{id}")
    public Map<String, Object> getWish(@PathVariable Long id) {
        return wishes.get(id);
    }

    @GetMapping("/wishes")
    public List<Map<String, Object>> listWishes(@RequestParam Long userId) {
        return wishes.byUser(userId);
    }

    @PostMapping(value = "/uploads", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<Map<String, String>> upload(@RequestParam("files") MultipartFile[] files) {
        return uploads.store(files);
    }

    @PostMapping(value = "/publish", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> publish(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "wishId", required = false) Long wishId
    ) {
        try {
            Map<String, String> hosted = publisher.publishHtml(
                    file.getOriginalFilename(), file.getBytes());
            if (wishId != null) {
                Map<String, Object> saved = wishes.setPublicUrl(wishId, hosted.get("publicUrl"));
                saved.put("host", hosted.get("host"));
                return saved;
            }
            return Map.of("publicUrl", hosted.get("publicUrl"), "host", hosted.get("host"));
        } catch (java.io.IOException e) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "Could not read HTML file");
        }
    }
}
