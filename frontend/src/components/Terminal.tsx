import { useState, useEffect, useRef } from 'react';
import './styles/Terminal.css';
import { Conversation } from '../custom_types';

interface TerminalProps {
    conversation: Conversation;
}

function Terminal({ conversation }: TerminalProps) {
    const [lines, setLines] = useState<Conversation>({id: '0', messages: []});
    useEffect(() => {
      setLines(conversation);
    }, [conversation]);

    return (
        <div className="Terminal">
            {lines.messages.map((msg, index) => (
              <div className="terminal-line">
                <span className="terminal-text">{msg.text}</span>
              </div>
            ))}
        </div>
      );
}

export default Terminal;
