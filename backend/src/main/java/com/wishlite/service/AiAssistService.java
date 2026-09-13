package com.wishlite.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wishlite.catalog.TemplateCatalog;
import com.wishlite.dto.ApiDtos.GenerateRequest;
import com.wishlite.dto.ApiDtos.TemplateDefinition;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiAssistService {

    private final TemplateCatalog catalog;
    private final ObjectMapper mapper;
    private final RestClient restClient;

    @Value("${wishlite.ai.enabled}")
    private boolean aiEnabled;

    @Value("${wishlite.ai.api-key}")
    private String apiKey;

    @Value("${wishlite.ai.base-url}")
    private String baseUrl;

    @Value("${wishlite.ai.model}")
    private String model;

    public AiAssistService(TemplateCatalog catalog, ObjectMapper mapper) {
        this.catalog = catalog;
        this.mapper = mapper;
        this.restClient = RestClient.create();
    }

    public Map<String, Object> recommend(String occasion, String recipient, String tone) {
        List<TemplateDefinition> picks = catalog.recommend(occasion, recipient, tone);
        Map<String, Object> out = new HashMap<>();
        out.put("templates", picks);
        out.put("rationale", rationale(occasion, recipient, tone, picks));
        out.put("source", hasRemoteAi() ? "hybrid" : "on-device");
        out.put("themeColors", themeFor(tone, picks.isEmpty() ? null : picks.get(0)));
        return out;
    }

    public Map<String, Object> generate(GenerateRequest req) {
        TemplateDefinition template = catalog.byId(req.templateId() == null ? "" : req.templateId())
                .orElse(catalog.all().get(0));

        Map<String, Object> local = localGenerate(req, template);
        if (!hasRemoteAi()) {
            local.put("source", "on-device");
            return local;
        }
        try {
            Map<String, Object> remote = remoteGenerate(req, template);
            remote.put("source", "model");
            return remote;
        } catch (Exception ex) {
            local.put("source", "on-device-fallback");
            local.put("warning", "Live model unavailable, used curated generator.");
            return local;
        }
    }

    private boolean hasRemoteAi() {
        return aiEnabled && apiKey != null && !apiKey.isBlank();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> remoteGenerate(GenerateRequest req, TemplateDefinition template) throws Exception {
        String kind = req.kind() == null ? "full" : req.kind();
        String prompt = """
                You write short, warm wish-card copy. Return JSON only with keys:
                headline, poem, message, closing, quotes (array of 3 short strings),
                gameIdeas (array of 2 strings), photoLayoutTip, colorTip.
                Occasion: %s
                Template: %s (%s)
                From: %s
                To: %s
                Relationship: %s
                Tone: %s
                Extra: %s
                Kind requested: %s
                Keep poem under 8 lines. Message under 60 words. No hashtags.
                """.formatted(
                nz(req.occasion(), template.occasion()),
                template.name(), template.styleFeel(),
                nz(req.fromName(), "me"),
                nz(req.toName(), "you"),
                nz(req.recipient(), "someone special"),
                nz(req.tone(), "warm"),
                nz(req.extraDetails(), "none"),
                kind
        );

        Map<String, Object> body = Map.of(
                "model", model,
                "temperature", 0.8,
                "messages", List.of(
                        Map.of("role", "system", "content", "You are a gifted writer of personal notes for cards and digital wishes."),
                        Map.of("role", "user", "content", prompt)
                )
        );

        String raw = restClient.post()
                .uri(trimSlash(baseUrl) + "/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(String.class);

        JsonNode root = mapper.readTree(raw);
        String content = root.path("choices").path(0).path("message").path("content").asText("{}");
        content = content.replaceAll("(?s)```json|```", "").trim();
        return mapper.readValue(content, Map.class);
    }

    private Map<String, Object> localGenerate(GenerateRequest req, TemplateDefinition template) {
        String from = nz(req.fromName(), "me");
        String to = nz(req.toName(), "you");
        String tone = nz(req.tone(), "warm").toLowerCase();
        String occasion = nz(req.occasion(), template.occasion());

        String poem = poemFor(template.id(), from, to, tone);
        String message = messageFor(template.id(), from, to, occasion, tone);
        String headline = headlineFor(template.id(), to);

        Map<String, Object> out = new HashMap<>();
        out.put("headline", headline);
        out.put("poem", poem);
        out.put("message", message);
        out.put("closing", closingFor(template.id(), from));
        out.put("quotes", template.sampleQuotes());
        out.put("gameIdeas", List.of(
                template.game().title() + " — " + template.game().intro(),
                "Reveal the last line after they finish the prompts."
        ));
        out.put("photoLayoutTip", layoutTip(template.layout()));
        out.put("colorTip", "Keep the accent " + template.accent() + " and pair it with cream or midnight navy.");
        return out;
    }

    private String rationale(String occasion, String recipient, String tone, List<TemplateDefinition> picks) {
        String first = picks.isEmpty() ? "a warm template" : picks.get(0).name();
        return "Based on a %s wish for your %s in a %s tone, start with %s — then customize names, photos, and the closing line."
                .formatted(nz(occasion, "special"), nz(recipient, "person"), nz(tone, "heartfelt"), first);
    }

    private List<String> themeFor(String tone, TemplateDefinition first) {
        if (first != null) {
            return List.of(first.accent(), "#f7efe8", "#1f1a24");
        }
        if (tone != null && tone.toLowerCase().contains("playful")) {
            return List.of("#6d4aff", "#fff4d6", "#1b1233");
        }
        return List.of("#8b1e3f", "#f7efe8", "#1f1a24");
    }

    private static String poemFor(String id, String from, String to, String tone) {
        return switch (id) {
            case "valentine" -> "Not just a date on a calendar,\nbut every ordinary morning with you.\n" + to + ", you are my favorite place —\nand I keep choosing you.";
            case "birthday" -> "Another trip around the sun,\nand the world is luckier for it.\n" + to + ", may this year be gentle,\nloud with laughter, and kind to your dreams.";
            case "friendship" -> "Same chaos, same inside jokes,\ndifferent chapters — same story.\nThank you, " + to + ", for staying.";
            case "anniversary" -> "Then we were new.\nNow we are home.\nAlways, " + to + ", I am still arriving to you.";
            case "apology" -> "I know I got it wrong.\nThis is me putting the pieces down gently.\n" + to + ", you still mean the world —\nplease let me make it better.";
            case "get-well" -> "Rest. Heal. Take the slow road.\nThe world can wait, " + to + ".\nI'm here, sending quiet strength.";
            case "travel" -> "New places. Same us.\nLet's collect skies and snacks and stories,\nand get a little lost on purpose.";
            case "motivational" -> "You don't have to sprint.\nYou only have to keep the light on.\n" + to + ", the best is still ahead.";
            case "game" -> "Not a test — a treasure hunt.\nEvery right answer is just another way\nI like you, " + to + ".";
            default -> "A little something, for no big reason\nexcept that you are mine to celebrate.\nForever looks good on you, " + to + ".";
        } + (tone.contains("play") ? "\n(And yes, I'm smiling while I write this.)" : "");
    }

    private static String messageFor(String id, String from, String to, String occasion, String tone) {
        return switch (id) {
            case "valentine" -> to + ", you are not just my love. You are my favorite person, my happy place, and my forever. — " + from;
            case "birthday" -> "Happy birthday, " + to + ". May this day be filled with good food, big dreams, and people who adore you. With love, " + from + ".";
            case "friendship" -> "Thank you for being my constant in this crazy journey. Same mad friends, different chapters, same story. — " + from;
            case "anniversary" -> "Another year, still choosing you — today and always. Here's to more love and a lifetime together. — " + from;
            case "apology" -> "I know I messed up. You mean the world to me, and I never want to lose you. Please forgive me. — " + from;
            case "get-well" -> "Take your time, heal well, and come back stronger. You got this. Sending hugs, " + from + ".";
            case "travel" -> "New places, same us, more memories. Let's plan the next trip — more stories, more us. — " + from;
            case "motivational" -> "Dream big, stay focused, and never forget how capable you are. The best is yet to come. — " + from;
            case "game" -> "I made this little game because I love the way you laugh at my questions. You're my favorite player. — " + from;
            default -> "You are my today, tomorrow, and always. I'm so lucky to have you. Forever & always, " + from + ".";
        };
    }

    private static String headlineFor(String id, String to) {
        return switch (id) {
            case "valentine" -> "Happy Valentine's Day";
            case "birthday" -> "Happy Birthday!";
            case "friendship" -> "Happy Friendship Day";
            case "anniversary" -> "Happy Anniversary";
            case "apology" -> "I'm Sorry";
            case "get-well" -> "Get Well Soon";
            case "travel" -> "Let's Explore Together";
            case "motivational" -> "You Can Do It";
            case "game" -> "Let's Play!";
            default -> "A Little Something Special";
        };
    }

    private static String closingFor(String id, String from) {
        return switch (id) {
            case "apology" -> "Let's make it better — " + from;
            case "get-well" -> "Sending hugs — " + from;
            case "travel" -> "Plan our next trip — " + from;
            case "game" -> "Your move — " + from;
            default -> "With all my heart, " + from;
        };
    }

    private static String layoutTip(String layout) {
        return switch (layout) {
            case "heart-frame" -> "Place one close-up couple photo inside the heart; keep the rest as tiny floating Polaroids.";
            case "polaroid-cream" -> "One hero Polaroid on top, two smaller ones overlapping below.";
            case "polaroid-stack" -> "Scatter 3–4 tilted Polaroids; leave breathing room for the quote.";
            case "arch-sunset" -> "Use a vertical couple photo cropped into the arch.";
            case "travel-collage" -> "Mix landscape + portrait shots; add a map pin overlay on one.";
            default -> "One cinematic photo as the backdrop, text in the safest quiet area.";
        };
    }

    private static String nz(String v, String d) {
        return v == null || v.isBlank() ? d : v.trim();
    }

    private static String trimSlash(String url) {
        if (url.endsWith("/")) {
            return url.substring(0, url.length() - 1);
        }
        return url;
    }
}
