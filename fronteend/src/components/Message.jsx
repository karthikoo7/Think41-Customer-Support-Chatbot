import React from 'react';
import './Message.css';

const Message = ({ role, content }) => {
  const isUser = role === 'user';
  return (
    <div className={`message ${isUser ? 'user' : 'assistant'}`}>
      <div className="bubble">{content}</div>
    </div>
  );
};

export default Message;
