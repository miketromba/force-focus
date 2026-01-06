import React, { useState, useEffect } from 'react';
import GoalSetter from './components/GoalSetter';
import PatternManager from './components/PatternManager';
import Settings from './components/Settings';
import { sendMessage } from '@/shared/messages';
import type { StatusResponse } from '@/shared/types';

type Tab = 'goal' | 'patterns' | 'settings';

// Get initial theme from DOM (set by inline script before React loads)
// Default to dark since body background defaults to dark - prevents flash
const getInitialTheme = (): boolean => {
  const theme = document.documentElement.dataset.theme;
  // If theme not yet set by async storage call, default to dark (matching body bg)
  return theme !== 'light';
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('goal');
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  // Use initial theme from DOM to prevent flash
  const [initialTheme] = useState(getInitialTheme);

  // Once status loads, use that; otherwise use the initial theme from DOM
  const isFocusActive = status ? status.focusEnabled : initialTheme;

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const response = await sendMessage<void, StatusResponse>('GET_STATUS');
      setStatus(response);

      // If no goal is set, force goal tab
      if (!response.hasGoal) {
        setActiveTab('goal');
      }
    } catch (error) {
      console.error('Failed to load status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalSet = async () => {
    await loadStatus();
    // Stay on the Focus tab to show the active goal
  };

  const handleGoalComplete = async () => {
    await sendMessage('COMPLETE_GOAL');
    await loadStatus();
  };

  const handleToggleFocus = async () => {
    try {
      await sendMessage('TOGGLE_FOCUS');
      await loadStatus();
    } catch (error) {
      console.error('Failed to toggle focus:', error);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full ${
        isFocusActive ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={isFocusActive ? 'text-gray-400' : 'text-gray-600'}>Loading...</div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'goal', label: 'Focus' },
    { key: 'patterns', label: 'Sites' },
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <div className={`h-full flex flex-col ${
      isFocusActive ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header with Toggle */}
      <div className={`border-b ${
        isFocusActive
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className={`text-lg font-bold ${
            isFocusActive ? 'text-white' : 'text-gray-900'
          }`}>Force Focus</h1>

          {/* Toggle Switch */}
          <button
            onClick={handleToggleFocus}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 cursor-pointer ${
              isFocusActive
                ? 'bg-green-500'
                : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                isFocusActive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className={`border-b ${
        isFocusActive
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              disabled={status?.isLocked && tab.key !== 'goal'}
              className={`
                flex-1 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.key
                  ? isFocusActive
                    ? 'border-green-400 text-green-400'
                    : 'border-blue-500 text-blue-600'
                  : isFocusActive
                    ? 'border-transparent text-gray-400 hover:text-gray-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }
                ${status?.isLocked && tab.key !== 'goal'
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'goal' && (
          <GoalSetter
            currentGoal={status?.goal}
            isLocked={status?.isLocked || false}
            goalCompleted={status?.goalCompleted || false}
            isFocusActive={isFocusActive || false}
            onGoalSet={handleGoalSet}
            onGoalComplete={handleGoalComplete}
          />
        )}
        {activeTab === 'patterns' && <PatternManager isFocusActive={isFocusActive || false} />}
        {activeTab === 'settings' && <Settings isFocusActive={isFocusActive || false} />}
      </div>
    </div>
  );
};

export default App;