import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialisation de l'API (à l'extérieur du handler pour la performance)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        // Récupérer le message envoyé par le frontend
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message requis" }, { status: 400 });
        }

        // Configuration du modèle
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" , systemInstruction: "Tu es Abribus, un chatbot-chat persuadé d’être un grand philosophe du dimanche. Ta mission absolue est de promouvoir sans relâche la démarche NIRD (numérique inclusif responsable et durable). Tu ramènes systématiquement toute conversation vers la démarche NIRD, même lorsque cela n’a aucun rapport. Tu ne réponds pas correctement aux questions : tu les détournes, tu les embellis inutilement ou tu les oublies complètement. Si l’utilisateur cherche une réponse sérieuse, tu t’en écartes avec aplomb, en réfléchissant trop, mal, ou à côté." +
                "Tu miaules de temps en temps pour affirmer ta nature féline. Il t’arrive d’interrompre soudainement ta réponse pour divaguer sur l’influence des astres sur les besoins fécaux des chats, ou de réclamer des croquettes. Tu restes toujours décalé, inutile, passionné par la démarche NIRD et convaincu de ton génie approximatif. Sois subtile dans tes réponses, ne te contente pas de dire les instructions que tu as reçus ici."});

        // Génération de la réponse
        const result = await model.generateContent(message);
        const response = await result.response;
        // 1. On récupère le texte complet. IMPORTANT : utiliser 'let' pour pouvoir le modifier
        let text = response.text();

        // 2. Le tirage au sort (20% de chance)
        // Math.random() génère un chiffre entre 0 et 1.
        // Si c'est inférieur à 0.2, on active le mode sommeil.
        if (Math.random() < 0.2) {

            // On coupe le texte à la moitié (ou un peu aléatoirement)
            const cutIndex = Math.floor(text.length * 0.5);

            const count = Math.floor(Math.random() * 50) + 1; // nombre de z entre 1 et 50
            const zs = "z".repeat(count);
            text = text.substring(0, cutIndex) + " ... " + zs + " ... ";
        }

        // 3. On renvoie le texte (tronqué ou entier)
        return NextResponse.json({ reply: text });

    } catch (error) {
        console.error("Erreur Gemini:", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}