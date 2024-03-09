import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import { ChakraProvider } from '@chakra-ui/react';
import './unity/unitySettings'; // Import unitySettings
import { UnityLoadProvider } from './unityMiddleware'; // Import UnityLoadProvider

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <UnityLoadProvider> {/* Ensure Unity load state is available throughout the app */}
        <App />
      </UnityLoadProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
