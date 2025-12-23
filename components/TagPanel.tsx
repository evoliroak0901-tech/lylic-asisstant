
import React, { useState } from 'react';
import { SUNO_TAGS, THEMES } from '../constants';
import { Button } from './Button';
import { ThemeColor } from '../types';

interface TagPanelProps {
  onInsertTag: (tag: string) => void;
  themeColor: ThemeColor;
}

export const TagPanel: React.FC<TagPanelProps> = ({ onInsertTag, themeColor }) => {
  const t = THEMES[themeColor];
  const [customTag, setCustomTag] = useState("");

  const getCategoryName = (name: string) => {
      switch(name) {
          case "Structure": return "構成 (Structure)";
          case "Vocals": return "ボーカル (Vocals)";
          case "Instruments": return "楽器 (Instruments)";
          case "Mood & Speed": return "ムード・速度 (Mood)";
          default: return name;
      }
  };

  const handleAddCustom = () => {
    if (customTag.trim()) {
        const val = customTag.startsWith('[') && customTag.endsWith(']') ? customTag : `[${customTag}]`;
        onInsertTag(val);
        setCustomTag("");
    }
  };

  return (
    <div className={`flex-1 h-full flex flex-col ${t.bgPanel} overflow-hidden`}>
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {/* Insertion Guide */}
        <div className="flex items-center justify-center gap-2 mb-4 opacity-60 shrink-0">
          <div className="h-px w-8 bg-gray-400"></div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
              タップでタグを挿入
          </span>
          <div className="h-px w-8 bg-gray-400"></div>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          {/* Custom Input */}
          <div className="flex gap-2 mb-2 px-1 shrink-0">
               <input 
                  type="text" 
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                  placeholder="カスタムタグ..."
                  className="flex-1 px-4 py-2 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-orange-500 shadow-sm transition-colors"
               />
               <Button variant="secondary" onClick={handleAddCustom} themeColor={themeColor} className="px-5 font-bold text-lg whitespace-nowrap">
                   ＋
               </Button>
          </div>

          {SUNO_TAGS.map((category) => (
            <div key={category.name} className="space-y-3">
              <h3 className={`text-[11px] font-black ${t.textSecondary} uppercase tracking-tighter ml-1 opacity-80 border-l-4 ${t.borderStrong.replace('border-', 'border-')} pl-2`}>
                {getCategoryName(category.name)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.tags.map((tag) => (
                  <Button
                    key={tag.value}
                    variant="tag"
                    themeColor={themeColor}
                    onClick={() => onInsertTag(tag.value)}
                    className="flex-grow md:flex-grow-0 !py-2.5 !px-3 !text-[11px] shadow-sm active:scale-95"
                  >
                    {tag.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
          
          {/* Bottom spacing */}
          <div className="h-10 shrink-0" />
        </div>
      </div>
    </div>
  );
};
