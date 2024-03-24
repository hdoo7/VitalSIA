import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';

const GameText = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const loader = new FontLoader();
    loader.load(`${process.env.PUBLIC_URL}/fonts/PressStart.json`, function (font) {
      const geometry = new TextGeometry('Loading...', {
        font: font,
        size: 0.33,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5,
      });

      const material = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.7 // Set overall text opacity to 0.5
      });
      const textMesh = new THREE.Mesh(geometry, material);
      textMesh.geometry.center(); // Center the geometry
      scene.add(textMesh);

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));

      const rgbShiftPass = new ShaderPass(RGBShiftShader);
      composer.addPass(rgbShiftPass);

      const glitchPass = new GlitchPass();
      composer.addPass(glitchPass);
      glitchPass.goWild = false;

      let time = 0; // Time variable to control the oscillation

      const animate = () => {
        requestAnimationFrame(animate);
        
        time += 0.05; // Adjust the speed of oscillation

        // Oscillate the rotation around the y-axis within a small range
        textMesh.rotation.y = Math.sin(time) * 0.1; // The range of rotation

        // Randomly apply the glitch effect
        // glitchPass.goWild = Math.random() > .99999// Trigger glitch effect randomly

        // Randomly adjust the RGB shift effect's amount
        rgbShiftPass.uniforms['amount'].value = Math.random() * 0.005;

        composer.render();
      };
      animate();
    });

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  }}></div>;
};

export default GameText;
