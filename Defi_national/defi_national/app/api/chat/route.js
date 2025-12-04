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
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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