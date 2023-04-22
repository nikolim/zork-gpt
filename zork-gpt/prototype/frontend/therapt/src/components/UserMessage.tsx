// components/UserMessage.tsx
import React from 'react';
import { MdPerson } from 'react-icons/md';
import { BsPerson } from 'react-icons/bs';

interface UserMessageProps {
  message: string;
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  return (
    <div className="flex flex-1">
        <div className="inline-flex items-end justify-end mb-4 min-h-[50px] ml-auto">
            <div className="flex-1 rounded-t-lg rounded-bl-lg bg-white text-black py-2 px-4 break-words">
                <pre className="whitespace-pre-wrap font-sans">{message}</pre>
            </div>
            <div className="p-3 bg-374F74 ml-2 rounded-full">
                <BsPerson className="text-2xl text-white text-374F74" />
            </div>
        </div>
    </div>
  );
};

export default UserMessage;
