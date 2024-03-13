import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { particleOptions } from './particleOptions'; // Make sure this is correctly imported

// Keyframes for the loading bar width
const loadAnimation = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

// Keyframes for the color cycling effect
const cycleColors = keyframes`
  0% {background-position: 0% 50%}
  50% {background-position: 100% 50%}
  100% {background-position: 0% 50%}
`;
const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;

const zoomOutAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.6);
  }
`;

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  z-index: 10; // Ensure the background is below the loading bar and image
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  transition: opacity 0.5s ease;
`;

const LoaderBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, violet, indigo, blue, green, yellow, orange, red);
  background-size: 200% 200%;
  animation: ${cycleColors} 5s ease infinite; // Adjust time as needed for the cycling effect
  z-index: 30; // Highest z-index to ensure it's above everything
`;

const LoaderBar = styled.div`
  height: 100%;
  background-color: transparent;
  width: 0%;
  animation: ${loadAnimation} 90s linear forwards; // 90 seconds to complete
`;

const PosterImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('${process.env.PUBLIC_URL}/images/logo.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  opacity: 0.5;
  z-index: 20; // Ensures the image is above the background but below the loading bar
  animation: ${zoomOutAnimation} 40s ease-out infinite alternate;
`;

function Loader({ isLoading }) {
  const [loading, setLoading] = useState(isLoading);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <>
      {loading && (
        <LoaderContainer>
          <LoaderBarContainer>
            <LoaderBar />
          </LoaderBarContainer>
          <PosterImage />
          <Particles
            id="tsparticles"
            init={particlesInit}
            options={particleOptions("#ffffff")} // Example, adjust as needed
          />
        </LoaderContainer>
      )}
    </>
  );
}

export default Loader;
