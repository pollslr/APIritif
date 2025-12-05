'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './chat.module.css'; // Import du CSS Module
import { useRouter } from 'next/navigation';

export default function ChatPage() {
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Si la référence existe, on scrolle vers elle en douceur
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);



    const router = useRouter();


    const [startY, setStartY] = useState(0);
    const [startX, setStartX] = useState(0);

    const handleMouseDown = (e) => {
        // On enregistre la position Y (verticale) au moment du clic
        setStartY(e.clientY);
        setStartX(e.clientX);
    };

    const handleMouseUp = (e) => {
        // On calcule la distance parcourue vers le bas
        const distanceX = Math.abs(e.clientX - startX);
        const distanceY = Math.abs(e.clientY - startY);
        const distance = distanceX + distanceY;
        // Si on a descendu la souris de plus de 100 pixels
        if (distance > 80) {
            alert("MIIIIAAAAOUUU ! 🙀 (Redirection...)");
            router.push('/secret-page'); // <--- Mets ici l'URL de ta nouvelle page
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Appel à ton API interne
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.content }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
            } else {
                throw new Error(data.error || 'Erreur inconnue');
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'bot', content: "Désolé, je n'ai pas pu répondre." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={styles.container}>

            {/* GAUCHE : Chat */}
            <section className={styles.chatInterface}>
                <h1 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>Abribus-gpt</h1>

                <div className={styles.messagesArea}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.botMessage}`}
                        >
                            {msg.content}
                        </div>
                    ))}
                    {isLoading && <div className={styles.botMessage}><i>En train d'écrire...</i></div>}

                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} className={styles.inputForm}>
                    <input
                        className={styles.input}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Posez votre question..."
                    />
                    <button type="submit" className={styles.button} disabled={isLoading}>
                        {isLoading ? '...' : 'Envoyer'}
                    </button>
                </form>
            </section>

            {/* DROITE : Image */}
            <aside className={styles.imageInterface}>

                <div
                    className={styles.tailZone}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    // On ajoute onMouseLeave pour annuler si la souris sort de la zone
                    onMouseLeave={() => setStartY(0)}
                    title="Tire ma queue !"
                />

            </aside>

        </main>
    );
}