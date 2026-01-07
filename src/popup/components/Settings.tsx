import React, { useState, useEffect } from 'react';
import { getSyncStorage, setSyncStorage, getLocalStorage, setLocalStorage, initializeStorage } from '@/shared/storage';
import { sendMessage } from '@/shared/messages';
import type { Settings as SettingsType, Pattern } from '@/shared/types';

// Format hour to 12-hour time with AM/PM
const formatHour = (hour: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
};

interface SettingsProps {
  isFocusActive: boolean;
}

const Settings: React.FC<SettingsProps> = ({ isFocusActive }) => {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [transferMode, setTransferMode] = useState<'idle' | 'export' | 'import'>('idle');
  const [exportData, setExportData] = useState('');
  const [importData, setImportData] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { settings } = await getSyncStorage();
      setSettings(settings);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetHourChange = async (newHour: number) => {
    if (!settings) return;

    const newSettings = { ...settings, resetHour: newHour };
    setSettings(newSettings);

    // Auto-save
    try {
      await setSyncStorage({ settings: newSettings });
      await sendMessage('UPDATE_SETTINGS', newSettings);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  const handleExport = async () => {
    try {
      const { patterns = [] } = await getLocalStorage(['patterns']);
      const { settings } = await getSyncStorage();

      const exportObj = {
        version: '1.0.0',
        settings,
        patterns,
        exportedAt: new Date().toISOString(),
      };

      setExportData(JSON.stringify(exportObj, null, 2));
      setTransferMode('export');
    } catch (err) {
      console.error('Failed to export data:', err);
    }
  };

  const handleImport = async () => {
    try {
      const importObj = JSON.parse(importData);

      if (importObj.settings) {
        await setSyncStorage({ settings: importObj.settings });
        await sendMessage('UPDATE_SETTINGS', importObj.settings);
      }

      if (importObj.patterns) {
        await setLocalStorage({ patterns: importObj.patterns });
      }

      setImportData('');
      setTransferMode('idle');
      await loadSettings();
      alert('Configuration imported successfully!');
    } catch (err) {
      alert('Failed to import configuration. Please check the format.');
    }
  };

  const handleCopyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback: select the text
      const textarea = document.querySelector('textarea[readonly]') as HTMLTextAreaElement;
      if (textarea) {
        textarea.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const closeTransferMode = () => {
    setTransferMode('idle');
    setExportData('');
    setImportData('');
    setCopied(false);
  };

  const handleClearAllData = async () => {
    if (confirm('Reset extension completely? This will remove all your patterns, settings, and goals. This cannot be undone.')) {
      await chrome.storage.local.clear();
      await chrome.storage.sync.clear();

      // Reinitialize with defaults (focus mode enabled)
      await initializeStorage();

      // Reload all tabs
      const tabs = await chrome.tabs.query({});
      tabs.forEach(tab => {
        if (tab.id && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
          chrome.tabs.reload(tab.id).catch(() => {});
        }
      });

      window.close();
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center p-5">
        <div className={isFocusActive ? 'text-gray-400' : 'text-gray-600'}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-5 pb-6 space-y-5">
      {/* General Settings */}
      <div>
        <h2 className={`text-base font-semibold mb-2 ${isFocusActive ? 'text-white' : 'text-gray-900'}`}>
          General
        </h2>
        <div>
          <label className={`block text-sm font-medium mb-1 ${isFocusActive ? 'text-gray-300' : 'text-gray-700'}`}>
            Daily Reset Time
          </label>
          <select
            value={settings.resetHour}
            onChange={(e) => handleResetHourChange(parseInt(e.target.value))}
            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isFocusActive
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border border-gray-300 text-gray-900'
            }`}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {formatHour(i)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Import/Export */}
      <div>
        <h2 className={`text-base font-semibold mb-2 ${isFocusActive ? 'text-white' : 'text-gray-900'}`}>
          Data
        </h2>
        <div className="space-y-2">
          {transferMode === 'idle' && (
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  isFocusActive
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                Export
              </button>
              <button
                onClick={() => setTransferMode('import')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  isFocusActive
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                Import
              </button>
            </div>
          )}

          {transferMode === 'export' && (
            <div className="space-y-2">
              <textarea
                value={exportData}
                readOnly
                className={`w-full h-24 px-3 py-2 rounded-lg font-mono text-xs focus:outline-none ${
                  isFocusActive ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 border border-gray-300'
                }`}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCopyExport}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    copied ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={closeTransferMode}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    isFocusActive
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {transferMode === 'import' && (
            <div className="space-y-2">
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                className={`w-full h-24 px-3 py-2 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isFocusActive
                    ? 'bg-gray-700 text-gray-200 placeholder-gray-500'
                    : 'bg-white border border-gray-300 placeholder-gray-400'
                }`}
                placeholder="Paste configuration JSON..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleImport}
                  disabled={!importData.trim()}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import
                </button>
                <button
                  onClick={closeTransferMode}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    isFocusActive
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleClearAllData}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              isFocusActive
                ? 'bg-red-900/50 text-red-400 hover:bg-red-900/70'
                : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
            }`}
          >
            Reset Extension
          </button>
        </div>
      </div>

      {/* About */}
      <div className={`pt-4 border-t ${isFocusActive ? 'border-gray-700' : 'border-gray-200'}`}>
        <p className={`text-center text-xs ${isFocusActive ? 'text-gray-500' : 'text-gray-400'}`}>
          Force Focus v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Settings;