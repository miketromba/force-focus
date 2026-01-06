import React, { useState, useMemo } from 'react';

// Icon components
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

interface BlockingOverlayProps {
  blockedUrl: string;
  goal?: string;
  isLocked?: boolean;
  onGoBack: () => void;
  onAddToWhitelist: (option: 'exact' | 'domain' | 'domain-wildcard' | 'custom', customPattern?: string) => Promise<void>;
  onCompleteGoal: () => Promise<void>;
  onSetGoal?: (goal: string) => Promise<void>;
}

interface WhitelistOption {
  id: 'exact' | 'domain' | 'domain-wildcard' | 'path';
  label: string;
  description: string;
  pattern: string;
}

const BlockingOverlay: React.FC<BlockingOverlayProps> = ({
  blockedUrl,
  goal,
  isLocked = false,
  onGoBack,
  onAddToWhitelist,
  onCompleteGoal,
  onSetGoal,
}) => {
  const [showWhitelistOptions, setShowWhitelistOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [goalError, setGoalError] = useState('');
  const [expandedGoal, setExpandedGoal] = useState(false);
  const [expandedUrl, setExpandedUrl] = useState(false);

  const urlParts = useMemo(() => {
    try {
      const urlObj = new URL(blockedUrl);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      const basePath = pathParts.length > 0 ? `/${pathParts[0]}` : '';
      return {
        hostname: urlObj.hostname,
        pathname: urlObj.pathname,
        basePath,
        fullPath: `${urlObj.hostname}${urlObj.pathname}`,
      };
    } catch {
      return {
        hostname: blockedUrl,
        pathname: '/',
        basePath: '',
        fullPath: blockedUrl,
      };
    }
  }, [blockedUrl]);

  const whitelistOptions = useMemo((): WhitelistOption[] => {
    const options: WhitelistOption[] = [
      {
        id: 'domain',
        label: `All of ${urlParts.hostname}`,
        description: '',
        pattern: `${urlParts.hostname}/*`,
      },
      {
        id: 'exact',
        label: 'Only this exact page',
        description: '',
        pattern: urlParts.fullPath,
      },
      {
        id: 'domain-wildcard',
        label: `Subdomains of ${urlParts.hostname}`,
        description: '',
        pattern: `*.${urlParts.hostname}/*`,
      },
    ];

    // Add path option if there's a meaningful path
    if (urlParts.basePath && urlParts.basePath !== '/') {
      options.splice(1, 0, {
        id: 'path',
        label: `Only pages under ${urlParts.basePath}`,
        description: '',
        pattern: `${urlParts.hostname}${urlParts.basePath}/*`,
      });
    }

    return options;
  }, [urlParts]);

  const handleWhitelistOption = async (option: WhitelistOption) => {
    setIsLoading(true);
    // Use 'custom' type and pass the pre-computed pattern
    await onAddToWhitelist('custom', option.pattern);
    setIsLoading(false);
  };

  const handleCompleteGoal = async () => {
    setIsLoading(true);
    await onCompleteGoal();
    setIsLoading(false);
  };

  const handleSetGoal = async () => {
    if (!newGoal.trim()) {
      setGoalError('Please enter a focus goal');
      return;
    }
    if (newGoal.length < 10) {
      setGoalError('Goal should be more specific (at least 10 characters)');
      return;
    }

    setIsLoading(true);
    setGoalError('');
    try {
      if (onSetGoal) {
        await onSetGoal(newGoal);
      }
    } catch (error) {
      setGoalError('Failed to set goal. Please try again.');
      setIsLoading(false);
    }
  };

  // If no goal is set, show goal-setting interface
  if (isLocked && !goal) {
    return (
      <div className="overlay-container">
        <div className="overlay-backdrop" />
        <div className="overlay-content">
          <div className="overlay-card">
            <div className="overlay-header">
              <div className="overlay-icon overlay-icon-warning">
                <TargetIcon />
              </div>
              <h1 className="overlay-title">Set your focus goal for today</h1>
              <p className="overlay-subtitle">Your browser is locked until you set a daily focus goal</p>
            </div>

            <div className="blocked-url-container">
              <p className="blocked-url-label">Trying to access:</p>
              <p
                className={`blocked-url ${expandedUrl ? 'expanded' : ''}`}
                onClick={() => setExpandedUrl(!expandedUrl)}
                title={expandedUrl ? 'Click to collapse' : 'Click to expand'}
              >{blockedUrl}</p>
            </div>

            <div className="goal-input-container">
              <label className="goal-input-label">What's your main focus for today?</label>
              <textarea
                className="goal-input"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Be specific about what you want to accomplish..."
                rows={3}
                disabled={isLoading}
              />
              {goalError && (
                <p className="goal-error">{goalError}</p>
              )}
            </div>

            <div className="overlay-actions">
              <button
                onClick={handleSetGoal}
                className="btn btn-primary"
                disabled={isLoading || !newGoal.trim()}
              >
                Set Focus Goal & Unlock
              </button>
              <button
                onClick={onGoBack}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                Go back
              </button>
            </div>

            {isLoading && (
              <div className="loading-indicator">Setting goal...</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Whitelist selection view
  if (showWhitelistOptions) {
    return (
      <div className="overlay-container">
        <div className="overlay-backdrop" />
        <div className="overlay-content">
          <div className="overlay-card overlay-card-scrollable">
            <div className="header-with-back">
              <button
                onClick={() => setShowWhitelistOptions(false)}
                className="back-button"
                disabled={isLoading}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h1 className="header-title">Allow in focus mode</h1>
            </div>

            <div className="whitelist-options-list">
              {whitelistOptions.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleWhitelistOption(option)}
                  className={`whitelist-option ${index === 0 ? 'whitelist-option-primary' : ''}`}
                  disabled={isLoading}
                >
                  <span className="whitelist-option-label">{option.label}</span>
                  <span className="whitelist-option-pattern">{option.pattern}</span>
                </button>
              ))}
            </div>

            {isLoading && (
              <div className="loading-indicator">Adding to whitelist...</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Normal blocking interface when goal exists
  return (
    <div className="overlay-container">
      <div className="overlay-backdrop" />
      <div className="overlay-content">
        <div className="overlay-card">
          <div className="overlay-header">
            <div className="overlay-icon">
              <ShieldIcon />
            </div>
            <h1 className="overlay-title">This site is blocked during focus time</h1>
            {goal && (
              <div className="goal-container">
                <p className="goal-label">Your focus goal:</p>
                <p
                  className={`goal-text ${expandedGoal ? 'expanded' : ''}`}
                  onClick={() => setExpandedGoal(!expandedGoal)}
                  title={expandedGoal ? 'Click to collapse' : 'Click to expand'}
                >{goal}</p>
              </div>
            )}
          </div>

          <div className="blocked-url-container">
            <p className="blocked-url-label">Blocked URL:</p>
            <p
              className={`blocked-url ${expandedUrl ? 'expanded' : ''}`}
              onClick={() => setExpandedUrl(!expandedUrl)}
              title={expandedUrl ? 'Click to collapse' : 'Click to expand'}
            >{blockedUrl}</p>
          </div>

          <div className="overlay-actions">
            <button
              onClick={onGoBack}
              className="btn btn-primary"
              disabled={isLoading}
            >
              Back to work
            </button>

            <div className="secondary-actions">
              <button
                onClick={() => setShowWhitelistOptions(true)}
                className="btn btn-ghost"
                disabled={isLoading}
              >
                Allow in focus mode
              </button>
              <button
                onClick={handleCompleteGoal}
                className="btn btn-ghost"
                disabled={isLoading}
              >
                End focus session
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="loading-indicator">Processing...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockingOverlay;