import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-300 py-8 transition-colors duration-500" role="contentinfo">
      <div className="max-w-3xl mx-auto px-4 flex flex-col items-center">
        <p className="text-center text-base mb-6">
          &copy; 2025 Greg Reznik. All rights reserved. &nbsp;|&nbsp; Built 100% using AI tools.
        </p>
        <div className="flex justify-center gap-8">
          <a
            href="https://github.com/imfromthebay"
            aria-label="GitHub"
            className="hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={28} />
          </a>
          <a
            href="https://www.linkedin.com/in/gregreznik93/"
            aria-label="LinkedIn"
            className="hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={28} />
          </a>
          <a
            href="mailto:gregreznik93@gmail.com"
            aria-label="Email"
            className="hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded transition-colors duration-200"
          >
            <Mail size={28} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

