import React, { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";

// CRITICAL: Ensure React is available globally BEFORE any other code runs
// This fixes the "Cannot read properties of null (reading 'useState')" error
if (typeof window !== 'undefined') {
  (window as any).React = React;
  console.log('✅ React initialized in main.tsx:', { React: !!window.React });
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('<CheckCircle className="inline h-4 w-4" /> Service Worker registered successfully:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 New version available! Please refresh.');
                // Optionally show a notification to the user
                if (confirm('नया version उपलब्ध है। अभी refresh करें?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });

  // Handle offline/online status
  window.addEventListener('online', () => {
    console.log('🌐 Back online!');
  });

  window.addEventListener('offline', () => {
    console.log('📡 You are offline. Some features may not be available.');
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper>
      <App />
    </AppWrapper>
  </StrictMode>
);
