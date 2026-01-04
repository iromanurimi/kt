import { chatbotKnowledge } from './knowledge.js';

// Get bot response based on user input
export function getBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase().trim();

    // Check for exact matches
    for (const [key, data] of Object.entries(chatbotKnowledge)) {
        if (lowerMessage.includes(key.toLowerCase())) {
            return {
                text: data.answer,
                category: data.category,
                tags: data.tags
            };
        }
    }

    // Check for keywords
    const keywordMap = {
        'ciki': chatbotKnowledge["alamun ciki"],
        'alamu': chatbotKnowledge["alamun ciki"],
        'abinci': chatbotKnowledge["abinci mai gina jiki"],
        'nutrition': chatbotKnowledge["abinci mai gina jiki"],
        'ruwa': chatbotKnowledge["ruwa a ciki"],
        'water': chatbotKnowledge["ruwa a ciki"],
        'haihuwa': chatbotKnowledge["alamun ciki"],
        'labor': chatbotKnowledge["alamun ciki"],
        'jariri': chatbotKnowledge["abinci mai gina jiki"],
        'baby': chatbotKnowledge["abinci mai gina jiki"],
        'cutar': chatbotKnowledge["alamun ciki"],
        'complication': chatbotKnowledge["alamun ciki"],
        'motsa jiki': chatbotKnowledge["alamun ciki"],
        'exercise': chatbotKnowledge["alamun ciki"],
        'fitness': chatbotKnowledge["alamun ciki"]
    };

    for (const [keyword, data] of Object.entries(keywordMap)) {
        if (lowerMessage.includes(keyword)) {
            return {
                text: data.answer,
                category: data.category,
                tags: data.tags
            };
        }
    }

    // Default response
    return {
        text: chatbotKnowledge.default.answer,
        category: chatbotKnowledge.default.category,
        tags: chatbotKnowledge.default.tags
    };
}