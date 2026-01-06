// Inline styles for the shadow DOM overlay
export const overlayStyles = `
  /* Reset and container styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .overlay-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    pointer-events: all !important;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .overlay-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    pointer-events: all !important;
    cursor: default;
  }

  .overlay-content {
    position: relative;
    z-index: 1;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .overlay-card {
    position: relative;
    background: linear-gradient(180deg, #1a2332 0%, #111827 100%);
    border-radius: 16px;
    padding: 32px;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.06),
      0 32px 64px -16px rgba(0, 0, 0, 0.5),
      0 16px 32px -8px rgba(0, 0, 0, 0.4);
    max-height: 90vh;
    overflow-y: auto;
    border: 1px solid rgba(55, 65, 81, 0.8);
  }

  .overlay-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.1) 80%, transparent);
    border-radius: 16px 16px 0 0;
  }

  .overlay-card-scrollable {
    padding: 24px;
  }

  .overlay-header {
    margin-bottom: 24px;
    text-align: center;
  }

  .overlay-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    margin: 0 auto 20px;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.05) 100%);
    border-radius: 16px;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }

  .overlay-icon svg {
    width: 28px;
    height: 28px;
    color: #4ade80;
  }

  .overlay-icon-warning {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.05) 100%);
    border: 1px solid rgba(251, 191, 36, 0.3);
  }

  .overlay-icon-warning svg {
    color: #fbbf24;
  }

  .overlay-title {
    font-size: 22px;
    font-weight: 700;
    color: white;
    margin: 0 0 8px 0;
    text-align: center;
    line-height: 1.3;
    letter-spacing: -0.02em;
  }

  .overlay-subtitle {
    font-size: 15px;
    color: #9ca3af;
    margin: 0;
    text-align: center;
    line-height: 1.5;
  }

  .goal-container {
    margin-top: 36px;
    margin-bottom: 28px;
    text-align: left;
  }

  .goal-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    color: #4ade80;
    margin: 0 0 8px 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .goal-label::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #4ade80;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .goal-text {
    font-size: 15px;
    color: #e5e7eb;
    margin: 0;
    font-weight: 400;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: calc(1.5em * 3);
    cursor: pointer;
    transition: max-height 0.2s ease;
  }

  .goal-text:hover {
    opacity: 0.8;
  }

  .goal-text.expanded {
    display: block;
    -webkit-line-clamp: unset;
    max-height: none;
    overflow: visible;
  }

  .blocked-url-container {
    margin-top: 24px;
    margin-bottom: 36px;
    text-align: left;
  }

  .blocked-url-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    color: #f87171;
    margin: 0 0 8px 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .blocked-url-label::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #f87171;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .blocked-url {
    font-size: 14px;
    color: #e5e7eb;
    margin: 0;
    word-break: break-all;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: calc(1.5em * 2);
    line-height: 1.5;
    cursor: pointer;
    transition: max-height 0.2s ease;
  }

  .blocked-url:hover {
    opacity: 0.9;
  }

  .blocked-url.expanded {
    display: block;
    -webkit-line-clamp: unset;
    max-height: none;
    overflow: visible;
  }

  .overlay-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .btn {
    padding: 14px 20px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    width: 100%;
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.2;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%);
    color: white;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset,
      0 -1px 0 rgba(0, 0, 0, 0.15) inset;
  }

  .btn-primary:hover:not(:disabled) {
    background: linear-gradient(180deg, #2dd467 0%, #1cb854 100%);
    transform: translateY(-1px);
    box-shadow:
      0 4px 8px -2px rgba(0, 0, 0, 0.3),
      0 1px 2px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.15) inset;
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
    background: linear-gradient(180deg, #16a34a 0%, #15803d 100%);
  }

  .btn-secondary {
    background: linear-gradient(180deg, #4b5563 0%, #374151 100%);
    color: #e5e7eb;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  }

  .btn-secondary:hover:not(:disabled) {
    background: linear-gradient(180deg, #6b7280 0%, #4b5563 100%);
    transform: translateY(-1px);
  }

  .btn-secondary:active:not(:disabled) {
    transform: translateY(0);
    background: linear-gradient(180deg, #374151 0%, #1f2937 100%);
  }

  .btn-tertiary {
    background: rgba(34, 197, 94, 0.15);
    color: #4ade80;
    border: 1px solid #22c55e;
  }

  .btn-tertiary:hover:not(:disabled) {
    background: rgba(34, 197, 94, 0.25);
    transform: translateY(-1px);
  }

  .secondary-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 4px;
  }

  .action-divider {
    color: #6b7280;
    font-size: 14px;
    user-select: none;
  }

  .btn-ghost {
    background: transparent;
    color: #9ca3af;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 500;
    width: auto;
  }

  .btn-ghost:hover:not(:disabled) {
    color: #d1d5db;
    background: rgba(255, 255, 255, 0.1);
  }

  .whitelist-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .whitelist-title {
    font-size: 14px;
    font-weight: 600;
    color: #d1d5db;
    margin: 0 0 8px 0;
  }

  .btn-option {
    background: #374151;
    color: #d1d5db;
    border: 1px solid #4b5563;
    padding: 10px 16px;
    font-size: 14px;
    text-align: left;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 6px;
  }

  .btn-option:hover:not(:disabled) {
    background: #4b5563;
    border-color: #6b7280;
  }

  .btn-option:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .custom-pattern-container {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  .custom-pattern-input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid #4b5563;
    border-radius: 6px;
    font-size: 14px;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
    background: #374151;
    color: white;
  }

  .custom-pattern-input:focus {
    outline: none;
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
  }

  .custom-pattern-input:disabled {
    background: #1f2937;
    color: #6b7280;
    cursor: not-allowed;
  }

  .btn-cancel {
    background: transparent;
    color: #9ca3af;
    border: none;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-cancel:hover:not(:disabled) {
    color: #d1d5db;
  }

  .loading-indicator {
    text-align: center;
    color: #9ca3af;
    font-size: 14px;
    margin-top: 16px;
    animation: pulse 1.5s infinite;
  }

  .goal-input-container {
    margin-bottom: 24px;
  }

  .goal-input-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #d1d5db;
    margin-bottom: 8px;
  }

  .goal-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #4b5563;
    border-radius: 8px;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    resize: vertical;
    min-height: 80px;
    background: #374151;
    color: white;
    transition: all 0.2s;
  }

  .goal-input:focus {
    outline: none;
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
  }

  .goal-input:disabled {
    background: #1f2937;
    color: #6b7280;
    cursor: not-allowed;
  }

  .goal-input::placeholder {
    color: #6b7280;
  }

  .goal-error {
    color: #f87171;
    font-size: 13px;
    margin-top: 6px;
    margin-bottom: 0;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Header with back button */
  .header-with-back {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .header-title {
    font-size: 18px;
    font-weight: 600;
    color: white;
    margin: 0;
    line-height: 1.3;
  }

  .back-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: #9ca3af;
    padding: 4px;
    margin: -4px;
    cursor: pointer;
    transition: color 0.2s;
    border-radius: 4px;
  }

  .back-button:hover:not(:disabled) {
    color: #d1d5db;
    background: rgba(255, 255, 255, 0.1);
  }

  .back-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .back-button svg {
    flex-shrink: 0;
  }

  /* Whitelist options list */
  .whitelist-options-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .whitelist-option {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    width: 100%;
    padding: 12px 14px;
    background: transparent;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;
    text-align: left;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .whitelist-option:hover:not(:disabled) {
    background: #374151;
  }

  .whitelist-option:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .whitelist-option-primary {
    background: rgba(34, 197, 94, 0.15);
  }

  .whitelist-option-primary:hover:not(:disabled) {
    background: rgba(34, 197, 94, 0.25);
  }

  .whitelist-option-primary .whitelist-option-label {
    color: #4ade80;
  }

  .whitelist-option-label {
    font-size: 14px;
    font-weight: 500;
    color: #d1d5db;
    line-height: 1.3;
  }

  .whitelist-option-pattern {
    font-size: 12px;
    color: #9ca3af;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
    line-height: 1.3;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;