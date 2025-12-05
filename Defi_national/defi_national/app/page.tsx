'use client';

import Image from "next/image";
import {ReactNode} from "react";
import QCM from "@/app/components/qcm";

import Link from "next/link";
import '@/app/style.css';

import {Background, Parallax} from 'react-parallax';
import Disco from "@/app/components/disco";

export default function Home() {
    return (
    <Parallax bgImage="/fond1.png" className={"px-16 teun"} contentClassName={"flex flex-col min-h-screen w-full"} strength={5000}>
        <div className="Logo mx-auto my-[calc(50vh-125px)]">
            <Link href="https://nird.forge.apps.education.fr/"><Image src='/img/nird_logo.png' alt="Logo NIRD" width={484} height={200} className="justify-center"/></Link>
        </div>

        <div className="absolute custom-bg mt-[150vh]">
            <img src="/phrise.png" alt="Phrise" />
        </div>

        <h1 className={"mt-30 mb-50 mx-auto"}>Petit historique du numérique</h1>
        
        <Section side={1} title={"1946 - Premier ordinateur"} content={"150 kW de consommation, c'est beaucoup mais c'est le progrès !"}/>

        <Section side={2} title={"1969 - Débuts d'internet"} content={"ARPANET, 4 ordinateurs connectées, champagne !"}/>

        <Section side={1} title={"1989 - World Wide Web"} content={"Le monde s'embale, 10 000 sites webs voient le jour gratuitement !"}/>

        <Section side={2} title={"2000 - Première crise"} content={"5 000 Milliards $ de perte, 50% des entreprises de la tech déposent le bilan"}/>
        
        <Section side={1} title={"2007 - l'iPhone"} content={"Internet dans nos poches, 270 millions de smartphones vendus"}/>

        <Section side={2} title={"2013 - Surveillance de masse révélée"} content={"1 milliard de personnes et 97 milliards de mails espionnés"}/>

        <Section side={1} title={"2016 - Explosion des impacts néfastes"} content={"38% d'augmentation des dépressions chez les jeunes, 44,7 millions de tonnes d'e-déchets"}/>

        <Section side={2} title={"2019 - Le monde s'emballe"} content={"Datacenters : 200 TWh/an, 1,4 milliard de smartphones jetés/an"}/>

        <Section side={1} title={"2021 - Fracture sociale croissante"} content={"13 millions de Français en difficulté numérique"}/>

        <Section side={2} title={"2024 - Apocalypse numérique ?"} content={"74 millions de tonnes d'e-déchets prévus en 2030"}/>

        <h1 className={"mt-60 mb-60 mx-auto"}>Connaissez-vous les solutions pour renverser la tendance ?</h1>
        <Section side={3} title={"Question 1 : Achats responsables"} content={""}>
            <QCM question={"Quelle option est la PLUS écologique pour renouveler son smartphone ?"} reponses={[{"A) Acheter le dernier modèle neuf avec l'éco-score le plus élevé": false, "B) Acheter un smartphone reconditionné": true, "C) Attendre les soldes pour un modèle récent neuf": false}]}/>
        </Section>
        <Section side={3} title={"Question 2 : Sobriété numérique"} content={""}>
            <QCM question={"Quelle pratique réduit le PLUS la consommation de bande passante ?"} reponses={[{"A) Désactiver l'autoplay des vidéos": true, "B) Utiliser le mode sombre": true, "C) Vider son cache régulièrement": false}]}/>
        </Section>
        <Section side={3} title={"Question 3 : Système d'exploitation"} content={""}>
            <QCM question={"Pourquoi installer Linux sur un vieil ordinateur est une pratique NIRD ?"} reponses={[{"A) C'est gratuit et ça fait des économies": false, "B) Ça prolonge la durée de vie de la machine et évite l'obsolescence logicielle": true, "C) C'est plus à la mode chez les développeurs": false}]}/>
        </Section>
        <Section side={3} title={"Question 4 : Réparation"} content={""}>
            <QCM question={"En France, quel indicateur aide à choisir un appareil réparable ?"} reponses={[{"A) Le label Energy Star": false, "B) La certification ISO 14001": false, "C) L'indice de réparabilité": true}]}/>
        </Section>
        <Section side={3} title={"Question 5 : Inclusion numérique"} content={""}>
            <QCM question={"Quelle initiative lutte le mieux contre l'illectronisme ?"} reponses={[{"A) Proposer des ateliers de médiation numérique": true, "B) Distribuer des tablettes gratuites": false, "C) Rendre tous les services disponibles uniquement en ligne": false}]}/>
        </Section>
        
        <div className="relative z-10 flex flex-col m-auto w-52 h-96 rounded-xl overflow-clip bg-black">
            <div className={"mx-auto mt-1 w-2 h-2 rounded-full bg-gray-800"}/>
            <Disco/>
        </div>

        <h2 className={"mt-30 mb-20 mx-auto"}>Besoin d'une recherche personalisée sur le NIRD ? Demandez à notre assistant IA, cliquez sur ce chat !</h2>
        <Link href="/chat"><Image src='/cat.webp' alt="Chat PIXEL" width={200} height={200} className="flex mx-auto justify-center mb-50 cat"/></Link>

        <h2 className={" mb-20 mx-auto"}>Vous jugez votre usage du numérique (trop) intensif ? Soufflez un coup, voici nos conseils pour faire une activité sportive !</h2>
        <Link href="/decathlon"><Image src='/sport.png' alt="Sport icon" width={200} height={200} className="flex mx-auto justify-center mb-50 cat"/></Link>

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
