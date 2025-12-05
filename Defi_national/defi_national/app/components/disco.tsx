'use client'

import {useEffect, useRef, useState} from "react";

export default function Disco() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const animationIdRef = useRef<number>(0);
    
    const [mode, setMode] = useState<number>(0);

    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAudio, setCurrentAudio] = useState("/audio/son1.mp3");

    const audioList = [
        { name: "Son 1", path: "/audio/son1.mp3" },
        { name: "Son 2", path: "/audio/son2.mp3" },
    ];
    
    useEffect(() => {
        if (!audioRef.current) return;

        let audioCtx: AudioContext | null = null;
        let source: MediaElementAudioSourceNode | null = null;
        let analyserNode: AnalyserNode | null = null;

        try {
            audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            source = audioCtx.createMediaElementSource(audioRef.current);
            analyserNode = audioCtx.createAnalyser();
            analyserNode.fftSize = 2048;
            analyserNode.smoothingTimeConstant = 0.8;
            source.connect(analyserNode);
            analyserNode.connect(audioCtx.destination);

            const data = new Uint8Array(analyserNode.frequencyBinCount);
            setDataArray(data);
            setAnalyser(analyserNode);
        } catch (error) {
            console.error("Erreur AudioContext:", error);
        }

        return () => {
            try {
                if (source) source.disconnect();
                if (analyserNode) analyserNode.disconnect();
                if (audioCtx) audioCtx.close();
            } catch (error) {
                console.error("Erreur nettoyage:", error);
            }
        };
    }, [currentAudio]);
    
    // Disco 1
    useEffect(() => {
        if (mode != 0) return;
        
        if (!canvasRef.current || !analyser || !dataArray) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Particules pour créer les traînées fluides
        interface FluidParticle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            life: number;
            maxLife: number;
            hue: number;
            size: number;
        }

        const particles: FluidParticle[] = [];
        const maxParticles = 500;

        const draw = () => {
            animationIdRef.current = requestAnimationFrame(draw);

            if (!analyser || !dataArray) return;
            analyser.getByteFrequencyData(dataArray as Uint8Array<ArrayBuffer>);

            // Fond avec traînée très légère pour effet fluide
            ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Nombre de rayons basé sur les fréquences
            const numRays = 180;

            let maxFreq = 0
            for (let i = 0; i < numRays; i++) {
                const freqIndex = Math.floor((i / numRays) * dataArray.length);
                const amplitude = (dataArray[freqIndex] / 255) * Math.max(i / (numRays/3), 0.3);
                if (amplitude > 0) {
                    maxFreq = freqIndex;
                }
            }
            //maxFreq = Math.max(maxFreq, 1);
            
            const angleStep = (Math.PI * (8 * (255 / maxFreq))) / numRays;

            // Dessiner les rayons fluides depuis le centre
            for (let i = 0; i < numRays; i++) {
                const angle = i * angleStep;

                // Mapper chaque rayon à une fréquence
                const freqIndex = Math.floor((i / numRays) * dataArray.length);
                const amplitude = (dataArray[freqIndex] / 255) * Math.max(i / (numRays/3), 0.5);

                if (amplitude < 0.05) continue; // Ne pas dessiner si amplitude trop faible

                // Calculer la longueur du rayon
                const minLength = 30;
                const maxLength = Math.min(canvas.width, canvas.height) * 0.4;
                const length = minLength + amplitude * maxLength;

                // Position de fin du rayon
                const endX = centerX + Math.cos(angle) * length;
                const endY = centerY + Math.sin(angle) * length;

                // Couleur basée sur la fréquence
                const hue = (i / numRays) * 360;
                const saturation = 70 + amplitude * 30;
                const brightness = 40 + amplitude * 40;

                // Dessiner le rayon principal avec dégradé
                const gradient = ctx.createLinearGradient(centerX, centerY, endX, endY);
                gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${brightness + 20}%, 0.1)`);
                gradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${brightness}%, ${amplitude * 0.5})`);
                gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${brightness - 10}%, ${amplitude * 0.8})`);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2 + amplitude * 4;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                // Créer des particules fluides qui suivent les rayons (seulement si en lecture)
                if (isPlaying && amplitude > 0.3 && Math.random() < 0.3) {
                    const particleDistance = minLength + Math.random() * length;
                    particles.push({
                        x: centerX + Math.cos(angle) * particleDistance,
                        y: centerY + Math.sin(angle) * particleDistance,
                        vx: Math.cos(angle) * amplitude * 3,
                        vy: Math.sin(angle) * amplitude * 3,
                        life: 1,
                        maxLife: 30 + Math.random() * 40,
                        hue: hue,
                        size: 2 + amplitude * 6
                    });
                }
            }

            // Dessiner le blob central petit et lumineux
            const avgAmplitude = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length / 255;
            const blobRadius = 15 + avgAmplitude * 25;

            // Créer plusieurs couches pour le blob central
            for (let layer = 0; layer < 5; layer++) {
                const layerRadius = blobRadius * (1 + layer * 0.3);
                const layerAlpha = 0.3 / (layer + 1);

                const blobGradient = ctx.createRadialGradient(
                    centerX, centerY, 0,
                    centerX, centerY, layerRadius
                );

                const centerHue = (Date.now() * 0.05) % 360;
                blobGradient.addColorStop(0, `hsla(${centerHue}, 100%, 90%, ${layerAlpha * 2})`);
                blobGradient.addColorStop(0.5, `hsla(${(centerHue + 60) % 360}, 100%, 70%, ${layerAlpha})`);
                blobGradient.addColorStop(1, `hsla(${(centerHue + 120) % 360}, 100%, 50%, 0)`);

                ctx.fillStyle = blobGradient;
                ctx.beginPath();
                ctx.arc(centerX, centerY, layerRadius, 0, Math.PI * 2);
                ctx.fill();
            }

            // Mettre à jour et dessiner les particules fluides
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];

                if (isPlaying) {
                    // Mouvement avec inertie
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vx *= 0.95; // Friction
                    p.vy *= 0.95;
                    p.life--;
                }

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                const alpha = (p.life / p.maxLife) * 0.6;

                ctx.save();
                ctx.shadowBlur = 10;
                ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, ${alpha})`;
                ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // Limiter le nombre de particules
            while (particles.length > maxParticles) {
                particles.shift();
            }

            // Ajouter des ondes circulaires synchronisées avec les basses
            const bassRange = Math.floor(dataArray.length * 0.1);
            let bassLevel = 0;
            for (let i = 0; i < bassRange; i++) {
                bassLevel += dataArray[i];
            }
            bassLevel = (bassLevel / bassRange) / 255;

            if (isPlaying && bassLevel > 0.3) {
                const numWaves = 3;
                for (let i = 0; i < numWaves; i++) {
                    const waveRadius = blobRadius + (i + 1) * 40 * bassLevel;
                    const waveAlpha = (1 - i / numWaves) * bassLevel * 0.4;

                    ctx.strokeStyle = `hsla(${(Date.now() * 0.1 + i * 60) % 360}, 80%, 60%, ${waveAlpha})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        };

        draw();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            window.removeEventListener("resize", handleResize);
        };
    }, [mode, analyser, dataArray, isPlaying]);
    
    // Disco 2
    useEffect(() => {
        if (mode != 1) return;
        
        if (!canvasRef.current || !analyser || !dataArray) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let time = 0;
        const centerY = canvas.height / 2;

        // Nombre de lignes côte à côte
        const numLines = 10;
        const lineSpacing = 6;

        // Historique des amplitudes pour chaque ligne (profondeur 3D)
        const historyLength = 5;
        const linesHistory: number[][][] = [];

        for (let line = 0; line < numLines; line++) {
            const lineHistory: number[][] = [];
            for (let i = 0; i < historyLength; i++) {
                lineHistory.push(new Array(128).fill(0));
            }
            linesHistory.push(lineHistory);
        }

        // Fonction pour dessiner une ligne ondulée sinusoïdale en 3D
        const drawLine = (
            amplitudes: number[],
            zIndex: number,
            totalDepth: number,
            lineIndex: number,
            xOffset: number
        ) => {
            const numPoints = amplitudes.length;

            // Perspective 3D
            const scale = 0.6 + (zIndex / totalDepth) * 0.4;
            const yOffset = (totalDepth - zIndex) * 4;
            const alpha = 0.35 + (zIndex / totalDepth) * 0.55;

            const depthShift = zIndex * 10;  // Ajuste → plus grand = plus espacé

            // Calculer tous les points avec interpolation pour courbes ultra-lisses
            const points: Array<{x: number, y: number}> = [];

            for (let i = 0; i < numPoints; i++) {
                const x = (i / (numPoints - 1)) * canvas.width;
                const amplitude = amplitudes[i] || 0;

                // Onde audio
                const smoothedAmplitude = amplitude * 200 * scale;
                const audioWave = Math.sin(smoothedAmplitude * 0.05) * smoothedAmplitude;

                // Onde douce secondaire
                const wave2 = Math.sin((i / numPoints) * Math.PI * 0.8) * 20;

                // --- FIX: ajout du xOffset + depthShift ---
                const y = centerY + xOffset + audioWave + wave2;

                points.push({x, y});
            }

            // Interpolation Catmull-Rom pour des courbes ultra-fluides
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            for (let i = 0; i < points.length - 1; i++) {
                const p0 = points[Math.max(0, i - 1)];
                const p1 = points[i];
                const p2 = points[i + 1];
                const p3 = points[Math.min(points.length - 1, i + 2)];

                // Créer plusieurs points intermédiaires pour des courbes ultra-lisses
                const segments = 8;
                for (let t = 0; t < segments; t++) {
                    const tt = t / segments;
                    const tt2 = tt * tt;
                    const tt3 = tt2 * tt;

                    // Formule Catmull-Rom pour des courbes parfaitement lisses
                    const q0 = -tt3 + 2 * tt2 - tt;
                    const q1 = 3 * tt3 - 5 * tt2 + 2;
                    const q2 = -3 * tt3 + 4 * tt2 + tt;
                    const q3 = tt3 - tt2;

                    const x = 0.5 * (p0.x * q0 + p1.x * q1 + p2.x * q2 + p3.x * q3);
                    const y = 0.5 * (p0.y * q0 + p1.y * q1 + p2.y * q2 + p3.y * q3);

                    ctx.lineTo(x, y);
                }
            }

            // Gradient de couleur entre bleu (200°) et violet (280°)
            const hueRange = 80; // De 200° (bleu) à 280° (violet)
            const hue = 200 + (lineIndex / numLines) * hueRange;
            const saturation = 90;
            const lightness = 55 + (zIndex / totalDepth) * 20;

            ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
            ctx.lineWidth = 1.8;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Glow visible avec la couleur correspondante
            ctx.shadowBlur = 12;
            ctx.shadowColor = `hsla(${hue}, 100%, 65%, ${alpha * 0.7})`;

            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const draw = () => {
            animationIdRef.current = requestAnimationFrame(draw);

            if (!analyser || !dataArray) return;
            analyser.getByteFrequencyData(dataArray as Uint8Array<ArrayBuffer>);

            if (isPlaying) {
                time += 0.02;
            }

            // Fond noir pur
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Réduire les données audio à 100 points (au lieu de 128 pour optimiser)
            const reducedData: number[] = [];
            const step = Math.floor(dataArray.length / 100);
            for (let i = 0; i < 100; i++) {
                let sum = 0;
                for (let j = 0; j < step; j++) {
                    sum += dataArray[i * step + j];
                }
                reducedData.push((sum / step) / 255);
            }

            // Dessiner toutes les lignes (optimisé)
            for (let lineIdx = 0; lineIdx < numLines; lineIdx++) {
                // Calculer le décalage vertical pour cette ligne
                const ySpread = (lineIdx - numLines / 2) * lineSpacing;

                // Lissage exponentiel léger + historique
                const lineData = reducedData.map((val, i) => {
                    const prev = linesHistory[lineIdx][historyLength - 1][i] || 0;
                    const smoothed = prev * 0.75 + val * 0.25; // Lissage stable

                    return smoothed;
                });

                // Mettre à jour l'historique pour cette ligne
                if (isPlaying) {
                    linesHistory[lineIdx].shift();
                    linesHistory[lineIdx].push([...lineData]);
                }

                // Dessiner toutes les couches de profondeur pour cette ligne (de l'arrière vers l'avant)
                for (let depth = 0; depth < historyLength; depth++) {
                    drawLine(
                        linesHistory[lineIdx][depth],
                        depth,
                        historyLength,
                        lineIdx,
                        ySpread
                    );
                }
            }

            // Ajouter un effet de vignette subtil
            const vignetteGradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, canvas.width * 0.2,
                canvas.width / 2, canvas.height / 2, canvas.width * 0.7
            );
            vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');

            ctx.fillStyle = vignetteGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        draw();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            window.removeEventListener("resize", handleResize);
        };
    }, [mode, analyser, dataArray, isPlaying]);
    
    // Disco 3
    useEffect(() => {
        if (mode != 2) return;

        if (!canvasRef.current || !analyser || !dataArray) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Configuration
        const numWaves = 3;
        const baseRadius = 110; // Plus proche du centre
        const waveSpacing = 3; // Espacement très réduit
        const numBars = 120; // 120 barres distinctes à 360°
        const barWidth = (Math.PI * 2) / numBars * 0.85; // Largeur de chaque barre avec espacement
        const amplificationFactor = 320; // ULTRA amplification

        const draw = () => {
            animationIdRef.current = requestAnimationFrame(draw);

            if (!analyser || !dataArray) return;
            analyser.getByteFrequencyData(dataArray as Uint8Array<ArrayBuffer>);

            // Fond gradient sombre
            const bgGradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, Math.max(canvas.width, canvas.height) * 0.7
            );
            bgGradient.addColorStop(0, "#1a0a2e");
            bgGradient.addColorStop(0.5, "#0f0520");
            bgGradient.addColorStop(1, "#000000");
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Calculer les BASSES
            const bassRange = Math.floor(dataArray.length * 0.15);
            let bassLevel = 0;
            for (let i = 0; i < bassRange; i++) {
                bassLevel += dataArray[i];
            }
            bassLevel = (bassLevel / bassRange) / 255;

            // Dessiner chaque vague avec BARRES DISSOCIABLES
            for (let wave = 0; wave < numWaves; wave++) {
                const waveProgress = wave / (numWaves - 1);
                const currentRadius = baseRadius + wave * waveSpacing;

                // Dessiner chaque BARRE individuellement (pas de ligne continue)
                for (let i = 0; i < numBars; i++) {
                    const angle = (i / numBars) * Math.PI * 2;

                    // Utiliser les BASSES fréquences, répétées sur 360°
                    const bassFreqIndex = Math.floor((i / numBars) * bassRange);
                    const rawAmplitude = dataArray[bassFreqIndex] / 255;

                    // AMPLIFICATION MASSIVE
                    const amplifiedValue = Math.pow(rawAmplitude, 0.35) * amplificationFactor;

                    // Calculer la hauteur de la barre
                    const barHeight = amplifiedValue;
                    const innerRadius = currentRadius;
                    const outerRadius = currentRadius + barHeight;

                    // Ne dessiner que si amplitude significative
                    if (rawAmplitude > 0.02) {
                        // Créer le gradient de couleur pour la barre
                        const baseHue = 270 - waveProgress * 90;
                        const hueVariation = (i / numBars) * 60; // Variation de couleur autour du cercle
                        const hue = baseHue + hueVariation;

                        const saturation = 85 + waveProgress * 15;
                        const lightness = 50 + waveProgress * 20 + rawAmplitude * 30;
                        const alpha = 0.7 + rawAmplitude * 0.3;

                        // Dessiner la BARRE comme un segment de cercle
                        ctx.save();
                        ctx.translate(centerX, centerY);
                        ctx.rotate(angle - barWidth / 2);

                        // Créer le chemin de la barre
                        ctx.beginPath();
                        ctx.arc(0, 0, innerRadius, 0, barWidth);
                        ctx.arc(0, 0, outerRadius, barWidth, 0, true);
                        ctx.closePath();

                        // Remplissage avec gradient radial
                        const gradient = ctx.createRadialGradient(0, 0, innerRadius, 0, 0, outerRadius);
                        gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness - 10}%, ${alpha * 0.5})`);
                        gradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`);
                        gradient.addColorStop(1, `hsla(${hue}, ${saturation + 15}%, ${lightness + 20}%, ${alpha * 0.9})`);

                        ctx.fillStyle = gradient;
                        ctx.shadowBlur = 15 + rawAmplitude * 25;
                        ctx.shadowColor = `hsla(${hue}, 100%, 70%, ${alpha * 0.8})`;
                        ctx.fill();

                        // Bordure lumineuse sur le bout de la barre
                        ctx.strokeStyle = `hsla(${hue}, 100%, ${lightness + 25}%, ${alpha})`;
                        ctx.lineWidth = 1.5;
                        ctx.shadowBlur = 20;
                        ctx.beginPath();
                        ctx.arc(0, 0, outerRadius, 0, barWidth);
                        ctx.stroke();

                        ctx.restore();
                    }
                }
            }

            // Dessiner le cercle central PLUS PETIT qui pulse avec les basses
            const centralRadius = 60 + bassLevel * 70; // Cercle plus petit, pulse fort

            // Glow massif avec les basses
            if (bassLevel > 0.05) {
                for (let layer = 8; layer > 0; layer--) {
                    const layerRadius = centralRadius + layer * 25;
                    const layerAlpha = (0.3 / layer) * (1 + bassLevel * 2.5);

                    const centralGradient = ctx.createRadialGradient(
                        centerX, centerY, centralRadius * 0.5,
                        centerX, centerY, layerRadius
                    );

                    const glowHue = (Date.now() * 0.04) % 360;
                    centralGradient.addColorStop(0, `hsla(${glowHue}, 100%, 80%, ${layerAlpha * 3.5})`);
                    centralGradient.addColorStop(0.4, `hsla(${(glowHue + 40) % 360}, 100%, 70%, ${layerAlpha * 2.5})`);
                    centralGradient.addColorStop(1, `hsla(${(glowHue + 80) % 360}, 100%, 60%, 0)`);

                    ctx.fillStyle = centralGradient;
                    ctx.shadowBlur = 60;
                    ctx.shadowColor = `hsla(${glowHue}, 100%, 75%, ${layerAlpha})`;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, layerRadius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Cercle central solide noir
            ctx.shadowBlur = bassLevel > 0.05 ? 35 : 10;
            const borderHue = bassLevel > 0.05 ? (Date.now() * 0.04) % 360 : 270;
            ctx.shadowColor = `hsla(${borderHue}, 100%, 80%, ${bassLevel > 0.05 ? 1 + bassLevel : 0.3})`;
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.arc(centerX, centerY, centralRadius, 0, Math.PI * 2);
            ctx.fill();

            // Bordure TRÈS lumineuse qui pulse avec les basses
            ctx.strokeStyle = `hsla(${borderHue}, 100%, 75%, ${bassLevel > 0.05 ? 1 : 0.4})`;
            ctx.lineWidth = bassLevel > 0.05 ? 6 + bassLevel * 8 : 2;
            ctx.shadowBlur = bassLevel > 0.05 ? 40 + bassLevel * 30 : 10;
            ctx.shadowColor = `hsla(${borderHue}, 100%, 80%, ${bassLevel > 0.05 ? 1 : 0.3})`;
            ctx.stroke();

            // Particules lumineuses qui explosent sur les coups de basse
            if (isPlaying && bassLevel > 0.15) {
                for (let i = 0; i < numBars; i += 3) {
                    const angle = (i / numBars) * Math.PI * 2;
                    const bassFreqIndex = Math.floor((i / numBars) * bassRange);
                    const amplitude = dataArray[bassFreqIndex] / 255;

                    if (amplitude > 0.5) {
                        const wave = Math.floor(Math.random() * numWaves);
                        const particleRadius = baseRadius + wave * waveSpacing + Math.pow(amplitude, 0.35) * amplificationFactor;
                        const x = centerX + Math.cos(angle) * particleRadius;
                        const y = centerY + Math.sin(angle) * particleRadius;

                        const flashHue = 180 + Math.random() * 90;

                        ctx.save();
                        ctx.shadowBlur = 55;
                        ctx.shadowColor = `hsla(${flashHue}, 100%, 90%, ${amplitude})`;
                        ctx.fillStyle = `hsla(${flashHue}, 100%, 95%, ${amplitude})`;
                        ctx.beginPath();
                        ctx.arc(x, y, 6 + amplitude * 12, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();
                    }
                }
            }

            ctx.shadowBlur = 0;
        };

        draw();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            window.removeEventListener("resize", handleResize);
        };
    }, [mode, analyser, dataArray, isPlaying]);

    const playPause = async () => {
        if (!audioRef.current) return;
        try {
            if (audioRef.current.paused) {
                await audioRef.current.play();
                setIsPlaying(true);
            } else {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const stop = () => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
    };

    const changeAudio = (path: string) => {
        if (!audioRef.current || currentAudio === path) return;
        const wasPlaying = isPlaying;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setCurrentAudio(path);
        setIsPlaying(false);
        if (wasPlaying) {
            setTimeout(() => {
                audioRef.current?.play();
                setIsPlaying(true);
            }, 200);
        }
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            height: "100%",
            width: "100%",
            margin: "auto auto",
            overflow: "hidden",
            background: "transparent"
        }}>
            <canvas
                ref={canvasRef}
                style={{
                    display: "flex",
                    width: "100%",
                    //height: "100%",
                    margin: "auto auto",
                    background: "transparent",
                }}
            />
            
            <select value={mode} style={{
                position: "absolute",
                top: 18,
                left: 2,
                right: 2,
                fontSize: 10,
            }} onChange={(e) => setMode((e.currentTarget as HTMLSelectElement).selectedIndex)}>
                <option value={0}>Cercle</option>
                <option value={1}>Barres</option>
                <option value={2}>Cercle</option>
            </select>
            
            
            <div style={{
                position: "absolute",
                bottom: 4,
                left: 2,
                right: 2,
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                gap: 5,
                margin: "0px 0px",
                background: "rgba(0, 0, 0, 0.0)",
                padding: "2px 3px",
                //border: "2px solid rgba(100, 200, 255, 0.3)",
            }}>
                <div style={{
                    display: "flex",
                    gap: 5,
                    flexDirection: "row",
                    justifyContent: "center"
                }}>
                    {audioList.map((audio) => (
                        <button
                            key={audio.path}
                            onClick={() => changeAudio(audio.path)}
                            style={{
                                padding: "4px 6px",
                                background: currentAudio === audio.path ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#222",
                                border: `2px solid ${currentAudio === audio.path ? "#a78bfa" : "#444"}`,
                                borderRadius: 10,
                                color: "#fff",
                                fontWeight: "bold",
                                width: "100%",
                                fontSize: "10px",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                boxShadow: currentAudio === audio.path ? "0 0 20px rgba(167, 139, 250, 0.6)" : "none"
                            }}
                        >
                            {audio.name}
                        </button>
                    ))}
                </div>
                <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
                    <button
                        onClick={playPause}
                        style={{
                            padding: "2px 4px",
                            background: isPlaying
                                ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                                : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                            border: "none",
                            borderRadius: 10,
                            color: "#fff",
                            fontWeight: "bold",
                            cursor: "pointer",
                            width: "100%",
                            fontSize: 10,
                            transition: "all 0.3s ease",
                            boxShadow: `0 0 20px ${isPlaying ? "rgba(245, 87, 108, 0.6)" : "rgba(79, 172, 254, 0.6)"}`
                        }}
                    >
                        {isPlaying ? "⏸ Pause" : "▶ Play"}
                    </button>
                    <button
                        onClick={stop}
                        style={{
                            padding: "2px 4px",
                            background: "#444",
                            border: "2px solid #666",
                            borderRadius: 10,
                            color: "#fff",
                            fontWeight: "bold",
                            width: "100%",
                            cursor: "pointer",
                            fontSize: 10,
                            transition: "all 0.3s ease"
                        }}
                    >
                        ⏹ Stop
                    </button>
                </div>
            </div>

            <audio ref={audioRef} preload="auto" key={currentAudio}>
                <source src={currentAudio} type="audio/mpeg" />
            </audio>
        </div>
    );
}

function Disco1({}: {}) {
    
}