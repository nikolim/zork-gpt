// components/ChatArea.tsx
import React, { useState, useEffect } from 'react';
import ChatInput from './ChatInput';

const ChatArea: React.FC = () => {
  const [messages, setMessages] = useState([{
    "id": 1,
    "message": "Hello, I am Therapt. How can I help you?",
    "sender": "AI"
  },{   
    "id": 2,
    "message": "I am feeling sad",
    "sender": "user"
    }
]);

  useEffect(() => {
    // Load initial messages here if needed
  }, []);

  const handleSendMessage = (message: string) => {
    // Update messages state with new user message
    // Send message to the backend and get AI response
    // Update messages state with AI response
  };

  return (
    <div className="flex flex-col justify-between flex-grow">
      <div className="overflow-auto p-4">
        {messages.map((message, index) => (
          // Render messages here
          
        ))}
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatArea;
