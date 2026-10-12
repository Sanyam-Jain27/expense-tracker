"use client";

import dynamic from "next/dynamic";
import React, { useState, memo } from "react";
import { IEmojiObject } from "@/lib/types";

// Dynamically import heavy EmojiPicker
const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="w-[300px] h-[350px] bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 shadow-2xl">
      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2" />
      <span className="text-xs text-slate-500 font-medium">Loading emojis...</span>
    </div>
  ),
});

interface DynamicEmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  title?: string;
}

const DynamicEmojiPicker: React.FC<DynamicEmojiPickerProps> = ({
  value,
  onChange,
  title = "Select icon",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (emojiObj: IEmojiObject) => {
    onChange(emojiObj.emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-11 h-10 flex items-center justify-center text-2xl border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer select-none active:scale-95"
        title={title}
      >
        {value}
      </button>

      {isOpen && (
        <>
          {/* Click outside backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-12 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
            <EmojiPicker onEmojiClick={handleSelect} />
          </div>
        </>
      )}
    </div>
  );
};

export default memo(DynamicEmojiPicker);

