
import React from 'react';
import { Button } from './Button';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-orange-50">
                    <h2 className="font-bold text-orange-700 flex items-center gap-2">
                        <span className="text-xl">📚</span> 使い方ガイド
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white no-scrollbar">
                    
                    {/* Lyrics */}
                    <section className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                             </div>
                             <h3 className="font-bold text-gray-800">1. 歌詞エディタ (Lyrics)</h3>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                            <li><span className="font-bold text-gray-800">ひらがな変換 (AI):</span> 漢字混じりの歌詞をAIが読み仮名（ひらがな）に変換します。Suno AIでの発音ミス防止に役立ちます。</li>
                            <li><span className="font-bold text-gray-800">Sunoタグ挿入:</span> 画面下部のパネルから <code className="bg-gray-100 px-1 rounded">[Chorus]</code> などの構成タグをワンタップで挿入できます。</li>
                            <li><span className="font-bold text-gray-800">カスタムタグ:</span> 自分でタグ名を入力して追加も可能です。</li>
                        </ul>
                    </section>

                    {/* Prompt */}
                    <section className="space-y-3">
                         <div className="flex items-center gap-2 mb-2">
                             <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                             </div>
                             <h3 className="font-bold text-gray-800">2. プロンプト生成 (Prompt)</h3>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                            <li><span className="font-bold text-gray-800">ボーカルXYパッド:</span> 性別と音高を直感的に操作できます。「試聴」ボタンで声のイメージを確認できます。</li>
                            <li><span className="font-bold text-gray-800">音声分析:</span> 手持ちのmp3/wavファイルをアップロードすると、AIが声質を分析し、設定に反映させます。</li>
                            <li><span className="font-bold text-gray-800">プリセット保存:</span> 気に入ったボーカル設定に名前をつけて保存できます。</li>
                            <li><span className="font-bold text-gray-800">プロンプト生成:</span> ジャンルや楽器を選択し、Suno AI用の英語プロンプト（1000文字以内）を生成します。</li>
                        </ul>
                    </section>

                    {/* Creation */}
                    <section className="space-y-3">
                         <div className="flex items-center gap-2 mb-2">
                             <div className="bg-violet-100 p-2 rounded-lg text-violet-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                             </div>
                             <h3 className="font-bold text-gray-800">3. 世界観ビジュアライズ (Creation)</h3>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                            <li><span className="font-bold text-gray-800">画像生成:</span> 歌詞全体からイメージ画像を作成します。</li>
                            <li><span className="font-bold text-gray-800">Sora 2 動画作成:</span> 歌詞のセクション（イントロ、サビなど）を選択すると、その部分（約10秒）の情景を再現する動画用プロンプトを生成します。</li>
                        </ul>
                    </section>

                    {/* Chat */}
                    <section className="space-y-3">
                         <div className="flex items-center gap-2 mb-2">
                             <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                             </div>
                             <h3 className="font-bold text-gray-800">4. 相談 (Chat)</h3>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                            <li><span className="font-bold text-gray-800">AIアシスタント:</span> 作詞の続き、韻の提案、構成の相談など、音楽制作に関するあらゆる相談ができます。</li>
                            <li><span className="font-bold text-gray-800">画像編集:</span> 生成した画像をチャットに送り、修正指示を出すことも可能です。</li>
                        </ul>
                    </section>

                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                    <Button onClick={onClose} className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                        閉じる
                    </Button>
                </div>
            </div>
        </div>
    );
};
