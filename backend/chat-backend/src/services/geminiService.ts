import axios from 'axios';

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const API_KEY = "AIzaSyAUVPuHnHWkndfYU7JVQoNlrdew5dh37cc" ;

export const generateResponse = async (text: string): Promise<string> => {
  const payload = {
    contents: [
      {
        parts: [
          { text: text }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(`${GEMINI_URL}?key=${API_KEY}`, payload, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.data.candidates) {
      return response.data.candidates
        .map((candidate: any) => candidate?.content?.parts[0]?.text || "No text provided.")
        .join('\n');
    }

    throw new Error('No candidates found in the response');
  } catch (error: any) {
    console.error('Error calling Gemini API:', error.response?.data || error.message);
    throw new Error(error.message || 'API call failed');
  }
};
