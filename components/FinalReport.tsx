import React from 'react';
import { FinalAnalysis, DailyReport, DayPlan } from '../types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Trophy, TrendingUp, AlertTriangle, ArrowRight, RefreshCcw, Moon, Sun } from 'lucide-react';

interface FinalReportProps {
  analysis: FinalAnalysis;
  reports: Record<number, DailyReport>;
  plan: DayPlan[];
  onRestart: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const FinalReport: React.FC<FinalReportProps> = ({ analysis, reports, onRestart, plan, isDarkMode, toggleDarkMode }) => {
  const chartData = (Object.values(reports) as DailyReport[]).sort((a, b) => a.day - b.day).map(r => ({
    day: `Day ${r.day}`,
    mood: r.mood,
    activities: r.activitiesCompleted.length,
    totalActivities: plan.find(p => p.day === r.day)?.activities.length || 5,
    completionRate: (r.activitiesCompleted.length / (plan.find(p => p.day === r.day)?.activities.length || 1)) * 100
  }));

  // Chart colors for dark/light mode
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';
  const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff';
  const tooltipText = isDarkMode ? '#f8fafc' : '#1e293b';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Trophy className="w-10 h-10 text-yellow-500" />
              Challenge Complete!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Here is your comprehensive performance analysis.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={toggleDarkMode}
              className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={onRestart}
              className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-medium flex items-center gap-2 transition-all shadow-sm"
            >
              <RefreshCcw className="w-4 h-4" />
              Start New Goal
            </button>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-slate-400 dark:text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Consistency Score</span>
            <div className="relative flex items-center justify-center mt-2 mr-2">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke={isDarkMode ? "#334155" : "#f1f5f9"} strokeWidth="8" fill="transparent" />
                <circle 
                  cx="64" cy="64" r="56" 
                  stroke={analysis.consistencyScore > 80 ? '#22c55e' : analysis.consistencyScore > 50 ? '#eab308' : '#ef4444'} 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={351.86} 
                  strokeDashoffset={351.86 - (351.86 * analysis.consistencyScore) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-3xl font-bold text-slate-800 dark:text-white">{analysis.consistencyScore}%</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Executive Summary</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
              {analysis.summary}
            </p>
          </div>
        </div>

        {/* Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Mood Trajectory</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey="day" hide />
                  <YAxis domain={[0, 10]} hide />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      backgroundColor: tooltipBg,
                      color: tooltipText
                    }}
                    labelStyle={{ color: tooltipText }}
                    itemStyle={{ color: tooltipText }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorMood)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-2">Day 1 - Day 21</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Task Completion Rate</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey="day" hide />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip 
                     cursor={{fill: isDarkMode ? '#1e293b' : '#f1f5f9'}}
                     contentStyle={{ 
                       borderRadius: '12px', 
                       border: 'none', 
                       boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                       backgroundColor: tooltipBg,
                       color: tooltipText
                     }}
                     labelStyle={{ color: tooltipText }}
                     itemStyle={{ color: tooltipText }}
                  />
                  <Bar dataKey="completionRate" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.completionRate === 100 ? '#22c55e' : '#94a3b8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-2">Day 1 - Day 21</p>
          </div>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-green-50 dark:bg-green-950/30 p-8 rounded-2xl border border-green-100 dark:border-green-900/50">
            <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Key Strengths
            </h3>
            <ul className="space-y-3">
              {analysis.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-green-700 dark:text-green-300">
                  <div className="min-w-[6px] h-[6px] rounded-full bg-green-500 mt-2.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 p-8 rounded-2xl border border-amber-100 dark:border-amber-900/50">
            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Areas for Growth
            </h3>
            <ul className="space-y-3">
              {analysis.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-3 text-amber-700 dark:text-amber-300">
                  <div className="min-w-[6px] h-[6px] rounded-full bg-amber-500 mt-2.5" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-indigo-600 dark:bg-indigo-700 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg">
           <div className="absolute top-0 right-0 p-12 opacity-10">
              <ArrowRight className="w-64 h-64" />
           </div>
           <h3 className="text-2xl font-bold mb-4 relative z-10">What's Next?</h3>
           <p className="text-indigo-100 dark:text-indigo-200 text-lg leading-relaxed max-w-2xl relative z-10">
             {analysis.nextSteps}
           </p>
        </div>
      </div>
    </div>
  );
};