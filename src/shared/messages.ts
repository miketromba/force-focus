import type { Message, MessageType } from './types';

/**
 * Send a message to the extension runtime
 */
export async function sendMessage<T = any, R = any>(
  type: MessageType,
  payload?: T
): Promise<R> {
  const message: Message<T> = { type, payload };
  try {
    return await chrome.runtime.sendMessage(message);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/**
 * Send a message to a specific tab
 */
export async function sendMessageToTab<T = any, R = any>(
  tabId: number,
  type: MessageType,
  payload?: T
): Promise<R> {
  const message: Message<T> = { type, payload };
  try {
    return await chrome.tabs.sendMessage(tabId, message);
  } catch (error) {
    console.error(`Error sending message to tab ${tabId}:`, error);
    throw error;
  }
}

/**
 * Listen for messages
 */
export function onMessage<T = any, R = any>(
  callback: (
    message: Message<T>,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: R) => void
  ) => boolean | void
): void {
  chrome.runtime.onMessage.addListener(callback);
}

/**
 * Create a message handler that routes messages by type
 */
export function createMessageHandler<T = Record<MessageType, any>>(
  handlers: Partial<{
    [K in MessageType]: (
      payload: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response: any) => void
    ) => boolean | void | Promise<any>;
  }>
) {
  return (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ): boolean => {
    const handler = handlers[message.type];

    if (!handler) {
      console.warn(`No handler for message type: ${message.type}`);
      return false;
    }

    const result = handler(message.payload, sender, sendResponse);

    // If handler returns a promise, handle it
    if (result instanceof Promise) {
      result
        .then(sendResponse)
        .catch((error) => {
          console.error(`Error handling message ${message.type}:`, error);
          sendResponse({ error: error.message });
        });
      return true; // Keep message channel open for async response
    }

    // If handler returns true, keep message channel open
    return result === true;
  };
}