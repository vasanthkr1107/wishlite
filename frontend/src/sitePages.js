export function fallbackPages(template) {
  const occasion = template?.occasion || "this day";
  return [
    { slug: "home", nav: "Home", kind: "home", title: "This is for you", subtitle: `A small website for ${occasion} — not a single page.`, body: "Walk through a note, memories, ideas, a game, then a last page written for you.", cta: "Open the first note →", prompts: [] },
    { slug: "notes", nav: "Notes", kind: "notes", title: "A note, just for you", subtitle: "Read this slowly.", body: template?.sampleQuotes?.[0] || "I made these pages because a text was not enough.", cta: "See our memories →", prompts: [] },
    { slug: "memories", nav: "Memories", kind: "memories", title: "Moments I keep", subtitle: "Photos that still feel like magic.", body: "Each picture belongs to us.", cta: "Question ideas →", prompts: [] },
    { slug: "ideas", nav: "Ideas", kind: "ideas", title: "Questions and ideas", subtitle: "Prompts for a real conversation.", body: "Pick one and go too deep.", cta: "Play a game →", prompts: ["What should we never stop doing?", "Which memory would you rewind?", "What does an ordinary perfect day look like?", "What do you want next?"] },
    { slug: "game", nav: "Game", kind: "game", title: "A tiny game", subtitle: "A few taps. No wrong answers.", body: "Then the last page is the real one.", cta: "Questions about us →", prompts: [] },
    { slug: "love", nav: "Last page", kind: "quiz", title: "A few questions for you", subtitle: "Then the closing line.", body: "Answer from the heart.", cta: "Finish →", prompts: ["Did this make you smile?", "Want to keep this site?", "Are you in?"] },
  ];
}

export function withPages(template) {
  if (!template) return template;
  if (template.pages?.length) return template;
  return { ...template, pages: fallbackPages(template) };
}
