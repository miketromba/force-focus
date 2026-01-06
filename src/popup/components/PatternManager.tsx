import React, { useState, useEffect } from 'react';
import { sendMessage } from '@/shared/messages';
import { isValidPattern, matchPattern } from '@/shared/patterns';
import type { Pattern } from '@/shared/types';

interface PatternManagerProps {
  isFocusActive: boolean;
}

const PatternManager: React.FC<PatternManagerProps> = ({ isFocusActive }) => {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [newPattern, setNewPattern] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [testUrl, setTestUrl] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    loadPatterns();
  }, []);

  const loadPatterns = async () => {
    try {
      const response = await sendMessage<void, Pattern[]>('GET_PATTERNS');
      setPatterns(response);
    } catch (err) {
      console.error('Failed to load patterns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPattern = async () => {
    if (!newPattern.trim()) {
      setError('Please enter a pattern');
      return;
    }

    if (!isValidPattern(newPattern)) {
      setError('Invalid pattern format');
      return;
    }

    setError('');
    try {
      await sendMessage('ADD_PATTERN', { pattern: newPattern, temporary: false });
      await loadPatterns();
      setNewPattern('');
    } catch (err) {
      setError('Failed to add pattern');
    }
  };

  const handleRemovePattern = async (patternId: string) => {
    try {
      await sendMessage('REMOVE_PATTERN', patternId);
      await loadPatterns();
    } catch (err) {
      console.error('Failed to remove pattern:', err);
    }
  };

  const handleTogglePattern = async (pattern: Pattern) => {
    // Update local state immediately for better UX
    setPatterns(prev =>
      prev.map(p =>
        p.id === pattern.id ? { ...p, enabled: !p.enabled } : p
      )
    );

    // Then update in background
    const updatedPatterns = patterns.map(p =>
      p.id === pattern.id ? { ...p, enabled: !p.enabled } : p
    );

    // For now, we'll need to implement a UPDATE_PATTERNS message type
    // or remove and re-add the pattern with the new state
  };

  const testUrlAgainstPatterns = () => {
    if (!testUrl) return null;

    const enabledPatterns = patterns.filter(p => p.enabled);
    return enabledPatterns.some(p => matchPattern(testUrl, p.pattern));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-5">
        <div className={isFocusActive ? 'text-gray-400' : 'text-gray-600'}>Loading...</div>
      </div>
    );
  }

  const testResult = testUrlAgainstPatterns();

  return (
    <div className="p-5 pb-6">
      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className={`w-full max-w-sm rounded-xl shadow-xl max-h-[90%] overflow-y-auto ${
            isFocusActive ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`sticky top-0 flex items-center justify-between p-4 border-b ${
              isFocusActive ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold ${isFocusActive ? 'text-white' : 'text-gray-900'}`}>
                Pattern Guide
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className={`p-1 rounded-lg transition-colors ${
                  isFocusActive ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className={`text-sm ${isFocusActive ? 'text-gray-300' : 'text-gray-600'}`}>
                Patterns determine which sites are allowed during focus mode. Use wildcards to match multiple URLs.
              </p>

              <div>
                <h4 className={`text-sm font-semibold mb-2 ${isFocusActive ? 'text-white' : 'text-gray-900'}`}>
                  Wildcards
                </h4>
                <ul className={`text-sm space-y-1.5 ${isFocusActive ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li><code className={`px-1 rounded ${isFocusActive ? 'bg-gray-700' : 'bg-gray-100'}`}>*</code> — matches any characters within a segment</li>
                  <li><code className={`px-1 rounded ${isFocusActive ? 'bg-gray-700' : 'bg-gray-100'}`}>**</code> — matches any characters across segments</li>
                </ul>
              </div>

              <div>
                <h4 className={`text-sm font-semibold mb-2 ${isFocusActive ? 'text-white' : 'text-gray-900'}`}>
                  Examples
                </h4>
                <ul className={`text-sm space-y-2 ${isFocusActive ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>
                    <code className={`px-1 rounded ${isFocusActive ? 'bg-gray-700' : 'bg-gray-100'}`}>github.com/*</code>
                    <br />
                    <span className={isFocusActive ? 'text-gray-400' : 'text-gray-500'}>All pages on github.com</span>
                  </li>
                  <li>
                    <code className={`px-1 rounded ${isFocusActive ? 'bg-gray-700' : 'bg-gray-100'}`}>*.google.com/*</code>
                    <br />
                    <span className={isFocusActive ? 'text-gray-400' : 'text-gray-500'}>All Google subdomains (docs, drive, etc.)</span>
                  </li>
                  <li>
                    <code className={`px-1 rounded ${isFocusActive ? 'bg-gray-700' : 'bg-gray-100'}`}>notion.so/workspace/*</code>
                    <br />
                    <span className={isFocusActive ? 'text-gray-400' : 'text-gray-500'}>Specific workspace and its subpages</span>
                  </li>
                  <li>
                    <code className={`px-1 rounded ${isFocusActive ? 'bg-gray-700' : 'bg-gray-100'}`}>example.com</code>
                    <br />
                    <span className={isFocusActive ? 'text-gray-400' : 'text-gray-500'}>Exact domain only (no subpages)</span>
                  </li>
                </ul>
              </div>

              <div className={`pt-3 border-t ${isFocusActive ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-xs ${isFocusActive ? 'text-gray-500' : 'text-gray-400'}`}>
                  Tip: Start broad (e.g., <code className={`px-1 rounded ${isFocusActive ? 'bg-gray-700' : 'bg-gray-100'}`}>site.com/*</code>) and narrow down if needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Pattern */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <h2 className={`text-base font-semibold ${isFocusActive ? 'text-white' : 'text-gray-900'}`}>
            Allowed Sites
          </h2>
          <button
            onClick={() => setShowHelp(true)}
            className={`p-1 rounded-lg transition-colors ${
              isFocusActive
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            title="Pattern help"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPattern}
            onChange={(e) => setNewPattern(e.target.value)}
            placeholder="e.g., github.com/*"
            className={`flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              isFocusActive
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
            onKeyPress={(e) => e.key === 'Enter' && handleAddPattern()}
          />
          <button
            onClick={handleAddPattern}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isFocusActive
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Add
          </button>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>

      {/* Pattern List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {patterns.length === 0 ? (
          <p className={`text-sm ${isFocusActive ? 'text-gray-500' : 'text-gray-500'}`}>
            No patterns configured
          </p>
        ) : (
          patterns.map((pattern) => (
            <div
              key={pattern.id}
              className={`flex items-center justify-between p-2.5 rounded-lg transition-colors ${
                isFocusActive
                  ? pattern.enabled ? 'bg-gray-700' : 'bg-gray-800'
                  : pattern.enabled ? 'bg-white border border-gray-200' : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <span
                className={`font-mono text-sm truncate flex-1 ${
                  isFocusActive
                    ? pattern.enabled ? 'text-gray-200' : 'text-gray-500'
                    : pattern.enabled ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {pattern.pattern}
              </span>
              <button
                onClick={() => handleRemovePattern(pattern.id)}
                className={`ml-2 text-sm font-medium ${
                  isFocusActive
                    ? 'text-red-400 hover:text-red-300'
                    : 'text-red-600 hover:text-red-700'
                }`}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatternManager;