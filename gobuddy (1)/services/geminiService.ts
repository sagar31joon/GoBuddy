import { GoogleGenAI } from "@google/genai";

const API_KEY = 'AIzaSyBrQoM44GJRP0hrweLrHwgkTbYPIaOMkeY';

// Initialize AI client with the provided key
let ai: GoogleGenAI | null = null;
if (API_KEY) {
    try {
        ai = new GoogleGenAI({ apiKey: API_KEY });
    } catch (e) {
        console.warn("Failed to initialize GoogleGenAI client:", e);
    }
}

export const enhancePostContent = async (originalText: string): Promise<string> => {
  // Graceful fallback if Client failed to init (though key is now present)
  if (!ai) {
    console.warn("Gemini Client not initialized. Using smart fallback.");
    return getSmartFallback(originalText);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an enthusiastic sports community manager. Rewrite the following user post to be more engaging, friendly, and clear for a sports partner finder app called "GoBuddy". 
      
      Rules:
      1. Keep it concise (under 280 chars).
      2. Include relevant sports emojis.
      3. Make it sound inviting.
      4. Do not include hashtags.
      
      Original Post: "${originalText}"`,
      config: {
        maxOutputTokens: 300,
        temperature: 0.7,
      }
    });

    if (response.text) {
        return response.text.trim();
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Gemini enhancement failed:", error);
    // Return smart fallback on API failure to keep app working
    return getSmartFallback(originalText);
  }
};

// Helper for offline/fallback polish
const getSmartFallback = async (text: string): Promise<string> => {
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const lower = text.toLowerCase();
    let sport = 'sports';
    let emoji = '🏆';
    let action = 'Let\'s play';

    if (lower.includes('cricket')) { sport = 'Cricket'; emoji = '🏏'; action = 'Hit some boundaries'; }
    else if (lower.includes('football') || lower.includes('soccer')) { sport = 'Football'; emoji = '⚽'; action = 'Score some goals'; }
    else if (lower.includes('tennis')) { sport = 'Tennis'; emoji = '🎾'; action = 'Ace it'; }
    else if (lower.includes('badminton')) { sport = 'Badminton'; emoji = '🏸'; action = 'Smash it'; }
    else if (lower.includes('gym') || lower.includes('workout') || lower.includes('exercise')) { sport = 'Gym'; emoji = '💪'; action = 'Get fit'; }
    else if (lower.includes('run') || lower.includes('hike') || lower.includes('jog')) { sport = 'Running'; emoji = '🏃'; action = 'Go the distance'; }
    
    const randomIntros = [
        `Looking for a ${sport} partner! ${emoji}`,
        `${action} together! Anyone up for ${sport}?`,
        `Ready for some ${sport}? ${emoji} Need a buddy!`
    ];
    
    const randomIntro = randomIntros[Math.floor(Math.random() * randomIntros.length)];
    return `${randomIntro} ${text}`;
};