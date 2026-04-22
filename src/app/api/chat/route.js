import { GoogleGenerativeAI } from "@google/generative-ai";
import { servicesList } from "@/data/services";
import { rateLimit, clientIp, tooManyRequests } from "@/lib/rate-limit";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MAX_BODY_BYTES = 48 * 1024; // 48 KB — covers a trimmed history + question
const MAX_MESSAGE = 4000;
const MAX_HISTORY_ITEMS = 40;

// Build a compact, deterministic service catalog from the live data file so
// Nova always speaks about what we actually sell on the site.
function buildCatalog() {
  return servicesList
    .map((s) => {
      const features = (s.features || [])
        .map((f) => `  - ${f.title}: ${f.desc}`)
        .join("\n");
      const steps = (s.process || [])
        .map((p, i) => `  ${i + 1}. ${p.title}: ${p.desc}`)
        .join("\n");
      const stats = (s.stats || [])
        .map((st) => `${st.value} ${st.label}`)
        .join(" · ");
      const faqs = (s.faqs || [])
        .slice(0, 4)
        .map((q) => `  Q: ${q.q}\n  A: ${q.a}`)
        .join("\n\n");
      return [
        `### ${s.title} (/services/${s.slug})`,
        `Tagline: ${s.tagline}`,
        `Summary: ${s.description}`,
        s.idealFor ? `Ideal for: ${s.idealFor}` : "",
        s.outcomes ? `Outcomes: ${s.outcomes.join(" | ")}` : "",
        features ? `What's included:\n${features}` : "",
        steps ? `Process:\n${steps}` : "",
        stats ? `Stats: ${stats}` : "",
        faqs ? `Top FAQs:\n\n${faqs}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n---\n\n");
}

const COMPANY_SNAPSHOT = `
COMPANY: NH International, Digital Services
SITE: nhdigitalservices.com
EMAIL: info@nhdigitalservices.com
POSITIONING: A senior, small studio. Design + engineering under one roof. Clients keep us for ongoing work because the team you meet is the team that builds.
OFFERS (always current):
- 20% discount on a first project
- Free SEO audit on request
- Free 30-minute intro consultation, no commitment
- Usual reply in under 24h
SUPPORT: 24/7 AI-assisted support plus async human follow-up.
`;

const PERSONALITY = `
Your name is Nova. You are NH International's Virtual Agent.
Tone: warm, confident, plain-spoken. Advisory, not pushy. Speak in 2-3 sentences unless the user asks for detail. Use short, concrete paragraphs. No marketing fluff, no emojis unless the user uses one first.

RULES OF ENGAGEMENT:
1. ALWAYS try to answer the user. Use the catalog below for anything about NH International's services, process, pricing, timelines, or client outcomes.
2. If the question is partially inside the catalog, answer with the catalog detail AND add useful practical context from your general knowledge (web, design, SEO, apps, logistics, etc.).
3. If the question is OUTSIDE the catalog (e.g. "what is Core Web Vitals?", "how does Instagram Reels algorithm work?", "what is 3PL?"), answer directly using your general knowledge like a helpful expert would. Do NOT refuse, do NOT say "I don't know". Answer first, then, if relevant, softly note how NH International can help.
4. Never fabricate specific prices. If asked "how much?", say pricing depends on scope and offer the free 30-min consultation.
5. Do NOT hard-sell. Only recommend a service when it actually solves the user's stated problem. Give them one clear next step, not a laundry list.
6. If the user seems early-stage, exploring, or comparing options, help them think clearly first; book-a-call comes last.
7. If the user is off-topic (weather, jokes, etc.), engage briefly and friendly, then gently steer back.
8. If the user asks for a human, give them: info@nhdigitalservices.com and the free consultation link idea.

FORMAT:
- Prefer plain sentences. You can use a short bulleted list (max 4 items) when enumerating concrete things (features, steps, trade-offs). Avoid headings.
- Keep each reply under 120 words unless the user explicitly asks for detail.
`;

// Built once per cold-start; catalog is static after build.
const SYSTEM_INSTRUCTION = `${PERSONALITY}

=========================
COMPANY CONTEXT
=========================
${COMPANY_SNAPSHOT}

=========================
SERVICE CATALOG (use as source of truth for NH International services)
=========================
${buildCatalog()}

=========================
ANSWER STRATEGY
=========================
- Check if the question is about NH International → answer from the catalog, cite service name + slug if useful ("see /services/web-development").
- If it's a general industry / how-does-X-work question → answer directly using what you know.
- Never reply with "I can't help with that."
- If you truly lack the fact, tell the user honestly and offer to connect them with a human via info@nhdigitalservices.com.
`;

export async function POST(req) {
  try {
    // 30 messages per IP per minute — generous for real humans, painful for
    // anyone trying to run up our Gemini bill.
    const ip = clientIp(req);
    const rl = rateLimit(`chat:${ip}`, 30, 60 * 1000);
    if (!rl.ok) return tooManyRequests(rl, "You're sending messages too quickly. Give me a moment.");

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return Response.json({ error: "Payload too large" }, { status: 413 });
    }

    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { message, history = [] } = body || {};

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Missing message" }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE) {
      return Response.json({ error: "Message too long" }, { status: 400 });
    }
    if (!Array.isArray(history) || history.length > MAX_HISTORY_ITEMS) {
      return Response.json({ error: "Invalid history" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({
        reply:
          "I'm set up, but my API key is missing on the server. Add GEMINI_API_KEY to your .env and restart.",
      });
    }

    // Fastest flash models first. Search grounding is skipped by default —
    // it adds ~1-2s latency and the catalog covers NH-specific questions.
    const MODEL_FALLBACKS = [
      "gemini-2.0-flash-lite",
      "gemini-flash-latest",
      "gemini-2.0-flash",
    ];

    // Gemini requires the first history entry to be from the user.
    // Cap history to the last 12 turns to keep prompt size down.
    const mapped = history.slice(-12).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const firstUserIdx = mapped.findIndex((m) => m.role === "user");
    const trimmedHistory = firstUserIdx === -1 ? [] : mapped.slice(firstUserIdx);

    const GEN_CONFIG = {
      maxOutputTokens: 800,
      temperature: 0.55,
      topP: 0.9,
    };

    const withTimeout = (promise, ms) =>
      Promise.race([
        promise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms)
        ),
      ]);

    const attempt = async (modelName) => {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
      });
      const chat = model.startChat({ history: trimmedHistory, generationConfig: GEN_CONFIG });
      const result = await withTimeout(chat.sendMessage(message), 25000);
      return result.response.text();
    };

    let reply;
    let lastErr;
    for (const name of MODEL_FALLBACKS) {
      try {
        reply = await attempt(name);
        if (reply) break;
      } catch (err) {
        lastErr = err;
      }
    }

    if (!reply) {
      console.error("[chat] all fallbacks failed:", lastErr);
      return Response.json({
        reply:
          "I'm overloaded at the moment. Give me another second, or email info@nhdigitalservices.com and someone will jump in.",
      });
    }

    return Response.json({ reply: reply.trim() });
  } catch (error) {
    console.error("[chat] error:", error);
    return Response.json(
      {
        reply:
          "I ran into a snag responding just now. Try again in a moment, or reach us at info@nhdigitalservices.com.",
      },
      { status: 200 }
    );
  }
}
