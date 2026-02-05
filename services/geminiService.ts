
import { GoogleGenAI, Type } from "@google/genai";
import { TopicData, UserProfile, ChatMessage } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to construct context based on user profile
const getContextInstruction = (profile?: UserProfile) => {
  if (!profile) return "";

  const isPro = profile.membership === 'Pro';
  const lang = profile.language || 'en';

  return `
    CONTEXT - TARGET AUDIENCE:
    The user has configured the following profile. You MUST adapt your response to fit this persona:
    - Age: ${profile.age || "Unspecified"}
    - Occupation: ${profile.occupation || "General Public"}
    - Education: ${profile.education || "General Audience"}
    - Membership Tier: ${isPro ? "PRO (Expert Mode)" : "Free (General Mode)"}

    CRITICAL INSTRUCTIONS:
    1. **LANGUAGE**: Output the entire response STRICTLY in the following language code: "${lang}".
    2. **Safety & Sensitivity**: 
       - If Age < 18, strictly filter mature/graphic content and explain complex conflicts gently.
    3. **Complexity & Tone**: 
       - Adjust vocabulary and sentence structure to match the Education level.
       - ${isPro ? "Use professional, industry-standard terminology. Assume high competence." : "Use accessible analogies."}
    4. **Relevance**: 
       - Frame "Why it matters" in a way that relates to their Occupation if possible.
  `;
};

// Phase 1: Fast Summary Generation
export const generateTopicSummary = async (query: string, userProfile?: UserProfile): Promise<TopicData> => {
  const ai = getAiClient();
  const profileContext = getContextInstruction(userProfile);
  
  const prompt = `
    Analyze the following topic, viewpoint, or link: "${query}".
    Act as an objective, neutral information bridge.

    ${profileContext}
    
    Goal: Provide a quick, high-level summary and factual basis tailored to the user profile above.
    
    Generate a JSON response matching:
    {
      "title": "Clear concise title",
      "summary": "2-sentence abstract of the event (for list view)",
      "newsNarrative": "3-paragraph journalistic summary of the event (approx 150-200 words). Objective, AP-style tone.",
      "whyMatters": "Why this is important",
      "facts": [{"content": "fact 1", "confidence": "High"}, ...],
      "dataCutoff": "YYYY-MM-DD"
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          newsNarrative: { type: Type.STRING },
          whyMatters: { type: Type.STRING },
          facts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                confidence: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
              }
            }
          },
          dataCutoff: { type: Type.STRING },
        },
        required: ["title", "summary", "newsNarrative", "whyMatters", "facts"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  const data = JSON.parse(text);

  return {
    ...data,
    id: crypto.randomUUID(),
    sourceCount: Math.floor(Math.random() * 50) + 10,
    lastUpdated: new Date().toLocaleTimeString(),
    isAiGenerated: true,
    // Initialize optional fields as undefined/empty to indicate loading
    stakeholders: undefined,
    terms: undefined,
    extensions: undefined,
    divergenceRating: undefined
  };
};

// Phase 2: Deep Dive Analysis (Async)
export const generateTopicDeepDive = async (query: string, currentData: TopicData, userProfile?: UserProfile): Promise<Partial<TopicData>> => {
  const ai = getAiClient();
  const profileContext = getContextInstruction(userProfile);
  const isPro = userProfile?.membership === 'Pro';
  
  const prompt = `
    Perform a deep cognitive analysis on: "${query}".
    Context: ${currentData.summary}

    ${profileContext}
    
    Goal: Bridge understanding by providing comprehensive prediction, simulation, and multi-disciplinary analysis.
    
    REQUIREMENTS:
    1. **Controversy Prediction**: Forecast potential future conflict risks based on current anomalies.
    2. **Trend Analysis**: Simulate a 5-point time series of public sentiment/volume leading up to now.
    3. **Missing Intel**: Identify 2 key pieces of missing info and where to wait for them.
    4. **Empathy Simulator (Role Play)**:
       ${isPro 
         ? "- **PRO MODE DETECTED**: Select a relevant Historical Figure (e.g., FDR, Confucius), Academic Expert (e.g., Keynes, Bourdieu), or Top Industry Leader. Set 'mode' to 'chat'. Provide a provocative 'initialMessage' inviting the user to debate. The 'roleName' must be the specific person's name." 
         : "- **FREE MODE DETECTED**: Create a 'dilemma' game. Create exactly 3 rounds of situational choices for a generic stakeholder. Set 'mode' to 'dilemma'."}
    5. **Disciplines**: Analyze from 2 distinct academic fields (e.g. Economics, Sociology).
       - **Insight Length**: Approx **30-50 words**. 
       - **Focus**: Highlight specific professional mechanisms or systemic effects.
    6. **History**: Provide 1 historical parallel event (name, year, similarity, lesson).
    7. **Knowledge Expansion (Pro Member Features)**:
       - Generate exactly **3 distinct extension cards** with specific types:
       - 1. **Academic**: A specific key paper, theory, or book citation relevant to the topic.
       - 2. **Report**: A relevant industry report (e.g., McKinsey, UN, WHO, Goldman Sachs).
       - 3. **Case**: An international case study or comparison (e.g., "How Norway handled X").
       - **Description Length**: Approx **80 words**. 
    8. **Key Terms**:
       - Define 3 complex terms found in the topic.
       - **Definition Length**: Approx **30-50 words**. 
       - **Tone**: Simple, easy to understand (Explain Like I'm 15).
    
    Generate JSON matching the schema structure.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          divergenceRating: { type: Type.INTEGER },
          perspectiveSummary: { type: Type.STRING },
          stakeholders: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                fears: { type: Type.STRING },
                values: { type: Type.STRING },
                blindSpots: { type: Type.STRING },
                rationality: { type: Type.STRING },
              }
            }
          },
          // NEW FIELDS
          controversyPrediction: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
              reasoning: { type: Type.STRING }
            }
          },
          trendAnalysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                sentiment: { type: Type.NUMBER },
                volume: { type: Type.NUMBER },
                event: { type: Type.STRING }
              }
            }
          },
          missingIntel: {
             type: Type.ARRAY,
             items: {
               type: Type.OBJECT,
               properties: {
                 question: { type: Type.STRING },
                 whyCritical: { type: Type.STRING },
                 trustedSource: { type: Type.STRING }
               }
             }
          },
          rolePlay: {
            type: Type.OBJECT,
            properties: {
              mode: { type: Type.STRING, enum: ["dilemma", "chat"] },
              roleName: { type: Type.STRING },
              context: { type: Type.STRING },
              initialMessage: { type: Type.STRING },
              rounds: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    situation: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: {
                         type: Type.OBJECT,
                         properties: {
                           text: { type: Type.STRING },
                           consequence: { type: Type.STRING }
                         }
                      }
                    }
                  }
                }
              }
            }
          },
          disciplinaryPerspectives: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                discipline: { type: Type.STRING },
                insight: { type: Type.STRING }
              }
            }
          },
          historicalParallels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                event: { type: Type.STRING },
                year: { type: Type.STRING },
                similarity: { type: Type.STRING },
                lesson: { type: Type.STRING }
              }
            }
          },
          // End New Fields
          terms: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definition: { type: Type.STRING },
              }
            }
          },
          extensions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["Academic", "Report", "Case"] }
              }
            }
          }
        },
        required: ["stakeholders", "divergenceRating", "controversyPrediction", "rolePlay"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No deep dive response from AI");

  return JSON.parse(text);
};

// Phase 3: Expert Chat (Pro Only)
export const chatWithExpert = async (
  message: string, 
  history: ChatMessage[], 
  personaName: string, 
  topicTitle: string,
  userProfile?: UserProfile
): Promise<string> => {
  const ai = getAiClient();
  const lang = userProfile?.language || 'en';

  const prompt = `
    You are roleplaying as "${personaName}".
    Current Topic: "${topicTitle}".
    
    INSTRUCTIONS:
    1. Respond to the user's last message based strictly on your historical writings, theories, or public stance.
    2. Maintain your persona's tone (e.g., Confucius = wise/philosophical, Keynes = analytical/macro-economic).
    3. Keep responses concise (under 100 words) but insightful.
    4. Language: ${lang}.
    
    CONVERSATION HISTORY:
    ${history.map(m => `${m.role === 'user' ? 'User' : personaName}: ${m.text}`).join('\n')}
    
    User: ${message}
    ${personaName}:
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text || "...";
};
