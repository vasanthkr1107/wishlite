package com.wishlite.catalog;

import com.wishlite.dto.ApiDtos.TemplateDefinition;
import com.wishlite.dto.ApiDtos.TemplateGame;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class TemplateCatalog {

    private final List<TemplateDefinition> templates = List.of(
            def("valentine", "Valentine Template", "Valentine's Day",
                    "Perfect for your special someone",
                    "Heart-framed photos, a love poem, and a closing message for your forever person.",
                    "Romantic, dreamy", "#8b1e3f", "heart-frame", "Our Love Story →",
                    List.of("Partner names", "Heart photo frame", "Love poem", "Couple quiz"),
                    List.of("You are not just my love, you are my favorite person, my happy place and my forever.",
                            "Another year of choosing you, today and always."),
                    game("quiz", "How well do we know us?", "Answer a few sweet questions, then reveal the love note.",
                            List.of(
                                    q("What's our favorite shared memory?", List.of("First date", "A late-night talk", "A trip together", "A quiet ordinary day")),
                                    q("How do I say I love you most?", List.of("Texts", "Hugs", "Little surprises", "Words out loud")),
                                    q("Our song vibe is...", List.of("Slow & romantic", "Playful pop", "Indie cozy", "Anything we can dance to"))
                            ),
                            "Write the final line they should never forget.")),

            def("birthday", "Birthday Template", "Birthday",
                    "Celebrate the special day",
                    "A warm collage with candles, wishes, and a playful birthday game.",
                    "Fun, lively, colorful", "#c45c26", "polaroid-cream", "Make a Wish →",
                    List.of("Name & date", "Photo collage", "AI birthday quotes", "Trivia game"),
                    List.of("May your special day be filled with happiness, love and all the success you deserve.",
                            "Good food. Big dreams. Forever smiles."),
                    game("trivia", "Birthday trivia", "A light quiz before the cake-worthy message.",
                            List.of(
                                    q("Best birthday plan?", List.of("Cake at home", "A surprise party", "A trip", "A cozy movie night")),
                                    q("The gift they'd love most?", List.of("Something handmade", "An adventure", "A letter", "Their favorite treat"))
                            ),
                            "Close with a warm birthday message.")),

            def("friendship", "Friendship Template", "Friendship Day",
                    "For your forever friends",
                    "Polaroid memories, inside jokes, and a thank-you for the friend who stayed.",
                    "Warm, casual", "#6b4f3a", "polaroid-stack", "Our Memories →",
                    List.of("Group photos", "Shared story", "Friendship quotes", "Memory reveal"),
                    List.of("Same mad friends. Different chapters. Same story!",
                            "Thank you for being my constant in this crazy journey called life."),
                    game("story", "Our story so far", "Pick the moments that made the friendship.",
                            List.of(
                                    q("How we became us", List.of("School / college", "Work", "A mutual friend", "By accident (the best kind)")),
                                    q("Our signature vibe", List.of("Chaotic fun", "Deep talks", "Silent company", "Always on a trip"))
                            ),
                            "Write why this friendship still feels like home.")),

            def("anniversary", "Anniversary Template", "Anniversary",
                    "For your lifelong partner",
                    "An arched photo, a timeline of then–now–always, and a toast to more years.",
                    "Elegant, intimate", "#b8576a", "arch-sunset", "Our Journey →",
                    List.of("Couple names", "Arched photo", "Then / Now / Always", "Love note"),
                    List.of("Another year, still choosing you — today and always.",
                            "Here's to more love, more memories and a lifetime together."),
                    game("timeline", "Then. Now. Always.", "Walk through your story, then seal it with a promise.",
                            List.of(
                                    q("Then, we were...", List.of("Nervous and new", "Best friends first", "A leap of faith", "Meant to be")),
                                    q("Now, we are...", List.of("A team", "Still butterflies", "Home", "Growing together"))
                            ),
                            "Write the always.")),

            def("apology", "Apology Template", "Apology",
                    "Say sorry, the right way",
                    "A quiet sunset scene with honest words and a path to make it better.",
                    "Gentle, sincere", "#4a5d73", "sunset-shore", "Let's Make It Better →",
                    List.of("Honest message", "Soft visuals", "Forgiveness CTA", "Rebuild note"),
                    List.of("I know I messed up... but you mean the world to me, and I never want to lose you.",
                            "Please forgive me."),
                    game("mend", "Let's make it better", "A few honest choices, then your apology.",
                            List.of(
                                    q("I want to make this right by...", List.of("Listening more", "Showing up", "Giving time", "Changing the pattern")),
                                    q("What I value most is...", List.of("Us", "Your peace", "Trust", "A second chance"))
                            ),
                            "Write the sorry they deserve.")),

            def("get-well", "Get Well Soon Template", "Get Well Soon",
                    "For someone who needs care",
                    "A handwritten-feel card with rest, positivity, and a hug you can send.",
                    "Soft, caring", "#5b8c6a", "wellness-note", "Sending Hugs →",
                    List.of("Care message", "Photo or note", "Rest / stay positive icons", "Hug CTA"),
                    List.of("Take your time, heal well and come back stronger!",
                            "You got this."),
                    game("care", "Sending hugs", "Pick the kind of care they need, then send the hug.",
                            List.of(
                                    q("Today they need...", List.of("Rest", "A laugh", "Company", "Quiet support")),
                                    q("A reminder:", List.of("You're not alone", "Healing isn't a race", "We've got you", "Better days are coming"))
                            ),
                            "Write a gentle get-well note.")),

            def("travel", "Travel Template", "Travel / Adventure",
                    "For your next adventure",
                    "A dark collage of places, pins, and a plan for the next trip together.",
                    "Adventurous, cinematic", "#1c3a4a", "travel-collage", "Plan Our Next Trip →",
                    List.of("Photo collage", "Map pins", "Trip caption", "Next-destination game"),
                    List.of("New places • Same us • More memories",
                            "More trips. More stories. More us."),
                    game("trip", "Plan our next trip", "Choose the vibe, then reveal the invite.",
                            List.of(
                                    q("Next destination vibe", List.of("Mountains", "Sea", "City lights", "Somewhere quiet")),
                                    q("Travel style", List.of("Spontaneous", "Planned down to snacks", "Road trip", "Slow mornings"))
                            ),
                            "Invite them on the next adventure.")),

            def("motivational", "Motivational Template", "Motivation",
                    "For encouragement & support",
                    "A sunrise scene that says the best is yet to come — with a keep-going close.",
                    "Hopeful, grounded", "#c46a3a", "sunrise-path", "Keep Going →",
                    List.of("Pep talk", "Landscape photo", "Quote", "Keep going CTA"),
                    List.of("Dream big, work hard, stay focused and never forget how capable you are.",
                            "The best is yet to come..."),
                    game("boost", "A little push", "Answer two prompts, then get the pep talk.",
                            List.of(
                                    q("They're chasing...", List.of("A goal", "Healing", "A new chapter", "Their own pace")),
                                    q("They need to hear...", List.of("I'm proud of you", "You can do hard things", "Rest is allowed", "Keep going"))
                            ),
                            "Write the encouragement.")),

            def("game", "Game Template", "Fun / Interactive",
                    "Make it interactive & fun",
                    "A five-question quiz that reveals how well they know you — then a sweet ending.",
                    "Playful, neon-night", "#6d4aff", "quiz-night", "Next →",
                    List.of("5-question quiz", "Multiple choice", "Score reveal", "Personal note"),
                    List.of("Answer a few questions, find out what I love about you!",
                            "Let's play!"),
                    game("love-quiz", "Let's Play!", "Question 1/5 — make it personal.",
                            List.of(
                                    q("What's your favorite thing about me?", List.of("Your smile", "Your kindness", "Your silly talks", "Everything!")),
                                    q("Our ideal weekend is...", List.of("Doing nothing together", "Going out", "A long call", "A surprise plan")),
                                    q("I feel most loved when...", List.of("You remember small things", "You show up", "You tease me", "You listen")),
                                    q("If we had one free day...", List.of("Food crawl", "Stay in", "Adventure", "Photos everywhere")),
                                    q("The truth is...", List.of("You're my favorite person", "I like you a lot", "This was always you", "All of the above"))
                            ),
                            "End with what you actually love about them.")),

            def("special", "Special Message Template", "Special Message",
                    "For a heartfelt surprise",
                    "A night-sky scene with a short, forever kind of note.",
                    "Intimate, cinematic", "#3d2a6b", "night-sky", "Smile, it's for You →",
                    List.of("Short letter", "Night photo", "Forever line", "Soft CTA"),
                    List.of("You are my today, tomorrow and always.",
                            "No matter where life takes us, I just want you to know... I'm so lucky to have you."),
                    game("reveal", "A little something special", "A quiet path to the message.",
                            List.of(
                                    q("This note is for...", List.of("Tonight", "A hard day", "No reason, just because", "Forever")),
                                    q("Keep this as...", List.of("A secret", "A reminder", "A promise", "A smile"))
                            ),
                            "Write the forever line."))
    );

    public List<TemplateDefinition> all() {
        return templates;
    }

    public Optional<TemplateDefinition> byId(String id) {
        return templates.stream().filter(t -> t.id().equalsIgnoreCase(id)).findFirst();
    }

    public List<TemplateDefinition> recommend(String occasion, String recipient, String tone) {
        String o = safe(occasion);
        String r = safe(recipient);
        String t = safe(tone);

        return templates.stream()
                .sorted((a, b) -> Integer.compare(score(b, o, r, t), score(a, o, r, t)))
                .limit(5)
                .toList();
    }

    private int score(TemplateDefinition def, String occasion, String recipient, String tone) {
        int s = 0;
        String blob = (def.id() + " " + def.occasion() + " " + def.styleFeel() + " " + def.description()).toLowerCase();
        if (!occasion.isBlank() && blob.contains(occasion)) s += 6;
        if (occasion.contains("valentine") || occasion.contains("love") || recipient.contains("boyfriend")
                || recipient.contains("girlfriend") || recipient.contains("partner")) {
            if (def.id().equals("valentine") || def.id().equals("anniversary") || def.id().equals("special")) s += 5;
        }
        if (occasion.contains("birthday")) {
            if (def.id().equals("birthday") || def.id().equals("game") || def.id().equals("friendship")) s += 5;
        }
        if (occasion.contains("friend") || recipient.contains("friend")) {
            if (def.id().equals("friendship") || def.id().equals("travel") || def.id().equals("birthday")) s += 4;
        }
        if (occasion.contains("sorry") || occasion.contains("apolog")) {
            if (def.id().equals("apology")) s += 8;
        }
        if (occasion.contains("well") || occasion.contains("sick")) {
            if (def.id().equals("get-well")) s += 8;
        }
        if (occasion.contains("travel") || occasion.contains("trip")) {
            if (def.id().equals("travel")) s += 8;
        }
        if (tone.contains("romantic")) {
            if (List.of("valentine", "anniversary", "special").contains(def.id())) s += 4;
        }
        if (tone.contains("playful") || tone.contains("fun")) {
            if (List.of("game", "birthday", "travel", "friendship").contains(def.id())) s += 4;
        }
        if (tone.contains("formal") || tone.contains("gentle") || tone.contains("sincere")) {
            if (List.of("apology", "get-well", "motivational", "special").contains(def.id())) s += 3;
        }
        if (recipient.contains("sibling") && def.id().equals("birthday")) s += 3;
        return s;
    }

    private static String safe(String v) {
        return v == null ? "" : v.toLowerCase().trim();
    }

    private static TemplateDefinition def(String id, String name, String occasion, String tagline,
                                          String description, String styleFeel, String accent, String layout,
                                          String cta, List<String> features, List<String> quotes, TemplateGame game) {
        return new TemplateDefinition(id, name, occasion, tagline, description, styleFeel, accent, layout, cta,
                features, quotes, game, SitePages.of(id));
    }

    private static TemplateGame game(String type, String title, String intro, List<Map<String, Object>> questions,
                                     String revealPrompt) {
        return new TemplateGame(type, title, intro, questions, revealPrompt);
    }

    private static Map<String, Object> q(String prompt, List<String> options) {
        return Map.of("prompt", prompt, "options", options);
    }
}
