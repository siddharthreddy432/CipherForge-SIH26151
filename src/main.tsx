// Prevent "Cannot set property fetch of #<Window> which has only a getter"
// by making window.fetch writable in case a library or platform script tries to mock it.
try {
  const originalFetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    configurable: true,
    enumerable: true,
    get() { return originalFetch; },
    set(newFetch) {
      Object.defineProperty(window, 'fetch', {
        value: newFetch,
        writable: true,
        configurable: true,
        enumerable: true
      });
    }
  });
} catch (e) {
  // Ignore if we can't redefine it
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
