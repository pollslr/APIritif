'use client'

import Button from "@/app/components/button";
import {useState} from "react";

export default function QCM({question, reponses}: {question: string, reponses: any[]}) {
    const [selectedList, setSelectedList] = useState<number[]>([]);
    const [message, setMessage] = useState<string>('');
    
    return (
        <div>
            <h3>{question}</h3>
                
            <div className={"border-2 border-r-0 border-t-0 border-b-0 border-teal-300 pl-2"}>
                {
                    Object.keys(reponses[0]).map((rep, i) => <Reponse key={i} index={i} reponse={rep} selected={selected}/>)
                }
            </div>
            
            <div className={"flex items-center"}>
                <Button text={"Valider"} clicked={check}/>
                <p hidden={message==""} className={"ml-2"}>{message}</p>
            </div>
        </div>
    );
    
    function selected(index: number, checked: boolean) {
        if (checked) {
            setSelectedList((l) => l.includes(index) ? l : [...l, index]);
        }
        else {
            setSelectedList((l) => l.toSpliced(l.indexOf(index), 1));
        }
    }
    
    function check() {
        for (let i = 0; i < Object.keys(reponses[0]).length; i++) {
            const key = Object.keys(reponses[0])[i];
            if (reponses[0][key] && !selectedList.includes(i)) {
                setMessage("Mauvaise réponse.");
                return;
            }
            else if (!reponses[0][key] && selectedList.includes(i)) {
                setMessage("Mauvaise réponse.");
                return;
            }
        }
        setMessage("Bonne réponse.");
    }
}

function Reponse({index, reponse, selected}: {index: number, reponse: string, selected: (i: number, checked: boolean)=>void}) {
    const [checked, setChecked] = useState(false);
    
    return (
        <div className={"my-2 flex items-center"}>
            <div className={"flex mr-2 w-8 h-8 rounded-lg bg-teal-950 border-2 border-teal-400 cursor-pointer"} onClick={() => click()}>
                <div className={"m-1 rounded bg-teal-400 w-full aspect-square transition-opacity ".concat(checked ? "" : "opacity-0")}/>
            </div>
            <p>{reponse}</p>
        </div>
    );
    
    function click() {
        selected(index, !checked);
        setChecked(!checked);
    }
}
