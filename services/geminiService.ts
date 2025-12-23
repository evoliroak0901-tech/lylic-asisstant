
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PromptParams, ArtistAnalysisResult, VisualPromptResult, AudioAnalysisResult, VideoPromptResult } from "../types";
import { GENRES, VOCAL_TEXTURES, EMPHASIS_INSTRUMENTS } from "../constants";

// Helper to get client with env key
const getAiClient = () => {
    // Guidelines: Use process.env.API_KEY directly with named parameter.
    return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
};

export const convertToHiragana = async (text: string): Promise<string> => {
  if (!text.trim()) return "";

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a Japanese lyrics converter. 
      Task: Convert the following Japanese song lyrics strictly into Hiragana (reading). 
      Rules:
      1. Maintain the exact same line structure and line breaks.
      2. Keep any meta tags (like [Verse], [Chorus]) or English words exactly as they are.
      3. Only output the converted text, no explanations.
      4. If there are Kanji, convert to Hiragana.
      5. If there is already Hiragana or Katakana, ensure it flows naturally as Hiragana.
      
      Lyrics:
      ${text}`,
    });

    // Use property access for text
    return response.text.trim() || "";
  } catch (error) {
    console.error("Error converting to Hiragana:", error);
    return "変換エラー";
  }
};

export const generateLyrics = async (keywords: string): Promise<string | null> => {
    try {
        const ai = getAiClient();
        const systemInstruction = `
        You are a professional songwriter.
        Task: Write song lyrics based on the provided keywords or theme.
        
        Requirements:
        1. Language: Japanese.
        2. Structure: Use standard song structure with tags like [Verse], [Chorus], [Bridge].
        3. Creativity: Be creative, emotional, and rhythmic suitable for a song.
        4. Length: A standard song length (Verse 1, Chorus, Verse 2, Chorus, Outro) or whatever fits the keywords.
        
        Only output the lyrics with tags.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Keywords/Theme: ${keywords}\n\nGenerate lyrics now.`,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        return response.text.trim() || null;
    } catch (error) {
        console.error("Error generating lyrics:", error);
        return null;
    }
};

export const analyzeArtistStyle = async (artistName: string): Promise<ArtistAnalysisResult | null> => {
    try {
        const ai = getAiClient();

        const systemInstruction = `
        You are a music analysis expert for Suno AI prompting.
        Analyze the artist provided by the user and map their style to the following parameters.
        
        Available Lists to choose from (pick the closest matches):
        - Genres: ${GENRES.join(", ")}
        - Textures: ${VOCAL_TEXTURES.join(", ")}
        - Instruments: ${EMPHASIS_INSTRUMENTS.join(", ")}

        Parameters to determine:
        1. vocalX: Number between -100 and 100.
        2. vocalY: Number between -100 and 100.
        3. genres: Array of strings (Select max 3)
        4. textures: Array of strings (Select max 2)
        5. instruments: Array of strings (Select max 2)
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Analyze the artist: ${artistName}`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        vocalX: { type: Type.NUMBER },
                        vocalY: { type: Type.NUMBER },
                        genres: { type: Type.ARRAY, items: { type: Type.STRING } },
                        textures: { type: Type.ARRAY, items: { type: Type.STRING } },
                        instruments: { type: Type.ARRAY, items: { type: Type.STRING } },
                    }
                }
            }
        });

        const jsonText = response.text;
        if (!jsonText) return null;
        return JSON.parse(jsonText) as ArtistAnalysisResult;

    } catch (error) {
        console.error("Error analyzing artist:", error);
        return null;
    }
}

export const analyzeVocalAudio = async (base64Audio: string, mimeType: string): Promise<AudioAnalysisResult | null> => {
    try {
        const ai = getAiClient();
        const systemInstruction = `
        You are an expert audio engineer. Listen to the provided vocal audio sample and analyze its characteristics.
        Map the analysis to the following parameters:

        1. vocalX: Number (-100 to 100).
        2. vocalY: Number (-100 to 100).
        3. textures: Select up to 2 descriptors: [${VOCAL_TEXTURES.join(", ")}]

        Return strictly JSON.
        `;

        const cleanBase64 = base64Audio.split(',')[1] || base64Audio;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
                parts: [
                    { inlineData: { mimeType: mimeType, data: cleanBase64 } },
                    { text: "Analyze the vocals in this audio." }
                ]
            },
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        vocalX: { type: Type.NUMBER },
                        vocalY: { type: Type.NUMBER },
                        textures: { type: Type.ARRAY, items: { type: Type.STRING } },
                    }
                }
            }
        });

        const jsonText = response.text;
        if (!jsonText) return null;
        return JSON.parse(jsonText) as AudioAnalysisResult;
    } catch (error) {
        console.error("Error analyzing audio:", error);
        return null;
    }
};

export const generateSunoPrompt = async (params: PromptParams): Promise<string> => {
  try {
    const ai = getAiClient();

    let vocalDesc = "";
    const x = params.vocalX;
    const y = params.vocalY;

    if (x < -30) vocalDesc += "Male vocals";
    else if (x > 30) vocalDesc += "Female vocals";
    else vocalDesc += "Androgynous vocals";

    if (y < -30) vocalDesc += ", Low pitch";
    else if (y > 30) vocalDesc += ", High pitch";
    
    const systemInstruction = `You are a Suno AI prompt generator expert.
    Task: Create a single string of comma-separated English style tags for Suno AI.
    
    CRITICAL CONSTRAINT: 
    The output string MUST be under 1000 characters. 
    IMPORTANT: Do NOT use the Artist Name in the output.

    Inputs:
    1. Vocal Characteristics: ${vocalDesc}
    2. Vocal Textures: ${params.textures.join(", ")}
    3. Target Genres: ${params.genres.join(", ")}
    4. Emphasized Instruments: ${params.instruments.join(", ")}
    5. Artist Style Reference: ${params.artist || "None"}

    Output format:
    [Genre], [Sub-genre], [Instruments], [Vocal Style], [Mood/Atmosphere], [Tempo]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: "Generate the Suno prompt string now.",
      config: {
        systemInstruction: systemInstruction,
      }
    });

    let result = response.text.trim() || "";
    if (result.length > 1000) result = result.substring(0, 1000);
    return result;
  } catch (error) {
    console.error("Error generating prompt:", error);
    return "エラーが発生しました";
  }
};

export const generateVisualPrompts = async (lyrics: string): Promise<VisualPromptResult | null> => {
    try {
        const ai = getAiClient();
        const systemInstruction = `
        You are a creative director. Analyze the provided lyrics and extract core imagery and mood.
        Output a JSON object with:
        1. sceneDescription: Concise Japanese summary (max 30 chars).
        2. imagePrompt: Detailed English prompt for image generator.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Lyrics:\n${lyrics}`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sceneDescription: { type: Type.STRING },
                        imagePrompt: { type: Type.STRING },
                    }
                }
            }
        });

        const jsonText = response.text;
        if (!jsonText) return null;
        return JSON.parse(jsonText) as VisualPromptResult;
    } catch (error) {
        console.error("Error generating visual prompts:", error);
        return null;
    }
};

export const generateVideoPromptForSection = async (lyricsPart: string): Promise<VideoPromptResult | null> => {
    try {
        const ai = getAiClient();
        const systemInstruction = `
        You are a video direction expert. Create a video generation prompt for a section of a song.
        Input Lyrics: "${lyricsPart}"
        Output JSON: sceneDescription (Japanese, max 30 chars), soraPrompt (English, detailed visual motion).
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate video prompt for section.`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sceneDescription: { type: Type.STRING },
                        soraPrompt: { type: Type.STRING },
                    }
                }
            }
        });

        const jsonText = response.text;
        if (!jsonText) return null;
        const result = JSON.parse(jsonText);
        return { ...result, lyricsPart } as VideoPromptResult;
    } catch (error) {
        console.error("Error generating video prompt:", error);
        return null;
    }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
        });

        if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Error generating image:", error);
        return null;
    }
}

export const createChatSession = (): Chat | null => {
  try {
    const ai = getAiClient();
    return ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "あなたはプロの音楽プロデューサー兼作詞家のアシスタントです。ユーザーの作詞、楽曲構成、Suno AIのプロンプト作成などについて日本語でアドバイスをしてください。",
      }
    });
  } catch (e) {
    console.error("Failed to create chat session:", e);
    return null;
  }
};

// --- Audio Decoding Helpers (Manual Implementation per Guidelines) ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const playVoiceSample = async (text: string, vocalX: number, vocalY: number): Promise<void> => {
    try {
        const ai = getAiClient();

        let voiceName = 'Zephyr'; 
        if (vocalX < -20) voiceName = 'Charon'; 
        else if (vocalX > 20) voiceName = 'Kore'; 
        else voiceName = 'Puck'; 

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: { parts: [{ text: text }] },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) return;

        // Use AudioContext to play raw PCM data from TTS
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const decodedBytes = decode(base64Audio);
        const buffer = await decodeAudioData(decodedBytes, audioCtx, 24000, 1);
        
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
    } catch (error) {
        console.error("Error playing voice sample:", error);
    }
};
