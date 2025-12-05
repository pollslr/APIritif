'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Button from "./components/button";
import {ReactNode} from "react";
import QCM from "@/app/components/qcm";

import Link from "next/link";
import '@/app/style.css';
import SnakesGame from "@/app/components/SnakesGame";

export default function Home() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const parallaxSpeed = scrollY * 0.5;

    return (
    <div className="flex min-h-screen items-center justify-center font-sans">
        <main
            className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
            <div className="Logo">
                <Link href="/"><Image src='/img/nird_logo.png' alt="Logo NIRD" width={484} height={200}
                                      className="justify-center"/></Link>
            </div>
            <div>
                <h2>Qui sommes-nous ?</h2>
            </div>

            <Section title={""} content={""}>

            </Section>

            <Button text={"Test"}/>

            <div className="my-8">
                <Link href="/snake">
                    <Button text={"🐍 Jouer au Snake"}/>
                </Link>
            </div>

            <Section title={""} content={""}>
                <QCM question={"Qui est correcte?"} reponses={[{"Oui": true, "Faux": false, "Incorrecte": false}]}/>
            </Section>

            <Section title={"Contribuez"} content={""}/>


        </main>
    </div>
    );
}

function Section({title, content, children}: { title: string, content: string, children?: Element[] }) {
    return (
        <div>
        <h2>{title}</h2>
            <p>{content}</p>
            <div>
                {children}
            </div>
        </div>
    );
}
