import React, { useState } from 'react';
import { sendMessage } from '@/shared/messages';

interface GoalSetterProps {
  currentGoal?: string;
  isLocked: boolean;
  goalCompleted: boolean;
  isFocusActive: boolean;
  onGoalSet: () => void;
  onGoalComplete: () => void;
}

const GoalSetter: React.FC<GoalSetterProps> = ({
  currentGoal,
  isLocked,
  goalCompleted,
  isFocusActive,
  onGoalSet,
  onGoalComplete,
}) => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSetGoal = async () => {
    if (!goal.trim()) {
      setError('Please enter a focus goal');
      return;
    }

    if (goal.length < 10) {
      setError('Goal should be more specific (at least 10 characters)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendMessage('SET_GOAL', goal);
      onGoalSet();
      setGoal('');
    } catch (err) {
      setError('Failed to set goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Focus mode active - show current goal
  if (isFocusActive && currentGoal) {
    return (
      <div className="p-5 pb-6 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Current Goal
          </div>
          <p className="text-base font-medium text-white leading-relaxed">
            {currentGoal}
          </p>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4 flex-shrink-0">
          Use the toggle above to end your session
        </p>
      </div>
    );
  }

  // No goal set - show goal input
  return (
    <div className="p-5 pb-6 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto -mx-1 px-1">
        <div className="mb-4">
          <h2 className={`text-xl font-bold mb-1 ${isFocusActive ? 'text-white' : 'text-gray-900'}`}>
            What will you focus on?
          </h2>
          {isLocked && (
            <p className={`text-sm ${isFocusActive ? 'text-gray-400' : 'text-gray-600'}`}>
              Set a goal to unlock your browser.
            </p>
          )}
        </div>

        <textarea
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Be specific about what you want to accomplish..."
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent resize-none placeholder-gray-400 ${
            isFocusActive
              ? 'bg-gray-800 border-gray-600 text-white focus:ring-green-500'
              : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
          }`}
          rows={5}
          disabled={loading}
        />
        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}
      </div>

      <div className="mt-4 flex-shrink-0">
        <button
          onClick={handleSetGoal}
          disabled={loading || !goal.trim()}
          className={`w-full py-3 px-6 rounded-xl font-semibold text-base text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
            isFocusActive
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/25 hover:shadow-green-500/30'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/25 hover:shadow-blue-500/30'
          }`}
        >
          {loading ? 'Starting...' : 'Start Focus'}
        </button>
      </div>
    </div>
  );
};

export default GoalSetter;
