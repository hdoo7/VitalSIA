import React from 'react';
import styled, { keyframes } from 'styled-components';

// Define the keyframes for the load animation
const loadAnimation = keyframes`
  from { width: 0%; }
  to { width: 80%; }
`;

// Styled component for the loader bar container
const LoaderBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.2); /* Light background of the loading bar */
  z-index: 1001; /* Ensure it is above other content */
`;

// Styled component for the actual loader bar
const LoaderBar = styled.div`
  height: 100%;
  background-color: #007bff; /* Blue loading bar, you can choose any color */
  width: 0%;
  animation: ${loadAnimation} 120s linear forwards; /* 120s = 2 minutes, animate to 80% width */
`;

function Loader({ isLoading }) {
  if (!isLoading) return null;

  return (
    <LoaderBarContainer>
      <LoaderBar></LoaderBar>
    </LoaderBarContainer>
  );
}

export default Loader;