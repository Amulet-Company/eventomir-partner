"use client";

import * as React from "react";

/**
 * Custom React hook to manage event listeners on a specified target.
 *
 * Overload 1: For Window events (default)
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions,
): void;

/**
 * Overload 2: For HTML Elements (e.g., div, button)
 */
export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLElement,
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: T | null,
  options?: boolean | AddEventListenerOptions,
): void;

/**
 * Overload 3: For Document events
 */
export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: Document,
  options?: boolean | AddEventListenerOptions,
): void;

/**
 * Implementation
 */
export function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  T extends HTMLElement | Document | Window | null,
>(
  eventName: KW | KH | string,
  handler: (
    event: WindowEventMap[KW] | HTMLElementEventMap[KH] | Event,
  ) => void,
  element?: T,
  options?: boolean | AddEventListenerOptions,
) {
  // Store the handler in a ref to avoid re-adding the listener on every render
  const savedHandler = React.useRef(handler);

  // Update the ref whenever the handler changes
  React.useLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  React.useEffect(() => {
    // Define the target element (use window if not provided)
    const targetElement: T | Window = element ?? window;

    // Ensure the target element supports addEventListener
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    // Create the event listener wrapper
    const eventListener: EventListener = (event) => {
      savedHandler.current(event);
    };

    // Add the event listener
    targetElement.addEventListener(eventName, eventListener, options);

    // Cleanup function
    return () => {
      targetElement.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}
