import React from 'react';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tech?: string[];
  children?: React.ReactNode;
}

const Card = ({ icon, title, description, tech, children }: CardProps) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col h-full transition-colors duration-500 transform transition-transform hover:scale-105 hover:shadow-2xl">
    <div>
      <div className="text-blue-600 dark:text-blue-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
    </div>
    <div className="flex-1 flex flex-col">
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
    </div>
    {tech && (
      <div className="flex flex-wrap gap-2 mb-6">
        {tech.map((t) => (
          <span key={t} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">{t}</span>
        ))}
      </div>
    )}
    {children && <div>{children}</div>}
  </div>
);

export default Card; 