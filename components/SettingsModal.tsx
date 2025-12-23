
import React from 'react';
import { ThemeSettings, ThemeColor } from '../types';
import { Button } from './Button';
import { THEMES } from '../constants';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: ThemeSettings;
    onUpdateSettings: (newSettings: ThemeSettings) => void;
    onRemoveApiKey?: () => void;
}

const COLORS: { key: ThemeColor; label: string; bg: string }[] = [
    { key: 'orange', label: 'Orange', bg: 'bg-orange-500' },
    { key: 'blue', label: 'Blue', bg: 'bg-blue-500' },
    { key: 'emerald', label: 'Green', bg: 'bg-emerald-500' },
    { key: 'violet', label: 'Purple', bg: 'bg-violet-500' },
    { key: 'rose', label: 'Pink', bg: 'bg-rose-500' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings, onRemoveApiKey }) => {
    if (!isOpen) return null;

    const handleColorChange = (mode: keyof ThemeSettings, color: ThemeColor) => {
        onUpdateSettings({ ...settings, [mode]: color });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="font-bold text-gray-700">アプリ設定</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Chat Settings */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                             <span className="text-xl">💬</span>
                             <label className="text-sm font-bold text-gray-600">相談タブ (Chat)</label>
                        </div>
                        <div className="flex gap-3 justify-between">
                            {COLORS.map((c) => (
                                <button
                                    key={c.key}
                                    onClick={() => handleColorChange('chat', c.key)}
                                    className={`w-8 h-8 rounded-full ${c.bg} transition-all ${settings.chat === c.key ? 'ring-4 ring-offset-2 ring-gray-300 scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Lyrics Settings */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                             <span className="text-xl">📝</span>
                             <label className="text-sm font-bold text-gray-600">歌詞タブ (Lyrics)</label>
                        </div>
                        <div className="flex gap-3 justify-between">
                            {COLORS.map((c) => (
                                <button
                                    key={c.key}
                                    onClick={() => handleColorChange('lyrics', c.key)}
                                    className={`w-8 h-8 rounded-full ${c.bg} transition-all ${settings.lyrics === c.key ? 'ring-4 ring-offset-2 ring-gray-300 scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Prompt Settings */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                             <span className="text-xl">🎵</span>
                             <label className="text-sm font-bold text-gray-600">プロンプトタブ (Prompt)</label>
                        </div>
                        <div className="flex gap-3 justify-between">
                            {COLORS.map((c) => (
                                <button
                                    key={c.key}
                                    onClick={() => handleColorChange('prompt', c.key)}
                                    className={`w-8 h-8 rounded-full ${c.bg} transition-all ${settings.prompt === c.key ? 'ring-4 ring-offset-2 ring-gray-300 scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    </div>

                     {/* API Key Management */}
                     {onRemoveApiKey && (
                        <>
                            <hr className="border-gray-100" />
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-600">アカウント設定</label>
                                <Button variant="secondary" onClick={onRemoveApiKey} className="w-full !text-red-500 !border-red-100 hover:!bg-red-50">
                                    APIキーを削除 (ログアウト)
                                </Button>
                            </div>
                        </>
                    )}
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
