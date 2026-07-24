/**
 * AI Feedback Service
 * Handles communication with LLM (e.g. Google Gemini) for real-time interview feedback.
 * Uses API key stored in LocalStorage for frontend-only deployment.
 */

export class AIFeedbackService {
    constructor() {
        this.apiKey = localStorage.getItem('gemini_api_key') || '';
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    }

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('gemini_api_key', key);
    }

    hasApiKey() {
        return !!this.apiKey;
    }

    /**
     * Generate feedback for the STAR interview responses
     * @param {Object} starData - { situation, task, action, result }
     * @returns {Promise<String>}
     */
    async generateInterviewFeedback(starData) {
        if (!this.hasApiKey()) {
            return this._getMockFeedback(starData);
        }

        const prompt = `
你是一位專業的 AI 應用教練。請根據以下用戶提供的 STAR 面試框架回答，給予簡短、專業且具建設性的回饋（約 100-150 字）。
評估重點：AI 工具的選擇是否合理？預期成果是否具體？

[用戶回答]
情境 (Situation): ${starData.situation}
任務 (Task): ${starData.task}
行動 (Action): ${starData.action}
結果 (Result): ${starData.result}

請用繁體中文給出點評：`;

        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 250
                    }
                })
            });

            if (!response.ok) {
                throw new Error('API Request Failed');
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('AI Feedback Error:', error);
            return "連線至 AI 服務失敗，但從您的回答可以看出您對 AI 導入有清晰的思路！建議可進一步量化您的預期成果（例如節省多少%的時間）。";
        }
    }

    /**
     * Fallback mock feedback if no API key is provided
     */
    async _getMockFeedback(starData) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve("【系統模擬回饋】您的 STAR 框架結構完整！特別是在「行動」階段選擇了合適的 AI 工具。若能進一步在「成果」中補充具體的量化指標（如預計節省 20% 工時），會讓這個提案更具說服力！(提示：您可以在設定中綁定 API Key 以獲得真實 AI 回饋)");
            }, 1500);
        });
    }
}

export const aiService = new AIFeedbackService();
