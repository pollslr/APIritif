'use client';

import Image from "next/image";
import Button from "./components/button";
import {ReactNode} from "react";
import QCM from "@/app/components/qcm";

import Link from "next/link";
import '@/app/style.css';

import { Parallax } from 'react-parallax';

export default function Home() {
    return (
    <Parallax bgImage="/fond1.webp" className={"px-16 teun"} contentClassName={"flex flex-col min-h-screen w-full"}>
        <div className="Logo mx-auto">
            <Link href="/"><Image src='/img/nird_logo.png' alt="Logo NIRD" width={484} height={200} className="justify-center"/></Link>
        </div>
        
        <Section title={"1946 - Premier ordinateur"} content={"150 kW de consommation, c'est beaucoup mais c'est le progrès !"}/>

        <Section side={true} title={"1969 - Débuts d'internet"} content={"ARPANET, 4 ordinateurs connectées, champagne !"}/>

        <Section title={"Test"} content={"Ceci est un test"}>
            <QCM question={"Qui est correcte?"} reponses={[{"Oui": true, "Faux": false, "Incorrecte": false}]}/>
        </Section>
        
        <Section title={"Contribuez"} content={""}/>
    </Parallax>
    );
}

function Section({title, content, side = false, children}: {title: string, content: string, side?: boolean, children?: ReactNode}) {
    return (
        <div className={"flex flex-col my-20 ".concat(side ? "ml-auto" : "mr-auto")}>
            <h2 className={"mx-auto mb-3"}>{title}</h2>
            <p>{content}</p>
            <div className={"mt-2"}>
                {children}
            </div>
        </div>
    );
}
