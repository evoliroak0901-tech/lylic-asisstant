
import React, { useState } from 'react';
import { Button } from './Button';
import { THEMES } from '../constants';

interface ApiKeyModalProps {
    onSave: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
    const [inputKey, setInputKey] = useState('');
    const [isOpenTutorial, setIsOpenTutorial] = useState(true);
    const t = THEMES['orange']; // Default theme for landing

    const handleSave = () => {
        if (inputKey.trim().length > 10) {
            onSave(inputKey.trim());
        } else {
            alert("有効なAPIキーを入力してください");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-orange-50/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-orange-100 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Suno Lyric Assist へようこそ</h1>
                    <p className="text-sm text-gray-500">
                        このアプリを利用するには、Googleの無料AIキーが必要です。<br/>
                        あなたのキーはブラウザ内にのみ保存され、外部サーバーには送信されません。
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 no-scrollbar">
                    {/* Tutorial Section */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
                        <button 
                            onClick={() => setIsOpenTutorial(!isOpenTutorial)}
                            className="flex items-center justify-between w-full text-left font-bold text-orange-600 mb-2"
                        >
                            <span className="flex items-center gap-2">
                                <span className="bg-orange-100 p-1 rounded">🔑</span> APIキーの取得方法（無料・3分）
                            </span>
                            <span>{isOpenTutorial ? '▲' : '▼'}</span>
                        </button>
                        
                        {isOpenTutorial && (
                            <div className="space-y-4 mt-4 text-sm text-gray-600 border-t border-gray-100 pt-4 animate-in slide-in-from-top-2">
                                <div className="flex gap-3">
                                    <div className="flex-none w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">1</div>
                                    <div>
                                        <p className="font-bold text-gray-800">Google AI Studio にアクセス</p>
                                        <p>Googleアカウントでログインしてください。</p>
                                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="inline-block mt-1 text-blue-500 underline hover:text-blue-700">
                                            🔗 https://aistudio.google.com/app/apikey
                                        </a>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-none w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">2</div>
                                    <div>
                                        <p className="font-bold text-gray-800">キーを作成</p>
                                        <p>画面左上の <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded">Create API key</span> ボタンを押します。</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-none w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">3</div>
                                    <div>
                                        <p className="font-bold text-gray-800">コピーして貼り付け</p>
                                        <p>作成されたキー（AIza...で始まる文字列）をコピーして、下の入力欄に貼り付けてください。</p>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 p-3 rounded text-xs text-yellow-800 border border-yellow-100 mt-2">
                                    <strong>※ 注意:</strong> 料金はかかりませんが、無料プランには回数制限があります。短時間に大量の生成を行うと一時的にエラーになる場合があります。
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Section */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700">
                            APIキーを入力
                        </label>
                        <input 
                            type="password" 
                            value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none text-lg font-mono tracking-wide transition-all"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-gray-100">
                    <Button 
                        onClick={handleSave} 
                        className="w-full py-4 text-lg font-bold shadow-orange-200 shadow-lg"
                        disabled={inputKey.length < 10}
                    >
                        はじめる
                    </Button>
                </div>

            </div>
        </div>
    );
};
