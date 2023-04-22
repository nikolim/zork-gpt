// components/ChatInput.tsx
import React, { useState } from 'react';
import { BsFillSendCheckFill } from 'react-icons/bs';
import TextareaAutosize from 'react-textarea-autosize';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (
    e: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    if ('key' in e) {
      if (e.key !== 'Enter' || e.shiftKey) {
        return;
      }
      e.preventDefault();
    }

    if (inputValue.trim()) {
      onSendMessage(inputValue);
      console.log('Sending message to chat: ', inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center p-4">
      <TextareaAutosize
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-grow bg-white rounded-lg px-4 py-2 mr-4 textarea-input resize-none"
        placeholder="Type your message"
        minRows={1}
        maxRows={6}
        onKeyDown={handleSubmit}
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="bg-blue-500 text-white rounded-full px-8 py-2 p-8 h-10"
      >
        <BsFillSendCheckFill size={22} />
      </button>
    </form>
  );
};

export default ChatInput;
