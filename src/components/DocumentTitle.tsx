import { useEffect } from 'react';

interface DocumentTitleProps {
  title: string;
}

export const DocumentTitle: React.FC<DocumentTitleProps> = ({ title }) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    
    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  return null;
};
