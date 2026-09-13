package com.wishlite.catalog;

import com.wishlite.dto.ApiDtos.SitePage;

import java.util.List;

public final class SitePages {

    private SitePages() {}

    public static List<SitePage> of(String id) {
        return switch (id) {
            case "birthday" -> birthday();
            case "friendship" -> friendship();
            case "anniversary" -> anniversary();
            case "apology" -> apology();
            case "get-well" -> getWell();
            case "travel" -> travel();
            case "motivational" -> motivational();
            case "game" -> game();
            case "special" -> special();
            default -> valentine();
        };
    }

    private static List<SitePage> valentine() {
        return List.of(
                p("home", "Home", "home", "This is for you",
                        "A tiny website about us — not a card, a whole little world.",
                        "Welcome in. I made these pages so you can walk through our story: a note, our photos, a few questions, a game, and a last page about how I love you.",
                        "Open the first note →"),
                p("notes", "Notes", "notes", "A note, just for you",
                        "Read this slowly.",
                        "You are not just my love. You are my favorite person, my happy place, and my forever. These lines are the ones I would say if I were sitting next to you.",
                        "See our memories →"),
                p("memories", "Memories", "memories", "Moments I keep",
                        "Photos of ordinary days that still feel like magic.",
                        "Tap through the pictures. Each one is a reason I still choose you.",
                        "Question ideas →"),
                p("ideas", "Ideas", "ideas", "Things I want to ask you",
                        "Prompts for a late-night talk.",
                        "Not a test — just doors into us.",
                        "Play a game →",
                        List.of(
                                "When did you first feel at home with me?",
                                "What little habit of mine do you secretly like?",
                                "If we had a free Sunday, where would we disappear to?",
                                "What should we never stop doing?"
                        )),
                p("game", "Game", "game", "A tiny love game",
                        "Answer a few questions. There are no wrong ones.",
                        "Play it like we are on the couch. At the end, the next page is the real one.",
                        "Questions about us →"),
                p("love", "Our love", "quiz", "How well do we know our love?",
                        "The last pages are just for us.",
                        "Tell me what you see when you look at us — then read the closing line I wrote for you.",
                        "Finish with a smile →",
                        List.of(
                                "What is your favorite thing about us?",
                                "When did you feel this became real?",
                                "Will you keep choosing me, even on ordinary Tuesdays?"
                        ))
        );
    }

    private static List<SitePage> birthday() {
        return List.of(
                p("home", "Home", "home", "It's your day",
                        "A little birthday website, made only for you.",
                        "Six short pages: a wish, photos, party ideas, a silly game, and a final toast.",
                        "Read your wish →"),
                p("notes", "Wish", "notes", "The birthday note",
                        "May this year be loud with laughter.",
                        "Good food. Big dreams. Forever smiles. I hope today feels as special as you are.",
                        "Look at us →"),
                p("memories", "Memories", "memories", "Proof we had fun",
                        "A collage of us being ridiculous and happy.",
                        "These are the days I would rewind.",
                        "Gift & party ideas →"),
                p("ideas", "Ideas", "ideas", "Ways to celebrate you",
                        "Steal any of these.",
                        "A menu of joy, in case you cannot decide.",
                        "Play trivia →",
                        List.of("Cake at home with extra frosting", "A surprise playlist", "A trip, even a tiny one", "A letter you can keep")),
                p("game", "Game", "game", "Birthday trivia",
                        "How well do I know your birthday brain?",
                        "Tap your way through. No prizes except delight.",
                        "The last toast →"),
                p("love", "Toast", "quiz", "Make a wish",
                        "Blow out the candles on this last page.",
                        "I am so glad the world got you. Happy birthday.",
                        "Save this site →",
                        List.of("What made this year yours?", "What should we celebrate louder?", "One wish for the year ahead?"))
        );
    }

    private static List<SitePage> friendship() {
        return List.of(
                p("home", "Home", "home", "Same story, still us",
                        "A friendship site for the person who stayed.",
                        "Walk through a note, our chaos photos, talk prompts, a memory game, and a thank-you.",
                        "Read the note →"),
                p("notes", "Note", "notes", "Thank you for staying",
                        "Different chapters. Same story.",
                        "Thank you for being my constant in this crazy journey called life.",
                        "Our polaroids →"),
                p("memories", "Memories", "memories", "The evidence",
                        "Group photos, inside jokes, unglamorous joy.",
                        "If it made us laugh, it belongs here.",
                        "Talk ideas →"),
                p("ideas", "Ideas", "ideas", "Questions only we get",
                        "For the next 2-hour call.",
                        "Pick one and go too deep.",
                        "Play →",
                        List.of("How did we actually become us?", "What is our signature chaos?", "Which trip should we book next?", "What should never change?")),
                p("game", "Game", "game", "How we became us",
                        "Choose the moments.",
                        "A tiny story you tap through.",
                        "The thank-you →"),
                p("love", "Always", "quiz", "Forever friends",
                        "Last page. No performance. Just us.",
                        "I hope this little website feels like a hug you can reopen.",
                        "Keep this →",
                        List.of("What is our most us memory?", "What should we never stop doing?", "Next chapter — in or out?"))
        );
    }

    private static List<SitePage> anniversary() {
        return List.of(
                p("home", "Home", "home", "Another year of us",
                        "A six-page journey: then, now, always.",
                        "This site is our toast — photos, questions, a timeline game, and a promise.",
                        "Start with a note →"),
                p("notes", "Note", "notes", "Still choosing you",
                        "Today and always.",
                        "Here's to more love, more memories, and a lifetime together.",
                        "Our photos →"),
                p("memories", "Memories", "memories", "Then & now",
                        "The faces, the trips, the kitchen-light evenings.",
                        "Look how far we have come, and how we still look like us.",
                        "Prompts →"),
                p("ideas", "Ideas", "ideas", "Questions for year N+1",
                        "Ask these on a walk.",
                        "The next chapter starts with curiosity.",
                        "Then / now / always →",
                        List.of("What was our bravest yes?", "What do you want more of this year?", "Which ordinary ritual is actually sacred?", "Where should we go next?")),
                p("game", "Game", "game", "Then. Now. Always.",
                        "Tap through our timeline.",
                        "A short game before the vow on the last page.",
                        "The promise →"),
                p("love", "Always", "quiz", "The always",
                        "This is the page I meant.",
                        "I am still arriving to you.",
                        "Close with love →",
                        List.of("Then, we were…?", "Now, we are…?", "Always, we will…?"))
        );
    }

    private static List<SitePage> apology() {
        return List.of(
                p("home", "Home", "home", "I want to make this better",
                        "A quiet website, not a speech.",
                        "A few pages of honesty: a note, memories of what is worth saving, how I want to change, and a question for you.",
                        "Read the note →"),
                p("notes", "Sorry", "notes", "I'm sorry",
                        "I know I messed up.",
                        "You mean the world to me, and I never want to lose you. Please forgive me — and please keep walking through these pages.",
                        "What I still love →"),
                p("memories", "Us", "memories", "What is worth keeping",
                        "Pictures of the us I do not want to break.",
                        "I am not asking you to forget. I am asking you to remember why we started.",
                        "How I'll change →"),
                p("ideas", "Ideas", "ideas", "How I want to repair this",
                        "Not grand gestures. Better patterns.",
                        "Choose what you need from me.",
                        "A small game →",
                        List.of("Listen without defending", "Show up when I say I will", "Give you time without pressure", "Change the pattern, not just the apology")),
                p("game", "Game", "game", "Let's make it better",
                        "A few honest choices.",
                        "There is no trick. Only the next page.",
                        "Ask you →"),
                p("love", "You", "quiz", "If you are willing",
                        "This last page is yours.",
                        "I will wait. I will do the work. I still choose you.",
                        "Close →",
                        List.of("Can we talk when you are ready?", "What do you need from me first?", "Is there still an us to save?"))
        );
    }

    private static List<SitePage> getWell() {
        return List.of(
                p("home", "Home", "home", "Rest. I am here.",
                        "A gentle site while you heal.",
                        "No rush. Five or six soft pages: a note, photos, care ideas, a tiny game, a hug.",
                        "Open the note →"),
                p("notes", "Note", "notes", "You got this",
                        "Take your time.",
                        "Heal well and come back stronger. The world can wait.",
                        "Pictures of better days →"),
                p("memories", "Memories", "memories", "Proof of brighter days",
                        "Keep these nearby.",
                        "You have felt joy before. You will again.",
                        "Care ideas →"),
                p("ideas", "Care", "ideas", "Little ways I can help",
                        "Pick what you actually need.",
                        "Healing is not a race.",
                        "A tiny game →",
                        List.of("Rest without guilt", "A laugh if you want one", "Quiet company", "Soup, playlists, no small talk")),
                p("game", "Game", "game", "Sending hugs",
                        "Tap what today needs.",
                        "Then go to the last page and receive the hug.",
                        "The hug →"),
                p("love", "Hug", "quiz", "I am not going anywhere",
                        "Last page. Soft landing.",
                        "Sending hugs. Come back when you are ready.",
                        "Keep this →",
                        List.of("Want company or quiet?", "Need a laugh or a rest?", "Can I check on you tomorrow?"))
        );
    }

    private static List<SitePage> travel() {
        return List.of(
                p("home", "Home", "home", "Let's explore together",
                        "A trip-planning website for us.",
                        "Pages for the invite, photos from the last adventure, destination ideas, a packing game, and the yes.",
                        "Read the invite →"),
                p("notes", "Invite", "notes", "New places. Same us.",
                        "More trips. More stories.",
                        "I want the next stamp in the passport to have your name next to mine.",
                        "Last trip photos →"),
                p("memories", "Trips", "memories", "Where we have already been",
                        "Maps, snacks, bad hotel carpets, perfect skies.",
                        "Evidence that we travel well together.",
                        "Where next? →"),
                p("ideas", "Ideas", "ideas", "Next destination ideas",
                        "Vote with your heart, not the budget (yet).",
                        "We can argue later. Dream first.",
                        "Plan the vibe →",
                        List.of("Mountains and quiet mornings", "Sea and salty hair", "City lights and late trains", "A road trip with too many playlists")),
                p("game", "Game", "game", "Plan our next trip",
                        "Pick the vibe.",
                        "A two-minute game, then the actual invite.",
                        "Say yes →"),
                p("love", "Yes", "quiz", "Pack a bag with me",
                        "This is the page that means it.",
                        "More us. More maps. Let's go.",
                        "Save the itinerary →",
                        List.of("Mountains, sea, or city?", "How soon should we go?", "Are you in?"))
        );
    }

    private static List<SitePage> motivational() {
        return List.of(
                p("home", "Home", "home", "You can do it",
                        "A small website for a big week.",
                        "A pep talk, photos of who you already are, ideas to keep going, a tiny game, a last reminder.",
                        "Read the pep talk →"),
                p("notes", "Note", "notes", "The best is yet to come",
                        "You do not have to sprint.",
                        "Dream big, stay focused, and never forget how capable you are.",
                        "Look how far →"),
                p("memories", "Proof", "memories", "You have done hard things",
                        "Keep the evidence.",
                        "These pictures are of someone who already showed up.",
                        "Keep-going ideas →"),
                p("ideas", "Ideas", "ideas", "If today is heavy",
                        "Choose one. Leave the rest.",
                        "Rest is allowed. So is trying again.",
                        "A little game →",
                        List.of("Drink water and take a ten-minute walk", "Text someone who believes you", "Do the smallest next step", "Sleep like it is part of the work")),
                p("game", "Game", "game", "A little push",
                        "Two questions. Then the last page.",
                        "You already know the answers.",
                        "Last reminder →"),
                p("love", "Go", "quiz", "Keep going",
                        "I am proud of you.",
                        "The light is still on. Walk toward it.",
                        "Keep this →",
                        List.of("What are you proud of already?", "What is the smallest next step?", "Who should hear from you today?"))
        );
    }

    private static List<SitePage> game() {
        return List.of(
                p("home", "Home", "home", "Let's play",
                        "An interactive wish — mostly games, a little heart.",
                        "How to play: home, a note, photos as clues, idea cards, the quiz, then the reveal.",
                        "Start →"),
                p("notes", "Rules", "notes", "Not a test — a treasure hunt",
                        "Every tap is another way I like you.",
                        "Answer in your real voice. I already wrote the last page.",
                        "Clue photos →"),
                p("memories", "Clues", "memories", "Pictures as hints",
                        "These might help. They might just be cute.",
                        "Look, then go play.",
                        "Warm-up ideas →"),
                p("ideas", "Warm-up", "ideas", "Before the quiz",
                        "Think about these.",
                        "Then the real questions start.",
                        "Quiz time →",
                        List.of("Your smile", "Your kindness", "Your silly talks", "Everything")),
                p("game", "Quiz", "game", "Question time",
                        "Five questions. Pink buttons. No timer.",
                        "Find out what I love about you.",
                        "The reveal →"),
                p("love", "Reveal", "quiz", "Here's the truth",
                        "You are my favorite player.",
                        "Thanks for playing. The prize is this page.",
                        "Replay anytime →",
                        List.of("Did you have fun?", "Want a rematch?", "Do you know I like you a lot?"))
        );
    }

    private static List<SitePage> special() {
        return List.of(
                p("home", "Home", "home", "A little something special",
                        "A night-sky website, just because.",
                        "A few pages to open when you need a reminder that you are loved.",
                        "Open the letter →"),
                p("notes", "Letter", "notes", "You are my today",
                        "Tomorrow and always.",
                        "No matter where life takes us, I just want you to know I am so lucky to have you.",
                        "Keep these pictures →"),
                p("memories", "Memories", "memories", "Us under whatever sky",
                        "Soft photos. No caption needed, but I wrote some anyway.",
                        "Hold these when the day is loud.",
                        "Quiet questions →"),
                p("ideas", "Ideas", "ideas", "Things I still wonder",
                        "For a walk after dark.",
                        "You do not have to answer now.",
                        "A small game →",
                        List.of("What should we protect this year?", "What feels like home with me?", "What are you afraid to hope for?", "How do you want to be loved on hard days?")),
                p("game", "Game", "game", "A quiet path",
                        "Two gentle questions.",
                        "Then the forever line.",
                        "Forever →"),
                p("love", "Forever", "quiz", "Forever & always",
                        "Smile. This one is for you.",
                        "I made a whole website because a text was not enough.",
                        "Keep this star →",
                        List.of("Did this make you smile?", "Want this to be our secret?", "Forever — yes?"))
        );
    }

    private static SitePage p(String slug, String nav, String kind, String title, String subtitle, String body, String cta) {
        return p(slug, nav, kind, title, subtitle, body, cta, List.of());
    }

    private static SitePage p(String slug, String nav, String kind, String title, String subtitle, String body, String cta,
                              List<String> prompts) {
        return new SitePage(slug, nav, kind, title, subtitle, body, cta, prompts);
    }
}
