import { useEffect, useRef, useState } from 'react';
import { Message } from '../custom_types';
import './styles/UserInput.css';

interface UserInputProps {
    sendMsg: (msg: Message) => void;
}

function UserInput({ sendMsg } : UserInputProps) {
    const [userInput, setUserInput] = useState<string>('')
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAnswer = (e: any) => {
        if (e.key === "Enter") {
        sendMsg({type: 'user', text: `> ${userInput}`})
        setUserInput("");
        }
      };

    useEffect(() => {
    // Set focus on the input element when the component mounts
    if (inputRef.current) {
        inputRef.current.focus();
    }

    // Add event listener to set focus on the input element when the user clicks anywhere on the page
    const handleClick = () => {
        if (inputRef.current) {
        inputRef.current.focus();
        }
    };
    document.addEventListener("click", handleClick);
    return () => {
        document.removeEventListener("click", handleClick);
    };
    }, []); 
    return (
        <div className="input-container">
            <p className="input-prompt">&gt;</p>
            <input
                ref={inputRef}
                className="terminal-input"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => handleAnswer(e)}
        />
        </div>
    );
}

export default UserInput;
