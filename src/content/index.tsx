import React from 'react';
import ReactDOM from 'react-dom/client';
import { sendMessage, onMessage } from '@/shared/messages';
import type { CheckUrlResponse } from '@/shared/types';
import BlockingOverlay from './BlockingOverlay';
import { overlayStyles } from './overlayStyles';

// Check if current URL is allowed
async function checkCurrentUrl(): Promise<CheckUrlResponse> {
  const response = await sendMessage<{ url: string }, CheckUrlResponse>(
    'CHECK_URL',
    { url: window.location.href }
  );
  return response;
}

// Create or get the overlay container
function getOrCreateOverlayContainer(): HTMLElement {
  const existingContainer = document.getElementById('force-focus-overlay-root');
  if (existingContainer) {
    // Clear existing shadow root content
    if (existingContainer.shadowRoot) {
      existingContainer.shadowRoot.innerHTML = '';
    }
    return existingContainer;
  }

  const container = document.createElement('div');
  container.id = 'force-focus-overlay-root';
  // Apply inline styles to ensure the container is properly positioned
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.zIndex = '2147483647';
  container.style.pointerEvents = 'all';
  document.documentElement.appendChild(container);
  return container;
}

// Show blocking overlay
function showOverlay(goal?: string, isLocked: boolean = false): void {
  const container = getOrCreateOverlayContainer();
  const shadowRoot = container.shadowRoot || container.attachShadow({ mode: 'open' });

  // Clear any existing content
  shadowRoot.innerHTML = '';

  // Block keyboard events at the document level to prevent page shortcuts
  // (like GitHub's 's' for search) from firing while our overlay is open
  const blockKeyboardEvent = (e: KeyboardEvent) => {
    // Check if our overlay is still in the DOM
    if (!document.contains(container)) return;

    // Allow the event if the target is within our shadow DOM
    const path = e.composedPath();
    const isWithinOverlay = path.some(el => el === container);

    if (isWithinOverlay) {
      // Event originated from our overlay - just stop it from reaching the page
      e.stopPropagation();
    } else {
      // Event is from outside our overlay (the page) - block it completely
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  };

  // Add keyboard blocking at document level with capture to intercept before page handlers
  document.addEventListener('keydown', blockKeyboardEvent, { capture: true });
  document.addEventListener('keyup', blockKeyboardEvent, { capture: true });
  document.addEventListener('keypress', blockKeyboardEvent, { capture: true });

  // Store references for cleanup
  (container as any)._keyboardHandlers = {
    keydown: blockKeyboardEvent,
    keyup: blockKeyboardEvent,
    keypress: blockKeyboardEvent,
  };

  // Block scroll events on the backdrop
  const scrollEvents = ['wheel', 'scroll'];
  scrollEvents.forEach(eventName => {
    container.addEventListener(eventName, (e) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      if (target?.classList?.contains('overlay-backdrop')) {
        e.preventDefault();
      }
    }, { capture: true, passive: false });
  });

  // Stop propagation for mouse/touch events to prevent page interactions
  const otherEvents = [
    'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout',
    'touchstart', 'touchend', 'touchcancel',
    'pointerdown', 'pointerup', 'pointermove', 'pointerenter', 'pointerleave', 'pointerover', 'pointerout',
    'drag', 'dragstart', 'dragend', 'dragenter', 'dragleave', 'dragover', 'drop'
  ];

  otherEvents.forEach(eventName => {
    container.addEventListener(eventName, (e) => e.stopPropagation(), { capture: false });
  });

  // Also block events on the document body to prevent any interaction
  const blockBodyScroll = (e: Event) => {
    if (container && document.contains(container)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Block scroll on body when overlay is shown
  document.body.addEventListener('scroll', blockBodyScroll, { capture: true, passive: false });
  document.body.addEventListener('wheel', blockBodyScroll, { capture: true, passive: false });
  document.body.addEventListener('touchmove', blockBodyScroll, { capture: true, passive: false });

  // Store the event handlers so we can remove them later
  (container as any)._blockBodyScroll = blockBodyScroll;

  // Prevent body from scrolling
  const originalOverflow = document.body.style.overflow;
  const originalPosition = document.body.style.position;
  const originalTop = document.body.style.top;
  const scrollY = window.scrollY;

  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';

  // Store original values for restoration
  (container as any)._originalStyles = { originalOverflow, originalPosition, originalTop, scrollY };

  // Import styles into shadow DOM
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    :host {
      all: initial;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 2147483647 !important;
      pointer-events: all !important;
      display: block !important;
    }
    ${overlayStyles}
  `;
  shadowRoot.appendChild(styleSheet);

  // Create a div for React to render into
  const reactRoot = document.createElement('div');
  reactRoot.id = 'force-focus-react-root';
  shadowRoot.appendChild(reactRoot);

  // Render React component
  const root = ReactDOM.createRoot(reactRoot);
  root.render(
    <BlockingOverlay
      blockedUrl={window.location.href}
      goal={goal}
      isLocked={isLocked}
      onGoBack={() => {
        hideOverlay();
        window.history.back();
      }}
      onAddToWhitelist={async (option, customPattern) => {
        await sendMessage('ADD_TO_WHITELIST', {
          url: window.location.href,
          option,
          customPattern,
        });
        hideOverlay();
        window.location.reload();
      }}
      onSetGoal={async (newGoal) => {
        await sendMessage('SET_GOAL', newGoal);
        hideOverlay();
        window.location.reload();
      }}
    />
  );
}

// Hide blocking overlay
function hideOverlay(): void {
  const container = document.getElementById('force-focus-overlay-root');
  if (container) {
    // Remove keyboard event listeners from document
    const keyboardHandlers = (container as any)._keyboardHandlers;
    if (keyboardHandlers) {
      document.removeEventListener('keydown', keyboardHandlers.keydown, { capture: true } as any);
      document.removeEventListener('keyup', keyboardHandlers.keyup, { capture: true } as any);
      document.removeEventListener('keypress', keyboardHandlers.keypress, { capture: true } as any);
    }

    // Remove body scroll blocking event listeners
    const blockBodyScroll = (container as any)._blockBodyScroll;
    if (blockBodyScroll) {
      document.body.removeEventListener('scroll', blockBodyScroll, { capture: true } as any);
      document.body.removeEventListener('wheel', blockBodyScroll, { capture: true } as any);
      document.body.removeEventListener('touchmove', blockBodyScroll, { capture: true } as any);
    }

    // Restore original body styles
    const originalStyles = (container as any)._originalStyles;
    if (originalStyles) {
      document.body.style.overflow = originalStyles.originalOverflow || '';
      document.body.style.position = originalStyles.originalPosition || '';
      document.body.style.top = originalStyles.originalTop || '';
      document.body.style.width = '';
      // Restore scroll position
      if (originalStyles.scrollY) {
        window.scrollTo(0, originalStyles.scrollY);
      }
    }

    container.remove();
  }
}

// Initialize content script
async function init(): Promise<void> {
  try {
    const response = await checkCurrentUrl();

    if (!response.allowed) {
      showOverlay(response.goal, response.isLocked || false);
    } else {
      hideOverlay();
    }
  } catch (error) {
    console.error('Error checking URL:', error);
  }
}

// Listen for messages from background script
onMessage((message) => {
  switch (message.type) {
    case 'GOAL_SET':
      // Reload page to check if it's now allowed
      window.location.reload();
      break;
    case 'GOAL_COMPLETED':
      // Hide overlay if shown
      hideOverlay();
      break;
    case 'DAILY_RESET':
      // Show overlay since browser is now locked
      showOverlay(undefined, true);
      break;
    case 'FOCUS_TOGGLED':
      // Re-check URL when focus mode is toggled
      // If focus mode was turned off, hide overlay; if turned on, check URL
      if (message.payload === false) {
        hideOverlay();
      } else {
        init();
      }
      break;
    case 'PATTERNS_CHANGED':
      // Re-check URL when whitelist patterns change
      init();
      break;
  }
});

// Listen for navigation changes (for single-page apps)
let lastUrl = window.location.href;

function setupObserver() {
  const observer = new MutationObserver(async () => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      await init();
    }
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    init();
    setupObserver();
  });
} else {
  init();
  setupObserver();
}