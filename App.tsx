import React, { useState, useEffect } from 'react';
import { UserState, AppView, DayPlan, DailyReport, FinalAnalysis } from './types';
import { generate21DayPlan, generateFinalAnalysis } from './services/geminiService';
import { GoalInput } from './components/GoalInput';
import { CalendarGrid } from './components/CalendarGrid';
import { DayDetail } from './components/DayDetail';
import { FinalReport } from './components/FinalReport';
import { Loader2 } from 'lucide-react';

const STORAGE_KEY = 'consistency21_state_v1';
const THEME_KEY = 'consistency21_theme';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.ONBOARDING);
  const [state, setState] = useState<UserState>({
    goal: '',
    plan: [],
    reports: {},
    finalAnalysis: null,
    startDate: 0,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(THEME_KEY) === 'dark' ||
             (!('consistency21_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Apply Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.plan && parsed.plan.length > 0) {
          setState(parsed);
          setView(parsed.finalAnalysis ? AppView.REPORT : AppView.CALENDAR);
        }
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (state.plan.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const handleGeneratePlan = async (goal: string) => {
    setIsLoading(true);
    setLoadingMessage('Consulting the experts...');
    try {
      const plan = await generate21DayPlan(goal);
      setState({
        goal,
        plan,
        reports: {},
        finalAnalysis: null,
        startDate: Date.now()
      });
      setView(AppView.CALENDAR);
    } catch (error) {
      console.error(error);
      alert('Failed to generate plan. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleSaveReport = (report: DailyReport) => {
    setState(prev => ({
      ...prev,
      reports: {
        ...prev.reports,
        [report.day]: report
      }
    }));
  };

  const handleGenerateFinalReport = async () => {
    const completedReports = Object.values(state.reports) as DailyReport[];
    if (completedReports.length === 0) {
      alert("Please complete at least one day before generating a report.");
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Analyzing your journey...');
    try {
      const analysis = await generateFinalAnalysis(state.goal, completedReports, state.plan);
      setState(prev => ({ ...prev, finalAnalysis: analysis }));
      setView(AppView.REPORT);
    } catch (error) {
      console.error(error);
      alert('Failed to generate final report.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    if (confirm("Are you sure? This will clear your current progress.")) {
      localStorage.removeItem(STORAGE_KEY);
      setState({
        goal: '',
        plan: [],
        reports: {},
        finalAnalysis: null,
        startDate: 0
      });
      setView(AppView.ONBOARDING);
    }
  };

  const handleDemoFill = () => {
    const newReports: Record<number, DailyReport> = {};
    state.plan.forEach(day => {
      const completedCount = Math.floor(Math.random() * (day.activities.length + 1));
      const activityIndices = Array.from({length: completedCount}, (_, i) => i);
      const isComplete = completedCount === day.activities.length;
      
      newReports[day.day] = {
        day: day.day,
        completed: isComplete,
        activitiesCompleted: activityIndices,
        notes: `Demo note for day ${day.day}. Felt ${isComplete ? 'great' : 'okay'}.`,
        mood: Math.floor(Math.random() * 5) + 5, // 5-10
        timestamp: Date.now()
      };
    });
    setState(prev => ({ ...prev, reports: newReports }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
        <p className="text-slate-600 dark:text-slate-300 font-medium animate-pulse">{loadingMessage}</p>
      </div>
    );
  }

  return (
    <>
      {view === AppView.ONBOARDING && (
        <GoalInput 
          onGenerate={handleGeneratePlan} 
          isLoading={isLoading} 
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}

      {view === AppView.CALENDAR && (
        <CalendarGrid 
          goal={state.goal}
          plan={state.plan}
          reports={state.reports}
          onSelectDay={setSelectedDay}
          onFinish={handleGenerateFinalReport}
          canFinish={Object.keys(state.reports).length > 0}
          onDemoFill={handleDemoFill}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}

      {view === AppView.REPORT && state.finalAnalysis && (
        <FinalReport 
          analysis={state.finalAnalysis}
          reports={state.reports}
          plan={state.plan}
          onRestart={handleRestart}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}

      {selectedDay && (
        <DayDetail 
          dayPlan={selectedDay}
          existingReport={state.reports[selectedDay.day]}
          onClose={() => setSelectedDay(null)}
          onSaveReport={handleSaveReport}
        />
      )}
    </>
  );
};

export default App;