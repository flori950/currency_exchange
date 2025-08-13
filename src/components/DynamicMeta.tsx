import { useEffect } from 'react';

interface DynamicMetaProps {
  title: string;
  description?: string;
  keywords?: string;
}

export const DynamicMeta: React.FC<DynamicMetaProps> = ({ 
  title, 
  description, 
  keywords 
}) => {
  useEffect(() => {
    // Update document title
    const previousTitle = document.title;
    document.title = title;
    
    // Update meta description
    let descriptionElement = document.querySelector('meta[name="description"]');
    let previousDescription = '';
    
    if (description) {
      if (descriptionElement) {
        previousDescription = descriptionElement.getAttribute('content') || '';
        descriptionElement.setAttribute('content', description);
      } else {
        descriptionElement = document.createElement('meta');
        descriptionElement.setAttribute('name', 'description');
        descriptionElement.setAttribute('content', description);
        document.head.appendChild(descriptionElement);
      }
    }
    
    // Update keywords
    let keywordsElement = document.querySelector('meta[name="keywords"]');
    let previousKeywords = '';
    
    if (keywords) {
      if (keywordsElement) {
        previousKeywords = keywordsElement.getAttribute('content') || '';
        keywordsElement.setAttribute('content', keywords);
      } else {
        keywordsElement = document.createElement('meta');
        keywordsElement.setAttribute('name', 'keywords');
        keywordsElement.setAttribute('content', keywords);
        document.head.appendChild(keywordsElement);
      }
    }
    
    return () => {
      // Restore previous values
      document.title = previousTitle;
      if (description && descriptionElement && previousDescription) {
        descriptionElement.setAttribute('content', previousDescription);
      }
      if (keywords && keywordsElement && previousKeywords) {
        keywordsElement.setAttribute('content', previousKeywords);
      }
    };
  }, [title, description, keywords]);

  return null;
};
