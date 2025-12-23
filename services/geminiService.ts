import { GoogleGenerativeAI } from "@google/generative-ai";
import { PromptParams, ArtistAnalysisResult, VisualPromptResult, AudioAnalysisResult, VideoPromptResult } from "../types";
import { GENRES, VOCAL_TEXTURES, EMPHASIS_INSTRUMENTS } from "../constants";

// AIクライアントの初期化を修正
const getAiClient = () => {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  // モデル名を安定版の 'gemini-1.5-flash' に統一します
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

export const convertToHiragana = async (text: string): Promise<string> => {
  if (!text.trim()) return "";
  try {
    const model = getAiClient();
    const prompt = `あなたは日本語の歌詞変換アシスタントです。
以下の歌詞を、元の改行構造を維持したまま、すべて「ひらがな」に変換してください。
英語や[Verse]などのタグはそのまま残してください。解説は不要です。

歌詞:
${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim() || "";
  } catch (error) {
    console.error("Error converting to Hiragana:", error);
    return "変換エラー";
  }
};

export const generateLyrics = async (keywords: string): Promise<string | null> => {
  try {
    const model = getAiClient();
    const prompt = `あなたはプロの作詞家です。
以下のキーワードやテーマに基づいて、日本語の歌詞を書いてください。
[Verse], [Chorus]などのタグを使い、感情的でリズムの良い構成にしてください。

キーワード: ${keywords}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim() || null;
  } catch (error) {
    console.error("Error generating lyrics:", error);
    return null;
  }
};

export const analyzeArtistStyle = async (artistName: string): Promise<ArtistAnalysisResult | null> => {
  try {
    const model = getAiClient();
    const prompt = `音楽分析エキスパートとして、以下のアーティストのスタイルを分析し、指定のJSON形式で返してください。
ジャンルは [${GENRES.join(", ")}]、
質感は [${VOCAL_TEXTURES.join(", ")}]、
楽器は [${EMPHASIS_INSTRUMENTS.join(", ")}] から選んでください。

アーティスト: ${artistName}

返却形式(JSONのみ):
{
  "vocalX": 数値(-100〜100),
  "vocalY": 数値(-100〜100),
  "genres": ["ジャンル名"],
  "textures": ["質感名"],
  "instruments": ["楽器名"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(jsonText) as ArtistAnalysisResult;
  } catch (error) {
    console.error("Error analyzing artist:", error);
    return null;
  }
};

export const generateSunoPrompt = async (params: PromptParams): Promise<string> => {
  try {
    const model = getAiClient();
    let vocalDesc = params.vocalX < -30 ? "Male" : params.vocalX > 30 ? "Female" : "Androgynous";
    
    const prompt = `Suno AI用のプロンプトを作成してください。
以下の情報をカンマ区切りの英語タグの羅列（1000文字以内）に変換してください。アーティスト名は含めないでください。

情報:
- 声別: ${vocalDesc}
- 質感: ${params.textures.join(", ")}
- ジャンル: ${params.genres.join(", ")}
- 楽器: ${params.instruments.join(", ")}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim().substring(0, 1000);
  } catch (error) {
    console.error("Error generating prompt:", error);
    return "エラーが発生しました";
  }
};

// --- チャットセッション ---
export const createChatSession = () => {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "あなたはプロの音楽プロデューサーです。日本語でアドバイスしてください。" 
    });
    return model.startChat({ history: [] });
  } catch (e) {
    console.error("Failed to create chat:", e);
    return null;
  }
};

// 未使用やエラーの多い画像・動画生成・音声再生関数は一旦簡略化
export const generateVisualPrompts = async () => null;
export const generateVideoPromptForSection = async () => null;
export const generateImage = async () => null;
export const playVoiceSample = async () => {};
export const analyzeVocalAudio = async () => null;
