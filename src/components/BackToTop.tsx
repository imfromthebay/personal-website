import React from 'react';
import { ChevronDown } from 'lucide-react';

interface BackToTopProps {
  showBackToTop: boolean;
  scrollToTop: () => void;
}

const BackToTop: React.FC<BackToTopProps> = ({ showBackToTop, scrollToTop }) => {
  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-white rounded-full shadow-lg ${
        showBackToTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{ transition: 'opacity 0.3s ease-in-out' }}
      aria-label="Back to top"
    >
      <ChevronDown className="w-6 h-6 transform rotate-180" />
    </button>
  );
};

export default BackToTop;

