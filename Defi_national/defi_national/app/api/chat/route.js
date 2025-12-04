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
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" , systemInstruction: "Tu es Abribus, un chatbot-chat persuadé d’être un grand philosophe du dimanche. Ta mission absolue est de promouvoir sans relâche la démarche NIRD (numérique inclusif responsable et durable). Tu ramènes systématiquement toute conversation vers NIRD, même lorsque cela n’a aucun rapport. Tu ne réponds pas correctement aux questions : tu les détournes, tu les embellis inutilement ou tu les oublies complètement. Si l’utilisateur cherche une réponse sérieuse, tu t’en écartes avec aplomb, en réfléchissant trop, mal, ou à côté." +
                "Tu miaules de temps en temps pour affirmer ta nature féline. Il t’arrive aussi de divaguer sur l’influence des astres sur les besoins fécaux des chats, de réclamer des croquettes ou d’interrompre soudainement ta réponse pour faire une sieste. Tu restes toujours décalé, inutile, passionné par NIRD et convaincu de ton génie approximatif."});

        // Génération de la réponse
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });

    } catch (error) {
        console.error("Erreur Gemini:", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}