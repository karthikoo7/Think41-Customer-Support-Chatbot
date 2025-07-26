import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';
import './ChatWindow.css';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  const sendMessage = async (text) => {
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);

    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user123', message: text, conversationId: sessionId }),
    });

    const data = await res.json();
    setSessionId(data.sessionId);
    setMessages([...newMessages, { role: 'assistant', content: data.response }]);
  };

  return (
    <div className="chat-window">
      <MessageList messages={messages} />
      <UserInput onSend={sendMessage} />
    </div>
  );
};

export default ChatWindow;
