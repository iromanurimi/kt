// Chatbot - OPTIMIZED
function initChatbot() {
    // Chatbot Knowledge Base (lazy loaded)
    function loadKnowledgeBase() {
        return {
            "alamun ciki": {
                question: "Menene alamun farko na ciki?",
                answer: `Alamun farko na ciki sun haɗa da jinkirin haila, amai, gajiya, ƙura, da sauran su.`,
                category: "ciki",
                tags: ["alamu", "farko", "symptoms"]
            },
            "abinci mai gina jiki": {
                question: "Menene abinci mai gina jiki ga uwa mai ciki?",
                answer: `Abinci mai gina jiki ya haɗa da: 1. Naman kaji, kifi, da wake (protein) 2. 'Ya'yan itace da kayan marmari (bitamin) 3. Shinkafa, alkama, da dawa (carbohydrate) 4. Ruwa mai yawa (hydration).`,
                category: "nutrition",
                tags: ["abinci", "gina jiki", "ciki"]
            },
            "shawarwari bayan haihuwa": {
                question: "Menene shawarwari bayan haihuwa?",
                answer: `Shawarwari bayan haihuwa: 1. Huta sosai 2. Ci abinci mai gina jiki 3. Sha ruwa mai yawa 4. Yi motsa jiki sauƙaƙa 5. Tuntubi likita idan akwai matsala.`,
                category: "postpartum",
                tags: ["bayan haihuwa", "shawarwari", "lafiya"]
            }
        };
    }

    function getBotResponse(userMessage) {
        const knowledge = loadKnowledgeBase();
        const lowerMessage = userMessage.toLowerCase().trim();

        // Simple keyword matching
        const keywords = {
            'ciki': knowledge["alamun ciki"],
            'alamu': knowledge["alamun ciki"],
            'abinci': knowledge["abinci mai gina jiki"],
            'gina jiki': knowledge["abinci mai gina jiki"],
            'bayan haihuwa': knowledge["shawarwari bayan haihuwa"],
            'shawarwari': knowledge["shawarwari bayan haihuwa"]
        };

        for (const [keyword, data] of Object.entries(keywords)) {
            if (lowerMessage.includes(keyword)) {
                return {
                    text: data.answer,
                    category: data.category,
                    tags: data.tags
                };
            }
        }

        return {
            text: "Na gane tambayar ku. Duk da haka, ina ba ku shawarar tuntubar likita don ƙarin bayani.",
            category: "general",
            tags: ["help", "general"]
        };
    }

    // Chat UI functionality
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatMessages = document.getElementById('chat-messages');

    if (!chatInput || !chatSendBtn || !chatMessages) return;

    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;

        const time = new Date().toLocaleTimeString('ha-NG', {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageDiv.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${time}</div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleSendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, true);
        chatInput.value = '';

        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-message bot-message typing-indicator';
        typingIndicator.innerHTML = '<div class="message-content">Ana rubutu...</div>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Get bot response after delay
        setTimeout(() => {
            // Remove typing indicator
            if (typingIndicator.parentNode) {
                typingIndicator.remove();
            }

            const response = getBotResponse(message);
            addMessage(response.text, false);
        }, 1000);
    }

    // Event listeners
    chatSendBtn.addEventListener('click', handleSendMessage);

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Add welcome message
    setTimeout(() => {
        addMessage("Barka da zuwa! Ni chatbot ne na Ciki da Raino. Yaya zan iya taimakon ku a yau?", false);
    }, 500);
}

// Make available globally
window.initChatbot = initChatbot;