
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { Transaction, UserProfile, ChatMessage } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define tools for the chat agent
const transactionTools: FunctionDeclaration[] = [
  {
    name: 'initiate_transfer',
    description: 'Prepare a money transfer for the user to confirm. Use this when user says "send money", "transfer", "pay X".',
    parameters: {
      type: Type.OBJECT,
      properties: {
        amount: { type: Type.NUMBER, description: 'Amount in Naira' },
        recipient: { type: Type.STRING, description: 'Name or account details of recipient' },
        reason: { type: Type.STRING, description: 'Transaction description or note' }
      },
      required: ['amount', 'recipient']
    }
  },
  {
    name: 'buy_airtime',
    description: 'Prepare an airtime purchase. Use when user says "buy airtime", "recharge", "top up".',
    parameters: {
      type: Type.OBJECT,
      properties: {
        amount: { type: Type.NUMBER, description: 'Amount in Naira' },
        phoneNumber: { type: Type.STRING, description: 'Phone number to recharge' },
        network: { type: Type.STRING, description: 'Network provider (MTN, Glo, Airtel, 9mobile)' }
      },
      required: ['amount', 'phoneNumber']
    }
  }
];

export const generateFinancialAdvice = async (
  transactions: Transaction[],
  context: 'individual' | 'community' | 'market'
): Promise<string> => {
  const model = 'gemini-2.5-flash';
  
  // Summarize data to avoid sending too much tokens
  const summary = transactions.slice(0, 20).map(t => 
    `${t.date}: ${t.type === 'credit' ? '+' : '-'}₦${t.amount} at ${t.merchant} (${t.category})`
  ).join('\n');

  let prompt = "";

  if (context === 'individual') {
    prompt = `
      Act as a senior financial advisor for a Nigerian user. 
      Analyze these recent transactions:
      ${summary}
      
      Provide 3 brief, actionable bullet points on how this user can improve their savings or cut costs. 
      Focus on spending habits. Be encouraging but direct.
    `;
  } else if (context === 'community') {
    prompt = `
      Act as a community data analyst.
      Based on these transactions which represent a user in an urban Lagos demographic:
      ${summary}
      
      Compare this spending pattern to typical community trends in Nigeria (e.g., high food inflation, transport costs).
      Provide 2 insights on how they stack up against the "average" peer and one community savings challenge they could join.
    `;
  } else {
    // Market
    prompt = `
      Act as a market analyst for the Nigerian fintech sector.
      Considering a user who spends money on these categories:
      ${summary}
      
      Suggest 2 emerging investment sectors in Nigeria relevant to their spending (e.g., if they spend on tech, suggest tech stocks; if agriculture, suggest commodity trading).
      Also mention one potential economic risk factor (e.g., currency fluctuation) to watch out for this week.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful, professional, and culturally aware financial assistant for the Nigerian market. Use the Naira symbol (₦) where appropriate.",
      }
    });
    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Our AI services are currently experiencing high traffic. Please try again later.";
  }
};

export const recommendInsurancePlan = async (
  transactions: Transaction[],
  user: UserProfile
): Promise<{ recommendationText: string; recommendedType: string }> => {
  const model = 'gemini-2.5-flash';
  
  const summary = transactions.slice(0, 30).map(t => 
    `${t.type === 'debit' ? 'Spent' : 'Earned'} ₦${t.amount} on ${t.category} (${t.merchant})`
  ).join('\n');

  const prompt = `
    Analyze this Nigerian user profile to recommend the ONE best insurance product type for them.
    
    Profile:
    - Balance: ₦${user.balance}
    - Savings: ₦${user.savings}
    - Recent Activity:
    ${summary}

    Available Product Types:
    1. 'health' (high pharmacy/hospital spend)
    2. 'agriculture' (farming/agro-allied spend)
    3. 'device' (electronics/data spend)
    4. 'life' (high transfers to dependents)
    5. 'education' (school fees, bookshops, or child-related spend)
    6. 'business' (inventory restocking, multiple small merchant payments)

    Output Format:
    Return a valid JSON object ONLY.
    {
      "type": "health" | "agriculture" | "device" | "life" | "education" | "business",
      "reason": "A 2-sentence explanation of why this fits their lifestyle based on specific spending patterns (e.g., mention specific merchants)."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text || "{}";
    const data = JSON.parse(text);
    
    return {
      recommendationText: data.reason || "We recommend reviewing our general health plans.",
      recommendedType: data.type || "health"
    };

  } catch (error) {
    console.error("Gemini Insurance Error:", error);
    return {
      recommendationText: "Based on your general profile, we recommend starting with a basic health plan.",
      recommendedType: "health"
    };
  }
};

export const chatWithSupport = async (
  message: string,
  history: ChatMessage[]
): Promise<{ text: string; transactionPreview?: any }> => {
  const model = 'gemini-2.5-flash';
  
  // Format history for context
  const context = history.map(h => `${h.role === 'user' ? 'User' : 'Agent'}: ${h.text}`).join('\n');
  
  const prompt = `
    System: You are the AI fintech assistant for NairaSense.
    
    Chat History:
    ${context}
    
    Current User Message: ${message}
    
    Instructions:
    - If the user wants to send money, transfer funds, or buy airtime, CALL the appropriate function/tool.
    - Otherwise, respond helpfully in text.
    - Keep responses concise and friendly.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ functionDeclarations: transactionTools }],
        systemInstruction: "You are a helpful banking assistant. You can initiate transactions like transfers and airtime purchases. Always confirm details before proceeding."
      }
    });

    const candidate = response.candidates?.[0];
    const textPart = candidate?.content?.parts?.find(p => p.text);
    const functionCallPart = candidate?.content?.parts?.find(p => p.functionCall);

    // Handle Function Call (Transaction Intent)
    if (functionCallPart) {
      const fc = functionCallPart.functionCall;
      const args = fc?.args as any;

      if (fc?.name === 'initiate_transfer') {
        return {
          text: `I've set up a transfer of ₦${args.amount} to ${args.recipient}. Please review and confirm below.`,
          transactionPreview: {
            type: 'transfer',
            amount: args.amount,
            recipient: args.recipient,
            description: args.reason || 'Fund Transfer',
            status: 'pending'
          }
        };
      }

      if (fc?.name === 'buy_airtime') {
        return {
          text: `I'm ready to top up ${args.phoneNumber} with ₦${args.amount}. Is this correct?`,
          transactionPreview: {
            type: 'airtime',
            amount: args.amount,
            recipient: args.phoneNumber,
            description: args.network || 'Airtime Topup',
            status: 'pending'
          }
        };
      }
    }

    // Default Text Response
    return { 
      text: textPart?.text || "I'm having a bit of trouble connecting. Please try again." 
    };

  } catch (error) {
    console.error("Chat Error:", error);
    return { text: "I apologize, I am currently undergoing maintenance. Please try again later." };
  }
};
