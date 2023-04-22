// components/ChatArea.tsx
import React, { useState, useEffect, useRef } from 'react';
import AIMessage from './AIMessage';
import UserMessage from './UserMessage';
import ChatInput from './ChatInput';

interface ChatAreaProps {
    activeTab: number;
    // chats is an array of 
    chats: Array<Object>
    addMessage: (current_id: string, message: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ activeTab, chats, addMessage }) => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const scrollableRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (scrollableRef.current) {
      setTimeout(() => {
        scrollableRef.current?.scrollTo({
          top: scrollableRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 50); // You can adjust the delay time if needed
    }
  };


  useEffect(() => {
    // Load initial messages here if needed
    scrollToBottom();
  }, [chats, activeTab]);

  const handleSendMessage = (message: string) => {
    // Update messages state with new user message
    // Send message to the backend and get AI response
    // Update messages state with AI response
    console.log('Sending message to chat: ', message);
    const current_id = chats[activeTab].current_id;
    addMessage(current_id, message);
    scrollToBottom();
  };

  return (
    <div className="flex flex-col justify-between flex-grow h-full">
      <div className="overflow-auto p-4 flex-grow" ref={scrollableRef}>
        {chats[activeTab].messages.map((message, index) => (
          message.sender === 'AI' ? (
            <AIMessage key={index} message={message.message} />
          ) : (
            <UserMessage key={index} message={message.message} />
          )
        ))}
      </div>
      <div className="flex-none">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatArea;
