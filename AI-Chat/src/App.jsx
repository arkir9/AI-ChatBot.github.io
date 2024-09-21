import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import './App.css';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function App() {
  const [messages, setMessages] = useState([
    { text: "Welcome! I'm an AI assistant. How can I help you today?", type: 'incoming' }
  ]);
  const chatBoxRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (userMessage) => {
    if (isLoading) {
      return; // Prevent multiple requests while one is in progress
    }

    setMessages(prevMessages => [...prevMessages, { text: userMessage, type: 'outgoing' }]);
    setMessages(prevMessages => [...prevMessages, { text: 'Thinking...', type: 'incoming' }]);
    setIsLoading(true);
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userMessage }
        ],
      });

      const aiResponse = response.choices[0].message.content;
      
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = { text: aiResponse, type: 'incoming' };
        return newMessages;
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = { text: "Sorry, I couldn't process that request. Please try again later.", type: 'incoming' };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  console.log('Rendering App component');
  console.log('Messages:', messages);

  return (
    <div className="App">
      <h1>AI Chat Bot</h1>
      <div className="chatbox" ref={chatBoxRef}>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message.text} type={message.type} />
        ))}
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

export default App;
