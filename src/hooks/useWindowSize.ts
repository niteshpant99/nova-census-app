// src/hooks/useWindowSize.ts
import { useState, useEffect } from 'react';

/**
 * Hook for responsive design that safely handles window resizing
 * 
 * Returns the current window dimensions, handling SSR safely by
 * providing sensible defaults until client-side rendering.
 * 
 * @returns Object containing window width and height
 */
export function useWindowSize() {
  // Initialize with default values for SSR
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });
  
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures effect runs only on mount
  
  return windowSize;
}

/**
 * Utility function to determine if the viewport is mobile-sized
 * @param width Current window width
 * @returns Object with boolean flags for different screen sizes
 */
export function getResponsiveBreakpoints(width: number) {
  return {
    isXs: width < 480,
    isSm: width >= 480 && width < 768,
    isMd: width >= 768 && width < 1024,
    isLg: width >= 1024,
    isVerySmall: width < 360
  };
}