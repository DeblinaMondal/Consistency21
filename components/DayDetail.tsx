import React, { useState, useEffect } from 'react';
import { DayPlan, DailyReport } from '../types';
import { X, CheckCircle2, Circle, Save, Smile, Meh, Frown } from 'lucide-react';

interface DayDetailProps {
  dayPlan: DayPlan;
  existingReport: DailyReport | undefined;
  onClose: () => void;
  onSaveReport: (report: DailyReport) => void;
}

export const DayDetail: React.FC<DayDetailProps> = ({ dayPlan, existingReport, onClose, onSaveReport }) => {
  const [completedActivities, setCompletedActivities] = useState<number[]>([]);
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState<number>(5); // 1-10

  useEffect(() => {
    if (existingReport) {
      setCompletedActivities(existingReport.activitiesCompleted);
      setNotes(existingReport.notes);
      setMood(existingReport.mood);
    } else {
      setCompletedActivities([]);
      setNotes('');
      setMood(8);
    }
  }, [existingReport, dayPlan]);

  const toggleActivity = (index: number) => {
    setCompletedActivities(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleSave = () => {
    const isFullComplete = completedActivities.length === dayPlan.activities.length;
    
    const report: DailyReport = {
      day: dayPlan.day,
      completed: isFullComplete,
      activitiesCompleted: completedActivities,
      notes,
      mood,
      timestamp: Date.now()
    };
    onSaveReport(report);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-indigo-600 dark:bg-indigo-700 p-6 text-white flex justify-between items-start shrink-0">
          <div>
            <span className="inline-block px-3 py-1 bg-indigo-500/50 dark:bg-black/20 rounded-full text-sm font-medium mb-2 backdrop-blur-md border border-white/20">
              Day {dayPlan.day}
            </span>
            <h2 className="text-2xl font-bold leading-tight">{dayPlan.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 md:p-8 space-y-8">
          {/* Guidance Section */}
          <div className="prose prose-slate dark:prose-invert">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Today's Focus</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {dayPlan.guidance}
            </p>
          </div>

          {/* Activities Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              Action Items
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                {completedActivities.length}/{dayPlan.activities.length}
              </span>
            </h3>
            <div className="space-y-3">
              {dayPlan.activities.map((activity, idx) => {
                const isCompleted = completedActivities.includes(idx);
                return (
                  <div 
                    key={idx}
                    onClick={() => toggleActivity(idx)}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer select-none ${
                      isCompleted 
                        ? 'border-green-500/20 bg-green-50 dark:bg-green-900/20 dark:border-green-800/50' 
                        : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className={`mt-0.5 shrink-0 transition-colors ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-slate-300 dark:text-slate-600'}`}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </div>
                    <span className={`text-base ${isCompleted ? 'text-slate-700 dark:text-slate-400 line-through decoration-slate-400 dark:decoration-slate-600' : 'text-slate-700 dark:text-slate-300'}`}>
                      {activity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Report Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Daily Report</h3>
            
            {/* Mood Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">How do you feel today?</label>
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                 <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={mood} 
                    onChange={(e) => setMood(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                 />
                 <div className="ml-4 w-12 text-center font-bold text-indigo-600 dark:text-indigo-400 text-xl">{mood}</div>
              </div>
              <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-2 px-2">
                <span className="flex items-center gap-1"><Frown className="w-3 h-3"/> Struggling</span>
                <span className="flex items-center gap-1">Meh <Meh className="w-3 h-3"/></span>
                <span className="flex items-center gap-1">Amazing <Smile className="w-3 h-3"/></span>
              </div>
            </div>

            {/* Journal Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Journal Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What went well? What was hard? Write your thoughts here..."
                className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none resize-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-2.5 bg-indigo-600 dark:bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 dark:hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 dark:shadow-indigo-900/50 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Report
          </button>
        </div>
      </div>
    </div>
  );
};