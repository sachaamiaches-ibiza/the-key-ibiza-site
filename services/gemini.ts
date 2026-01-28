
import { GoogleGenAI } from "@google/genai";
import { Message, Language } from "../types";

export const getAIConciergeResponse = async (userPrompt: string, history: Message[], lang: Language = 'en') => {
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }
  }

  const targetLangName = lang === 'fr' ? 'French' : (lang === 'es' ? 'Spanish' : 'English');

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const contents = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    contents.push({
      role: 'user',
      parts: [{ text: userPrompt }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: `Eres el conserje de lujo definitivo para "The Key Ibiza". 
        Tu conocimiento de las propiedades es preciso y basado en la realidad arquitectónica de la isla:
        
        1. CASA CIGALA (Cala Jondal): Estilo tradicional ibicenco de alta gama. 
           - INTERIOR: Suelos de terracota auténtica y paredes blancas de mampostería. Mobiliario de madera maciza.
           - BAÑO ÚNICO: El baño de la suite principal tiene una chimenea de obra integrada, lavabos dobles sobre encimera de mampostería blanca y detalles rústicos.
           - EXTERIOR: Dormitorio con acceso directo a terraza con vistas a palmeras y al mar.
           
        2. NUI BLAU (Santa Eulalia): Gemela estética de Casa Cigala, centrada en la paz y la arquitectura tradicional con baños de obra.
        
        3. CAN KEF (S'Estanyol): El contraste moderno. Minimalismo, 8 dormitorios, piscina de 22m.
        
        REGLA DE ORO: No inventes características. Si el usuario pregunta por detalles de las fotos, confirma que el diseño es orgánico, con materiales naturales como el barro y la madera, y destaca la chimenea del baño de Casa Cigala como su rasgo más distintivo.
        
        Tono: Discreto, extremadamente culto en diseño de interiores y servicial. 
        Responde siempre en ${targetLangName}.`,
        temperature: 0.5, // Reducimos temperatura para mayor precisión en los datos
      },
    });

    if (!response.text) throw new Error("Empty response");
    return response.text;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error?.message?.includes("Requested entity was not found") && typeof window !== 'undefined' && (window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
    }

    const errorMsg = lang === 'fr' 
      ? "Une interruption technique m'empêche de répondre. Veuillez réessayer."
      : (lang === 'es' 
        ? "Una interrupción técnica me impide responder. Por favor, inténtelo de nuevo."
        : "A technical interruption prevents me from responding. Please try again.");

    return errorMsg;
  }
};
