import React from 'react';
import AppSurvey from './AppSurvey';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { UnityLoadProvider } from '../unityMiddleware';

const RouterWrapper = ({ showApp }) => {
  return (
    <ChakraProvider>
      <UnityLoadProvider>
        {showApp ? <App /> : <AppSurvey />}
      </UnityLoadProvider>
    </ChakraProvider>
  );
};

export default RouterWrapper;
