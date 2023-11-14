
const sendChatBtn = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatBox = document.querySelector(".chatbox");

let userMessage;

const createChatLi = (message, className) => {
 const chatLI = document.createElement("li");
 chatLI.classList.add("chat", className);
 let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : ` <i class="fas fa-robot"></i> <p></p>`;
 chatLI.innerHTML = chatContent;
 chatLI.querySelector('p').textContent = message;
 return chatLI;
};

const handleChat = () => {
 userMessage = chatInput.value.trim();
 if (!userMessage) return;

 chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    chatBox.scrollTo(0,chatBox.scrollHeight)
 setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming")
    chatBox.appendChild(incomingChatLi);
    generateResponse(incomingChatLi);
    chatBox.scrollTo(0,chatBox.scrollHeight);
 }, 600);
};

sendChatBtn.addEventListener("click", handleChat);
const generateResponse = (incomingChatLi) => {
   const messageElement = incomingChatLi.querySelector('p');
 
   const options = {
     method: 'POST',
     headers: {
       accept: 'application/json',
       'Content-Type': 'application/json',
       Authorization: 'Bearer rtKCjNUIT4yX9EwMavGq3WmExPBjxqwHPnuiRB91', // Replace with your actual API key
     },
     body: JSON.stringify({
       messages: [{ role: 'USER', content: userMessage }],
       model: 'command-small',
       stream: true,
       preamble_override: 'string',
       chat_history: [
         { role: 'CHATBOT', message: 'Hello. How may I help you?', user_name: 'string' },
       ],
       conversation_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
       prompt_truncation: 'auto',
       connectors: [{ id: 'web-search' }],
       search_queries_only: true,
       documents: [{ id: 'string', additionalProp: 'string' }],
       citation_quality: 'accurate',
       temperature: 0.3,
     }),
   };
 
   const apiUrl = 'https://api.cohere.ai/v1/chat';
 
   fetch(apiUrl, options)
     .then((response) => response.json())
     .then((data) => {
       messageElement.textContent = data.choices[0].message.content;
     })
     .catch((err) => {
       messageElement.textContent = 'Oops! Something went wrong, please try again.';
     })
     .finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
 };
 