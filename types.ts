
export type TabType = 'original' | 'hiragana';
export type AppMode = 'lyrics' | 'prompt' | 'creation' | 'chat';
export type ThemeColor = 'orange' | 'blue' | 'emerald' | 'violet' | 'rose';

export interface SunoTag {
    label: string;
    value: string;
}

export interface TagCategory {
    name: string;
    tags: SunoTag[];
}

export interface PromptParams {
    vocalX: number; // -100 (Male) to 100 (Female)
    vocalY: number; // -100 (Low) to 100 (High)
    artist: string;
    textures: string[];
    genres: string[];
    instruments: string[];
}

export interface ArtistAnalysisResult {
    vocalX: number;
    vocalY: number;
    genres: string[];
    textures: string[];
    instruments: string[];
}

export interface AudioAnalysisResult {
    vocalX: number;
    vocalY: number;
    textures: string[];
}

export interface VisualPromptResult {
    sceneDescription: string;
    imagePrompt: string;
}

export interface VideoPromptResult {
    lyricsPart: string;
    sceneDescription: string;
    soraPrompt: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    image?: string; // Base64 data URI
}

export interface ThemeSettings {
    lyrics: ThemeColor;
    prompt: ThemeColor;
    chat: ThemeColor;
    creation: ThemeColor;
}

export interface VocalPreset {
    id: string;
    name: string;
    vocalX: number;
    vocalY: number;
    textures: string[];
}

export interface LyricSection {
    title: string;
    content: string;
}
