import React, { useState } from 'react';
import { Target, ArrowRight, Sparkles, Moon, Sun } from 'lucide-react';

interface GoalInputProps {
  onGenerate: (goal: string) => void;
  isLoading: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const GoalInput: React.FC<GoalInputProps> = ({ onGenerate, isLoading, isDarkMode, toggleDarkMode }) => {
  const [goal, setGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) {
      onGenerate(goal);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-900 dark:to-slate-950 p-6 transition-colors duration-300">
      
      <button 
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all"
        aria-label="Toggle Dark Mode"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden p-8 md:p-12 transition-all hover:shadow-2xl border border-transparent dark:border-slate-700">
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full">
            <Target className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-4">
          21 Days to a New You
        </h1>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-10 text-lg">
          Consistency is the key to mastery. Enter a goal you want to achieve, and we'll craft a personalized 21-day roadmap for you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Learn basic Spanish, Run 5k, Meditate daily..."
              className="w-full text-lg px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-white"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={!goal.trim() || isLoading}
            className={`w-full py-4 rounded-xl text-lg font-semibold text-white flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
              !goal.trim() || isLoading
                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500 dark:text-slate-500'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30'
            }`}
          >
            {isLoading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Crafting your plan...
              </>
            ) : (
              <>
                Start My Journey
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700 flex justify-center gap-6 text-slate-400 dark:text-slate-500 text-sm">
          <span className="flex items-center gap-1"><Sparkles className="w-4 h-4" /> AI Powered</span>
          <span className="flex items-center gap-1">✨ Personalized</span>
          <span className="flex items-center gap-1">📅 21 Day Plan</span>
        </div>
      </div>
    </div>
  );
};