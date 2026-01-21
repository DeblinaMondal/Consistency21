import React from 'react';
import { DayPlan, DailyReport } from '../types';
import { Check, Lock, ChevronRight, FileText, Moon, Sun } from 'lucide-react';

interface CalendarGridProps {
  goal: string;
  plan: DayPlan[];
  reports: Record<number, DailyReport>;
  onSelectDay: (day: DayPlan) => void;
  onFinish: () => void;
  canFinish: boolean;
  onDemoFill: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  goal, 
  plan, 
  reports, 
  onSelectDay, 
  onFinish,
  canFinish,
  onDemoFill,
  isDarkMode,
  toggleDarkMode
}) => {
  const completedDays = (Object.values(reports) as DailyReport[]).filter(r => r.completed).length;
  const progress = (completedDays / 21) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">21 Day Challenge</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-md" title={goal}>{goal}</p>
          </div>
          
          <div className="flex items-center gap-6 w-full md:w-auto">
             <div className="flex-1 md:w-64">
              <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                <span>Progress</span>
                <span>{completedDays}/21 Days</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2 items-center">
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                 <button 
                  onClick={onDemoFill}
                  className="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                  title="Auto-complete days for demo purposes"
                >
                  Simulate
                </button>
                <button
                  onClick={onFinish}
                  disabled={!canFinish}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                    canFinish 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-indigo-900/50' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                >
                  Generate Report
                  <ChevronRight className="w-4 h-4" />
                </button>
            </div>
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plan.map((dayPlan) => {
              const report = reports[dayPlan.day];
              const isCompleted = report?.completed;
              // In a real app, we might lock future days. For this demo, all are accessible.
              const isLocked = false; 

              return (
                <div 
                  key={dayPlan.day}
                  onClick={() => !isLocked && onSelectDay(dayPlan)}
                  className={`group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[180px] hover:shadow-lg dark:hover:shadow-slate-900/50 ${
                    isCompleted 
                      ? 'border-indigo-100 dark:border-indigo-900/50' 
                      : 'border-slate-100 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-400/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
                      isCompleted 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'
                    }`}>
                      {dayPlan.day}
                    </span>
                    {isCompleted && (
                      <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 p-1.5 rounded-full">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-700 dark:text-slate-300 group-hover:text-indigo-900 dark:group-hover:text-indigo-300'}`}>
                      {dayPlan.title}
                    </h3>
                    <p className="text-sm text-slate-400 dark:text-slate-500 line-clamp-2">
                       {dayPlan.guidance}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                      {dayPlan.activities.length} Activities
                    </span>
                    {!isCompleted && (
                        <span className="text-xs text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1">
                            Open <ChevronRight className="w-3 h-3" />
                        </span>
                    )}
                     {isCompleted && (
                        <span className="text-xs text-indigo-400 dark:text-indigo-300 flex items-center gap-1">
                            <FileText className="w-3 h-3" /> View Report
                        </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};