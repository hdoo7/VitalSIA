import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import { ChakraProvider } from '@chakra-ui/react';
import { UnityLoadProvider } from './unityMiddleware'; // Import UnityLoadProvider

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <UnityLoadProvider> {/* Wrap App with UnityLoadProvider */}
        <App />
      </UnityLoadProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
);
