// components/AIMessage.tsx
import React from 'react';
import { AiOutlineRobot } from 'react-icons/ai';
import { FaRobot } from 'react-icons/fa';

interface AIMessageProps {
  message: string;
}

const AIMessage: React.FC<AIMessageProps> = ({ message }) => {
  return (
    <div className="flex flex-1">
        <div className="inline-flex items-end mb-4 min-h-[50px]">
            <div className="p-3 bg-374F74 mr-2 rounded-full">
                <FaRobot className="text-2xl text-white text-374F74" />
            </div>
            <div className="flex-1 rounded-t-lg rounded-br-lg bg-A5C2ED text-black py-2 px-4 break-words">
              <pre className="whitespace-pre-wrap font-sans">{message}</pre>
            </div>
        </div>
    </div>

  );
};

export default AIMessage;