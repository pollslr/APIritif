'use client';

import Image from "next/image";
import {ReactNode} from "react";
import QCM from "@/app/components/qcm";

import Link from "next/link";
import '@/app/style.css';

import {Background, Parallax} from 'react-parallax';

export default function Home() {
    return (
        <Parallax bgImage="/fond1.png" className={"px-16 teun"} contentClassName={"flex flex-col min-h-screen w-full"} strength={2000}>
            <div className="Logo mx-auto my-[calc(50vh-125px)]">
                <Link href="/"><h1 className={"mx-auto"}>Retour à l'accueil</h1></Link>
            </div>
            <Section side={2} title={"Sport et plein air : Sortir de sa bulle"} content={"Nous passons en moyenne 6 heures par jour devant nos écrans, générant isolement, sédentarité et troubles mentaux. Tu te sens hyperconnecté virtuellement, mais profondément seul ? Le sport et les activités de plein air t'offrent un reset salvateur : libération d'endorphines, réduction du stress, reconnexion au corps et à la nature. Courir, randonner, faire du vélo, c'est échanger un like contre un sourire, un swipe contre un bol d'air frais !"}/>
            <h1 className={"mt-40 mb-30 mx-auto"}>Auto-évalue tes habitudes sportives en cinq questions !</h1>

            <h1 className={"mt-70 mb-30 mx-auto quest"}>Combien de séances de sport fais-tu par semaine ?</h1>
            <h2 className={"mb-15 mx-auto quest"}>O séance ( +0 point )</h2>
            <h2 className={"mb-15 mx-auto quest"}>1 séance ( +1 point )</h2>
            <h2 className={"mb-40 mx-auto quest"}>2 séance ou plus ( +2 points )</h2>

            <h1 className={"mt-60 mb-30 mx-auto quest"}>Combien de temps par semaine consacres-tu à une activité en plein air ?</h1>
            <h2 className={"mb-15 mx-auto quest"}>Moins d'une heure( +0 point )</h2>
            <h2 className={"mb-15 mx-auto quest"}>Entre 1h et 3h ( +1 point )</h2>
            <h2 className={"mb-40 mx-auto quest"}>3 heures ou plus ( +2 points )</h2>

            <h1 className={"mt-60 mb-30 mx-auto quest"}>Tu estimes :</h1>
            <h2 className={"mb-15 mx-auto quest"}>Etre en très mauvaise forme physiquement ( +0 point )</h2>
            <h2 className={"mb-15 mx-auto quest"}>Etre en forme moyenne physiquement ( +1 point )</h2>
            <h2 className={"mb-40 mx-auto quest"}>Etre très en forme physiquement ( +2 points )</h2>

            <h1 className={"mt-60 mb-30 mx-auto quest"}>Ton avis sur le sport :</h1>
            <h2 className={"mb-15 mx-auto quest"}>C'est pas pour moi ( +0 point )</h2>
            <h2 className={"mb-15 mx-auto quest"}>J'aime bien mais que de temps en temps ( +1 point )</h2>
            <h2 className={"mb-40 mx-auto quest"}>J'adore ça ! ( +2 points )</h2>

            <h1 className={"mt-60 mb-30 mx-auto quest"}>A quand remonte ta dernière sortie randonnée, vélo, course... ( ou autre sport) ?</h1>
            <h2 className={"mb-15 mx-auto quest"}>Longtemps ( +0 point )</h2>
            <h2 className={"mb-15 mx-auto quest"}>La semaine dernière ( +1 point )</h2>
            <h2 className={"mb-40 mx-auto quest"}>Dans les derniers jours ( +2 points )</h2>

            <h1 className={"mt-60 mb-30 mx-auto quest"}>Résultats :</h1>

            <h1 className={"mt-60 mb-30 mx-auto quest"}>Tu as entre 0 et 4 :</h1>
            <h2 className={"mb-15 mx-auto quest"}>Allez courage, n'aie pas peur de te lancer !</h2>
            <h2 className={"mb-15 mx-auto quest"}>Exercices possibles :</h2>
            <h2 className={"mb-40 mx-auto quest"}>Course courte à allure lente, randonnée en vélo... ( Pense à t'hydrater ! )</h2>

            <h1 className={"mt-60 mb-30 mx-auto quest"}>Tu as entre 5 et 7 :</h1>
            <h2 className={"mb-15 mx-auto quest"}>C'est bien, bravo !</h2>
            <h2 className={"mb-15 mx-auto quest"}>Exercices possibles :</h2>
            <h2 className={"mb-40 mx-auto quest"}>Course courte à allure modérée, musculation ( pompes, chaise ) ...</h2>

            <h1 className={"mt-60 mb-30 mx-auto quest"}>Tu as entre 8 et 10 :</h1>
            <h2 className={"mb-15 mx-auto quest"}>Félicitations, le sport n'a aucun secret pour toi !</h2>
            <h2 className={"mb-15 mx-auto quest"}>Exercices possibles :</h2>
            <h2 className={"mb-40 mx-auto quest"}>Cross, trail, renforcement musculaire poussé...</h2>

            <h3 className={"mb-5 mx-auto"}>Nuit de l'Info 2025 - API-Ritif team</h3>

        </Parallax>
    );
}

function Section({title, content, side = 0, children}: {title: string, content: string, side?: number, children?: ReactNode}) {
    return (
        <div className={"flex flex-col my-63 ".concat(side == 1 ? "ml-auto" : (side == 2 ? "mr-auto" : 'mx-auto'))}>
            <h2 className={"mx-auto mb-3 titre"}>{title}</h2>
            <p className={"contenu"}>{content}</p>
            <div className={"mt-2"}>
                {children}
            </div>
        </div>
    );
}