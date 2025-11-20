import React, { useState, useMemo, useCallback } from 'react';
import { countWords, calculateReadingTime } from '../lib/ReadingMath';

const ReadingTimeTool: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [wpm, setWpm] = useState<number>(200);

  const wordCount = useMemo(() => countWords(text), [text]);
  const readingTime = useMemo(() => calculateReadingTime(wordCount, wpm), [wordCount, wpm]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };
  
  const handleWpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setWpm(value > 0 ? value : 1);
  };

  const clearText = useCallback(() => {
    setText('');
  }, []);

  const copyText = useCallback(() => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }, [text]);

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto border border-slate-700/50">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Text Area & Controls */}
        <div className="flex-grow lg:w-2/3 flex flex-col">
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Paste your text here to begin..."
            className="w-full flex-grow h-80 md:h-96 p-4 bg-slate-800/70 border-2 border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 resize-none text-base placeholder-slate-500"
          />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={copyText}
              className="py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!text}
            >
              Copy Text
            </button>
            <button
              onClick={clearText}
              className="py-3 px-4 bg-pink-600 hover:bg-pink-700 rounded-md font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!text}
            >
              Clear Text
            </button>
          </div>
        </div>

        {/* Right Side: Metrics Dashboard */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700">
            <label htmlFor="wpm-input" className="block text-sm font-medium text-purple-300 mb-2">
              Reading Speed (WPM)
            </label>
            <input
              id="wpm-input"
              type="number"
              value={wpm}
              onChange={handleWpmChange}
              className="w-full p-3 bg-slate-900 border-2 border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-2xl font-semibold text-center"
              min="1"
            />
          </div>
          
          <div className="flex-grow space-y-4 text-center p-6 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl border border-purple-700/50 flex flex-col justify-center">
            <div>
              <p className="text-base uppercase text-purple-300 tracking-wider">Reading Time</p>
              <p className="text-5xl font-bold text-white mt-1">
                {readingTime.minutes > 0 && <span>{readingTime.minutes}<span className="text-3xl opacity-70">m</span> </span>}
                <span>{readingTime.seconds}<span className="text-3xl opacity-70">s</span></span>
              </p>
            </div>
            <div className="border-t border-purple-500/30 my-4"></div>
            <div>
              <p className="text-base uppercase text-purple-300 tracking-wider">Word Count</p>
              <p className="text-5xl font-bold text-white mt-1">{wordCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingTimeTool;
