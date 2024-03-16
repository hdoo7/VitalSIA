import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ChakraProvider } from '@chakra-ui/react';
import './unity/unitySettings';
import { UnityLoadProvider } from './unityMiddleware';

// New React 18 root API
const container = document.getElementById('root');
const root = createRoot(container); // Create a root.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/unityCacheServiceWorker.js`).then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <UnityLoadProvider>
        <App />
      </UnityLoadProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// Register the Service Worker in production environment

