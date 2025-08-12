import React from 'react';
import { Github, Globe } from 'lucide-react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-author">
          <span className="footer-text">
            Created by <strong>Florian Jäger</strong>
          </span>
        </div>
        
        <div className="footer-links">
          <a 
            href="https://github.com/flroi950" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
            title="GitHub Profile"
          >
            <Github size={16} />
            <span>GitHub</span>
          </a>
          
          <a 
            href="https://florian-hunter.de" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
            title="Personal Website"
          >
            <Globe size={16} />
            <span>Website</span>
          </a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <span className="footer-copyright">
          © {new Date().getFullYear()} Currency Converter. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
