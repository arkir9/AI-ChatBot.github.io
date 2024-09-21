import React from 'react';

function ChatMessage({ message, type }) {
  return (
    <div className={`chat ${type}`}>
      {type === 'incoming' && <i className="fas fa-robot"></i>}
      <p>{message}</p>
    </div>
  );
}

export default ChatMessage;
