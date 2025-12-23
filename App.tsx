
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat } from "@google/genai";
import { TabType, AppMode, ChatMessage, ThemeSettings, VisualPromptResult, VocalPreset, LyricSection, VideoPromptResult, PromptParams } from './types';
import { 
  convertToHiragana, 
  generateSunoPrompt, 
  createChatSession, 
  analyzeArtistStyle, 
  playVoiceSample, 
  generateVisualPrompts, 
  generateImage, 
  analyzeVocalAudio, 
  generateVideoPromptForSection, 
  generateLyrics 
} from './services/geminiService';
import { TagPanel } from './components/TagPanel';
import { Button } from './components/Button';
import { XYPad } from './components/XYPad';
import { ChatInterface } from './components/ChatInterface';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { GENRES, VOCAL_TEXTURES, EMPHASIS_INSTRUMENTS, THEMES } from './constants';

// Icons
const IconPaste = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>;
const IconCopy = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const IconSparkles = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/></svg>;
const IconPencil = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

export const App: React.FC = () => {
    const [mode, setMode] = useState<AppMode>(() => (localStorage.getItem('suno_mode') as AppMode) || 'lyrics');
    const [activeTab, setActiveTab] = useState<TabType>(() => (localStorage.getItem('suno_tab') as TabType) || 'original');
    
    const [lyricsOriginal, setLyricsOriginal] = useState(() => localStorage.getItem('suno_lyrics_orig') || '');
    const [lyricsHiragana, setLyricsHiragana] = useState(() => localStorage.getItem('suno_lyrics_hira') || '');
    const [isConverting, setIsConverting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedLineIndex, setSelectedLineIndex] = useState<number>(-1);
    const lyricsRef = useRef<HTMLTextAreaElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);

    const [promptParams, setPromptParams] = useState<PromptParams>(() => {
        const saved = localStorage.getItem('suno_prompt_params');
        return saved ? JSON.parse(saved) : {
            vocalX: 0,
            vocalY: 0,
            artist: '',
            textures: [],
            genres: [],
            instruments: []
        };
    });
    const [sunoPrompt, setSunoPrompt] = useState(() => localStorage.getItem('suno_prompt_text') || '');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
        const saved = localStorage.getItem('suno_chat_history');
        return saved ? JSON.parse(saved) : [];
    });
    const chatSession = useRef<Chat | null>(null);
    const [isChatLoading, setIsChatLoading] = useState(false);

    const [visualResult, setVisualResult] = useState<VisualPromptResult | null>(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
        const saved = localStorage.getItem('suno_theme');
        return saved ? JSON.parse(saved) : {
            lyrics: 'orange',
            prompt: 'blue',
            chat: 'emerald',
            creation: 'violet'
        };
    });

    const currentTheme = themeSettings[mode];
    const t = THEMES[currentTheme];

    useEffect(() => { localStorage.setItem('suno_mode', mode); }, [mode]);
    useEffect(() => { localStorage.setItem('suno_tab', activeTab); }, [activeTab]);
    useEffect(() => { localStorage.setItem('suno_lyrics_orig', lyricsOriginal); }, [lyricsOriginal]);
    useEffect(() => { localStorage.setItem('suno_lyrics_hira', lyricsHiragana); }, [lyricsHiragana]);
    useEffect(() => { localStorage.setItem('suno_prompt_params', JSON.stringify(promptParams)); }, [promptParams]);
    useEffect(() => { localStorage.setItem('suno_prompt_text', sunoPrompt); }, [sunoPrompt]);
    useEffect(() => { localStorage.setItem('suno_chat_history', JSON.stringify(chatMessages)); }, [chatMessages]);
    useEffect(() => { localStorage.setItem('suno_theme', JSON.stringify(themeSettings)); }, [themeSettings]);

    useEffect(() => {
        if (!chatSession.current) {
            chatSession.current = createChatSession();
        }
    }, []);

    const handleInsertTag = (tag: string) => {
        if (isEditing) {
            if (!lyricsRef.current) return;
            const start = lyricsRef.current.selectionStart;
            const end = lyricsRef.current.selectionEnd;
            const text = activeTab === 'original' ? lyricsOriginal : lyricsHiragana;
            const before = text.substring(0, start);
            const after = text.substring(end);
            const newText = before + tag + after;
            if (activeTab === 'original') setLyricsOriginal(newText);
            else setLyricsHiragana(newText);
            
            setTimeout(() => {
                if (lyricsRef.current) {
                    lyricsRef.current.focus();
                    lyricsRef.current.setSelectionRange(start + tag.length, start + tag.length);
                }
            }, 10);
        } else {
            if (selectedLineIndex < 0) {
                alert("タグを挿入したい行をタップして選択してください。");
                return;
            }
            const currentText = activeTab === 'original' ? lyricsOriginal : lyricsHiragana;
            const lines = currentText.split('\n');
            lines[selectedLineIndex] = tag + " " + (lines[selectedLineIndex] || "").trim();
            const newText = lines.join('\n');
            if (activeTab === 'original') setLyricsOriginal(newText);
            else setLyricsHiragana(newText);
        }
    };

    const handleAnalyzeArtist = async () => {
        if (!promptParams.artist.trim()) {
            alert("アーティスト名を入力してください。");
            return;
        }
        setIsAnalyzing(true);
        try {
            const result = await analyzeArtistStyle(promptParams.artist);
            if (result) {
                setPromptParams(prev => ({
                    ...prev,
                    vocalX: result.vocalX,
                    vocalY: result.vocalY,
                    genres: result.genres,
                    textures: result.textures,
                    instruments: result.instruments
                }));
            } else {
                alert("アーティストの分析に失敗しました。");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const base64 = reader.result as string;
                const result = await analyzeVocalAudio(base64, file.type);
                if (result) {
                    setPromptParams(prev => ({
                        ...prev,
                        vocalX: result.vocalX,
                        vocalY: result.vocalY,
                        textures: result.textures
                    }));
                } else {
                    alert("音声の分析に失敗しました。");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsAnalyzing(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleGeneratePrompt = async () => {
        setIsAnalyzing(true);
        try {
            const prompt = await generateSunoPrompt(promptParams);
            setSunoPrompt(prompt);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleChatSend = async (text: string) => {
        if (!chatSession.current) return;
        const userMsg: ChatMessage = { role: 'user', text };
        setChatMessages(prev => [...prev, userMsg]);
        setIsChatLoading(true);
        try {
            const response = await chatSession.current.sendMessage({ message: text });
            const modelMsg: ChatMessage = { role: 'model', text: response.text };
            setChatMessages(prev => [...prev, modelMsg]);
        } catch (e) {
            console.error(e);
        }
        setIsChatLoading(false);
    };

    const handleClearChat = () => {
        if (window.confirm("履歴をクリアしますか？")) {
            setChatMessages([]);
            chatSession.current = createChatSession();
        }
    };

    const currentLines = (activeTab === 'original' ? lyricsOriginal : lyricsHiragana).split('\n');

    return (
        <div className={`h-screen w-screen ${t.bgApp} transition-colors duration-500 flex flex-col overflow-hidden`}>
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-2 flex items-center justify-between sticky top-0 z-40 shadow-sm h-14 shrink-0">
                <div className="flex items-center gap-2">
                    <div className={`${t.buttonPrimary} p-2 rounded-lg text-white`}>
                        <IconSparkles />
                    </div>
                    <h1 className={`font-bold ${t.textPrimary} tracking-tight hidden sm:block`}>Suno Lyric Assist</h1>
                </div>

                <nav className="flex bg-gray-100 p-1 rounded-xl gap-0.5">
                    {(['lyrics', 'prompt', 'creation', 'chat'] as AppMode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => {setMode(m); setIsEditing(false);}}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                mode === m 
                                ? `${THEMES[themeSettings[m]].buttonPrimary} text-white shadow-sm` 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {m === 'lyrics' ? '歌詞' : m === 'prompt' ? 'プロンプト' : m === 'creation' ? '創作' : '相談'}
                        </button>
                    ))}
                </nav>

                <div className="flex gap-1">
                    <button onClick={() => setIsHelpOpen(true)} className="p-2 text-gray-400 hover:text-gray-600"><span className="text-xl">❓</span></button>
                    <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-gray-400 hover:text-gray-600"><span className="text-xl">⚙️</span></button>
                </div>
            </header>

            <main className="flex-1 flex flex-col overflow-hidden relative">
                {mode === 'lyrics' && (
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                        {/* Upper Half: Lyrics Editing/View (Exactly 50%) */}
                        <div className="flex-1 h-1/2 flex flex-col border-b-2 border-orange-100 bg-white shadow-sm overflow-hidden shrink-0">
                            <div className="p-2 flex gap-2 border-b border-gray-100 bg-gray-50/80 items-center shrink-0">
                                <Button active={activeTab === 'original'} onClick={() => setActiveTab('original')} themeColor={currentTheme} variant="tag" className="!py-1 !px-3 !text-xs">オリジナル</Button>
                                <Button active={activeTab === 'hiragana'} onClick={() => setActiveTab('hiragana')} themeColor={currentTheme} variant="tag" className="!py-1 !px-3 !text-xs">ひらがな</Button>
                                <div className="flex-1" />
                                <div className="flex gap-1">
                                    <Button variant="secondary" onClick={() => {}} themeColor={currentTheme} title="貼り付け"><IconPaste /></Button>
                                    <Button variant="secondary" onClick={() => {}} themeColor={currentTheme} title="コピー"><IconCopy /></Button>
                                    <Button variant="secondary" onClick={() => {if(window.confirm('歌詞を消去しますか？')){setLyricsOriginal(''); setLyricsHiragana('');}}} themeColor={currentTheme} className="!text-red-500"><IconTrash /></Button>
                                    <Button onClick={() => setIsEditing(!isEditing)} themeColor={currentTheme} variant="icon" className={`${isEditing ? 'bg-orange-500 text-white' : ''}`}>
                                        {isEditing ? <IconCheck /> : <IconPencil />}
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {isEditing ? (
                                    <textarea
                                        ref={lyricsRef}
                                        value={activeTab === 'original' ? lyricsOriginal : lyricsHiragana}
                                        onChange={(e) => activeTab === 'original' ? setLyricsOriginal(e.target.value) : setLyricsHiragana(e.target.value)}
                                        className="w-full h-full p-4 text-base outline-none resize-none font-medium leading-relaxed bg-orange-50/5"
                                        placeholder="ここに歌詞を入力してください..."
                                        spellCheck={false}
                                    />
                                ) : (
                                    <div ref={scrollContainerRef} className="p-3 space-y-1.5 select-none scroll-smooth">
                                        {currentLines.length === 0 || (currentLines.length === 1 && currentLines[0] === '') ? (
                                            <div className="py-20 flex items-center justify-center text-gray-300 italic text-sm text-center px-8">歌詞がありません。</div>
                                        ) : (
                                            currentLines.map((line, idx) => (
                                                <div 
                                                    key={idx} 
                                                    onClick={() => setSelectedLineIndex(idx)}
                                                    className={`py-2.5 px-4 rounded-lg cursor-pointer border-2 transition-colors ${selectedLineIndex === idx ? `${t.borderStrong} ${t.bgSoft}` : 'border-transparent bg-white hover:bg-gray-50'}`}
                                                >
                                                    <div className={`text-base leading-relaxed ${line.trim().startsWith('[') ? 'font-black text-gray-400 italic text-xs' : 'text-gray-800'}`}>
                                                        {line || <span className="opacity-10">—</span>}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        <div className="h-4" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lower Half: Tags (Exactly 50%) */}
                        <div className="flex-1 h-1/2 flex flex-col bg-white overflow-hidden shrink-0">
                            <TagPanel onInsertTag={handleInsertTag} themeColor={currentTheme} />
                        </div>
                    </div>
                )}

                {mode === 'prompt' && (
                    <div className="flex-1 flex flex-col overflow-y-auto bg-gray-50 p-4 pb-24 scroll-smooth">
                        <div className="max-w-xl mx-auto w-full space-y-4">
                            {/* Artist Style Analysis (Restored with Feedback) */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-2">
                                <h3 className={`text-sm font-bold ${t.textPrimary} mb-4 flex items-center gap-2`}>👤 アーティスト再現</h3>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="アーティスト名 (例: 宇多田ヒカル)..."
                                        className={`flex-1 px-4 py-2 text-sm border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 transition-all ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        value={promptParams.artist}
                                        onChange={(e) => setPromptParams(p => ({...p, artist: e.target.value}))}
                                        disabled={isAnalyzing}
                                    />
                                    <Button 
                                        onClick={handleAnalyzeArtist} 
                                        disabled={isAnalyzing} 
                                        themeColor={currentTheme}
                                        className="min-w-[80px]"
                                    >
                                        {isAnalyzing ? '分析中...' : '分析'}
                                    </Button>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 ml-1">
                                    {isAnalyzing ? '✨ Geminiが音楽スタイルを読み取っています...' : 'Geminiが特徴を分析し、最適なプロンプト設定を適用します。'}
                                </p>
                            </div>

                            {/* Vocal Controls */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className={`text-sm font-bold ${t.textPrimary} mb-4 flex items-center gap-2`}><IconSparkles /> ボーカルXY設定</h3>
                                <XYPad x={promptParams.vocalX} y={promptParams.vocalY} onChange={(x, y) => setPromptParams(p => ({...p, vocalX: x, vocalY: y}))} />
                                <div className="mt-4 flex justify-center gap-2">
                                    <Button variant="secondary" onClick={() => playVoiceSample("これはサンプルの声です。", promptParams.vocalX, promptParams.vocalY)} themeColor={currentTheme}>🔊 試聴</Button>
                                    <Button variant="secondary" onClick={() => audioInputRef.current?.click()} themeColor={currentTheme} disabled={isAnalyzing}>
                                        {isAnalyzing ? '分析中...' : '🎙️ 音声分析'}
                                    </Button>
                                    <input type="file" ref={audioInputRef} onChange={handleAudioUpload} accept="audio/*" className="hidden" />
                                </div>
                            </div>

                            {/* Options cards */}
                            {[
                                { title: '声の質感', key: 'textures', options: VOCAL_TEXTURES },
                                { title: 'ジャンル', key: 'genres', options: GENRES },
                                { title: '楽器', key: 'instruments', options: EMPHASIS_INSTRUMENTS }
                            ].map(section => (
                                <div key={section.key} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                    <h3 className={`text-sm font-bold ${t.textPrimary} mb-3`}>{section.title}</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {section.options.map(opt => (
                                            <button 
                                                key={opt}
                                                onClick={() => setPromptParams(p => ({...p, [section.key]: (p[section.key as keyof PromptParams] as string[]).includes(opt) ? (p[section.key as keyof PromptParams] as string[]).filter(i => i !== opt) : [...(p[section.key as keyof PromptParams] as string[]), opt]}))}
                                                className={`px-3 py-1.5 rounded-full text-[11px] transition-all ${(promptParams[section.key as keyof PromptParams] as string[]).includes(opt) ? `${t.buttonPrimary} text-white shadow-md` : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <Button 
                                className="w-full py-5 text-xl font-bold shadow-xl rounded-2xl transition-all" 
                                onClick={handleGeneratePrompt} 
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? 'AI生成中...' : 'プロンプトを確定'}
                            </Button>

                            {sunoPrompt && (
                                <div className={`${t.buttonPrimary} text-white p-6 rounded-3xl shadow-2xl mt-4 animate-in zoom-in-95`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Suno Style Tags</span>
                                        <button onClick={() => {navigator.clipboard.writeText(sunoPrompt); alert("コピーしました");}} className="p-2 hover:bg-white/10 rounded-lg"><IconCopy /></button>
                                    </div>
                                    <p className="text-sm font-mono break-words leading-relaxed select-all">{sunoPrompt}</p>
                                </div>
                            )}
                            <div className="h-10" />
                        </div>
                    </div>
                )}

                {mode === 'creation' && (
                    <div className="flex-1 flex flex-col overflow-y-auto bg-gray-50 p-6 pb-24 scroll-smooth">
                        <div className="max-w-2xl mx-auto w-full space-y-8">
                             <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center border border-gray-100">
                                <h2 className="text-2xl font-black mb-2 text-gray-800">Lyric Visualization</h2>
                                <p className="text-sm text-gray-500 mb-6">歌詞の情景をAIが読み取ってビジュアル化します</p>
                                <Button 
                                    className="w-full py-4 text-lg mt-4 shadow-lg" 
                                    onClick={async () => {
                                        if(!lyricsOriginal) { alert("歌詞を入力してください"); return; }
                                        setIsAnalyzing(true);
                                        try {
                                            const res = await generateVisualPrompts(lyricsOriginal);
                                            setVisualResult(res);
                                            if(res) {
                                                const img = await generateImage(res.imagePrompt);
                                                setGeneratedImageUrl(img);
                                            }
                                        } finally {
                                            setIsAnalyzing(false);
                                        }
                                    }} 
                                    disabled={isAnalyzing}
                                >
                                    {isAnalyzing ? 'イメージを構築中...' : 'イメージを生成'}
                                </Button>
                                {generatedImageUrl && (
                                    <div className="mt-10 animate-in fade-in zoom-in duration-700">
                                        <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                            <img src={generatedImageUrl} className="w-full h-auto" />
                                        </div>
                                        <div className="bg-gray-900 text-white p-4 mt-4 rounded-xl text-left">
                                            <p className="text-orange-400 text-xs font-bold mb-1">{visualResult?.sceneDescription}</p>
                                            <p className="text-[10px] opacity-60 italic leading-relaxed">{visualResult?.imagePrompt}</p>
                                        </div>
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>
                )}

                {mode === 'chat' && (
                    <div className="flex-1 h-full overflow-hidden">
                        <ChatInterface messages={chatMessages} onSendMessage={handleChatSend} isLoading={isChatLoading} onClear={handleClearChat} />
                    </div>
                )}
            </main>

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={themeSettings} onUpdateSettings={setThemeSettings} />
            <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        </div>
    );
};
