import { useState, useEffect } from 'react';
import type { DesignSettings, DesignStyle } from '../types';

const DEFAULT_DESIGN_SETTINGS: DesignSettings = {
  style: 'glass',
  glassmorphismIntensity: 0.8,
  borderRadius: 16,
  shadowIntensity: 0.6,
};

export const useDesign = () => {
  const [designSettings, setDesignSettings] = useState<DesignSettings>(() => {
    const saved = localStorage.getItem('currency-converter-design');
    if (saved) {
      try {
        return { ...DEFAULT_DESIGN_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_DESIGN_SETTINGS;
      }
    }
    return DEFAULT_DESIGN_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('currency-converter-design', JSON.stringify(designSettings));
    
    // Apply design settings to CSS custom properties
    const root = document.documentElement;
    
    // Glassmorphism intensity
    const glassOpacity = designSettings.glassmorphismIntensity;
    root.style.setProperty('--glass-opacity', glassOpacity.toString());
    root.style.setProperty('--backdrop-blur-intensity', `${10 + (glassOpacity * 15)}px`);
    
    // Border radius
    root.style.setProperty('--radius-base', `${designSettings.borderRadius}px`);
    root.style.setProperty('--radius-sm', `${designSettings.borderRadius * 0.5}px`);
    root.style.setProperty('--radius-md', `${designSettings.borderRadius * 0.75}px`);
    root.style.setProperty('--radius-lg', `${designSettings.borderRadius * 1.25}px`);
    root.style.setProperty('--radius-xl', `${designSettings.borderRadius * 1.5}px`);
    
    // Shadow intensity
    const shadowIntensity = designSettings.shadowIntensity;
    root.style.setProperty('--shadow-intensity', shadowIntensity.toString());
    
    // Design style specific adjustments
    switch (designSettings.style) {
      case 'minimal':
        root.style.setProperty('--border-glass-opacity', '0.1');
        root.style.setProperty('--bg-glass-opacity', '0.05');
        break;
      case 'classic':
        root.style.setProperty('--border-glass-opacity', '0.3');
        root.style.setProperty('--bg-glass-opacity', '0.8');
        root.style.setProperty('--backdrop-blur-intensity', '0px');
        break;
      case 'glass':
      default:
        root.style.setProperty('--border-glass-opacity', '0.2');
        root.style.setProperty('--bg-glass-opacity', glassOpacity.toString());
        break;
    }
  }, [designSettings]);

  const updateDesignSetting = <K extends keyof DesignSettings>(
    key: K,
    value: DesignSettings[K]
  ) => {
    setDesignSettings(prev => ({ ...prev, [key]: value }));
  };

  const setDesignStyle = (style: DesignStyle) => {
    updateDesignSetting('style', style);
  };

  const resetToDefault = () => {
    setDesignSettings(DEFAULT_DESIGN_SETTINGS);
  };

  return {
    designSettings,
    updateDesignSetting,
    setDesignStyle,
    resetToDefault,
  };
};
