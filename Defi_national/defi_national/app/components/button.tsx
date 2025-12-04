'use client'

export default function Button({text, clicked}: {text: string, clicked?: Function}) {
    return (
        <button onClick={() => clicked ? clicked() : null} className={"m-2 p-1.5 px-4 bg-teal-300/40 border-2 border-teal-500 rounded-lg hover:scale-110 hover:border-teal-300 hover:bg-teal-300/50 transition-all duration-200 ease-in-out cursor-pointer active:scale-95"}>{text}</button>
    );
}