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
    <Parallax bgImage="/fond1.png" className={"px-16 teun"} contentClassName={"flex flex-col min-h-screen w-full"} strength={800}>
        <div className="Logo mx-auto my-[calc(50vh-125px)]">
            <Link href="https://nird.forge.apps.education.fr/"><Image src='/img/nird_logo.png' alt="Logo NIRD" width={484} height={200} className="justify-center"/></Link>
        </div>

        <div className="absolute custom-bg mt-[150vh]">
            <img src="/phrise.png" alt="Zbi" />
        </div>

        <h1 className={"mt-30 mb-50 mx-auto"}>Petit historique du numérique</h1>
        
        <Section side={true} title={"1946 - Premier ordinateur"} content={"150 kW de consommation, c'est beaucoup mais c'est le progrès !"}/>

        <Section title={"1969 - Débuts d'internet"} content={"ARPANET, 4 ordinateurs connectées, champagne !"}/>

        <Section side={true} title={""} content={"Ceci est un test"}>
            <QCM question={"Qui est correcte?"} reponses={[{"Oui": true, "Faux": false, "Incorrecte": false}]}/>
        </Section>
        
        <Section title={"Contribuez"} content={""}/>
        
        <div className="relative z-10 flex m-auto w-32 h-64 rounded-xl overflow-clip bg-black">
            <Disco/>
            <div className={"absolute left-[62px] top-1 w-2 h-2 rounded-full bg-gray-800"}/>
        </div>
    </Parallax>
    );
}

function Section({title, content, side = false, children}: {title: string, content: string, side?: boolean, children?: ReactNode}) {
    return (
        <div className={"flex flex-col my-60 ".concat(side ? "ml-auto" : "mr-auto")}>
            <h2 className={"mx-auto mb-3"}>{title}</h2>
            <p>{content}</p>
            <div className={"mt-2"}>
                {children}
            </div>
        </div>
    );
}
