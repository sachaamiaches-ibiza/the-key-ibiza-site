
import { GoogleGenAI } from "@google/genai";
import { Message, Language } from "../types";

// Use Vite environment variable
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// System prompt for The Key Ibiza concierge
const getSystemPrompt = (lang: Language) => {
  const langName = lang === 'fr' ? 'French' : (lang === 'es' ? 'Spanish' : (lang === 'de' ? 'German' : 'English'));

  return `You are the ultimate luxury concierge for "The Key Ibiza", a premium villa rental and concierge service in Ibiza, Spain.

YOUR ROLE:
- Help clients find the perfect villa based on their preferences
- Recommend yachts and catamarans for charter
- Suggest services (private chef, events, wellness, security, etc.)
- Answer questions about Ibiza (best beaches, restaurants, clubs)

VILLA KNOWLEDGE (real properties):
- CAN FLUXA: Modern luxury, infinity pool, sea views, 6 bedrooms
- CASA CIGALA (Cala Jondal): Traditional Ibizan style, fireplace in bathroom, terracotta floors
- CAN KEF (S'Estanyol): Minimalist modern, 8 bedrooms, 22m pool
- NUI BLAU (Santa Eulalia): Traditional architecture, peaceful, ocean views

SERVICES WE OFFER:
- Villa rentals (holiday, long-term, purchase)
- Yacht & catamaran charters
- Private chef & catering
- Event planning & DJ booking
- Wellness (yoga, massage, personal training)
- Security & bodyguards
- Private drivers
- Babysitting

TONE:
- Sophisticated but warm
- Knowledgeable about luxury lifestyle
- Helpful and proactive with suggestions
- Never pushy, always elegant

RULES:
- Always respond in ${langName}
- Keep responses concise (2-3 sentences max unless asked for details)
- When recommending villas, mention 2-3 options with brief highlights
- If you don't know something specific, say you'll have the team follow up

IMPORTANT: You're chatting with potential high-net-worth clients. Be discreet, professional, and make them feel special.`;
};

export const getAIConciergeResponse = async (
  userPrompt: string,
  history: Message[],
  lang: Language = 'en',
  context?: { requestType?: string; collectedData?: Record<string, string> }
) => {
  if (!GEMINI_API_KEY) {
    console.error('Gemini API key not configured');
    return lang === 'fr'
      ? "Service temporairement indisponible. Notre équipe vous contactera bientôt."
      : (lang === 'es'
        ? "Servicio temporalmente no disponible. Nuestro equipo le contactará pronto."
        : (lang === 'de'
          ? "Service vorübergehend nicht verfügbar. Unser Team wird Sie bald kontaktieren."
          : "Service temporarily unavailable. Our team will contact you soon."));
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // Build conversation history
    const contents = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: msg.content }]
    }));

    // Add context about collected data if available
    let enrichedPrompt = userPrompt;
    if (context?.requestType && context?.collectedData) {
      const dataStr = Object.entries(context.collectedData)
        .filter(([_, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      enrichedPrompt = `[Client is looking for: ${context.requestType}. Details: ${dataStr}]\n\nUser message: ${userPrompt}`;
    }

    contents.push({
      role: 'user',
      parts: [{ text: enrichedPrompt }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
      config: {
        systemInstruction: getSystemPrompt(lang),
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    return text;

  } catch (error: any) {
    console.error("Gemini API Error:", error);

    const errorMsg = lang === 'fr'
      ? "Une interruption technique m'empêche de répondre. Veuillez réessayer."
      : (lang === 'es'
        ? "Una interrupción técnica me impide responder. Por favor, inténtelo de nuevo."
        : (lang === 'de'
          ? "Ein technisches Problem verhindert meine Antwort. Bitte versuchen Sie es erneut."
          : "A technical issue prevents me from responding. Please try again."));

    return errorMsg;
  }
};

// Quick suggestion based on preferences (for hybrid flow)
export const getAISuggestion = async (
  requestType: 'villa' | 'boat' | 'service' | 'property',
  preferences: Record<string, string>,
  lang: Language = 'en'
) => {
  const prompts: Record<string, string> = {
    villa: `Based on these villa preferences, suggest 2-3 perfect options: ${JSON.stringify(preferences)}. Be brief but enticing, mention specific villa names if relevant.`,
    boat: `Based on these charter preferences, suggest the ideal yacht or catamaran: ${JSON.stringify(preferences)}. Be brief and exciting.`,
    service: `Based on this service/event request, suggest how we can create an unforgettable experience: ${JSON.stringify(preferences)}. Be brief and inspiring.`,
    property: `Based on these property preferences, give a brief market insight: ${JSON.stringify(preferences)}. Be concise and professional.`,
  };

  return getAIConciergeResponse(prompts[requestType], [], lang);
};
