import Image from "next/image";
import Button from "./components/button";
import {ReactNode} from "react";
import QCM from "@/app/components/qcm";
import Question from "@/app/components/qcm";


export default function Home() {
    return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
            <div>
                <h2>Qui nous sommes</h2>
            </div>
            
            <Section title={""} content={""}>
                
            </Section>
            
            <Button text={"Test"}/>
            
            <Section title={""} content={""}>
                <QCM question={"Qui est correcte?"} reponses={[{"Oui": true, "Faux": false, "Incorrecte": false}]}/>
            </Section>
            
            <Section title={"Contribuez"} content={""}/>
        </main>
    </div>
    );
}

function Section({title, content, children}: {title: string, content: string, children?: ReactNode}) {
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
