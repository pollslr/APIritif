'use client'

export default function Button({text, clicked}: {text: string, clicked?: Function}) {
    return (
        <button onClick={() => clicked ? clicked() : null} className={"m-2 p-1.5 px-4 bg-blue-800/40 border-2 border-blue-900 rounded-lg hover:scale-110 hover:border-blue-700 hover:bg-blue-800/50 transition-all duration-200 ease-in-out cursor-pointer active:scale-95"}>{text}</button>
    );
}