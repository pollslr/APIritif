import Button from "@/app/components/button";

export function QCM({question, children}: {question: string, children: Element[]}) {
    
    
    return (
        <div>
            <h3>{title}</h3>
            
            <div>
                {children}
            </div>
            
            <div>
                <Button text={"Valider"}/>
            </div>
        </div>
    );
}

export function Question() {
    
}
