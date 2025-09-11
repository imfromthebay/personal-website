import React from 'react';
import { ChevronDown, Shield, GitBranch, Database, Zap, Lock, Code } from 'lucide-react';

interface HeroSectionProps {
  visibleSections: Set<string>;
  scrollToSection: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, sectionId: string) => void;
  scrollY: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ visibleSections, scrollToSection, scrollY }) => {
  const heroParallax = {
    transform: `translateY(${scrollY * 0.5}px)`
  };

  return (
    <section id="home" className="min-h-screen mobile-landscape:min-h-[100svh] flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-50 via-gray-100 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        style={heroParallax}
      ></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <main id="main-content" tabIndex={-1} className={`relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full ${visibleSections.has('home') ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="mb-6 sm:mb-8 lg:mb-10 mobile-landscape:mb-2 flex justify-center">
          <div className="p-2 sm:p-3 mobile-landscape:p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
            <Code className="w-8 h-8 sm:w-12 sm:h-12 mobile-landscape:w-5 mobile-landscape:h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl mobile-landscape:text-2xl font-extrabold mb-6 lg:mb-8 mobile-landscape:mb-1 leading-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent px-4 sm:px-6 lg:px-8">
          <span className="block sm:inline">Modern IT, </span>
          <span className="block sm:inline">Automated.</span>
        </h1>
        <p className="text-base md:text-lg lg:text-xl mobile-landscape:text-sm text-gray-700 dark:text-gray-300 mb-4 lg:mb-6 mobile-landscape:mb-1 font-medium px-2">
          I help fast-growing companies automate, secure, and scale their IT operations.
        </p>
        <p className="text-base md:text-lg mobile-landscape:text-xs text-gray-600 dark:text-gray-400 mb-12 lg:mb-16 mobile-landscape:mb-4 max-w-3xl mx-auto px-2 leading-relaxed">
          I deliver no-code automation, seamless MDM/IDP integration, and enterprise system connectivity. I specialize in workflow design, API integration, and helping businesses securely scale AI across their operations for greater efficiency and insight.
        </p>
        <div className="flex flex-col sm:flex-row mobile-landscape:flex-row gap-4 lg:gap-6 mobile-landscape:gap-2 justify-center items-center px-2">
          <a
            href="#contact"
            className="px-8 mobile-landscape:px-4 py-3 mobile-landscape:py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-sm hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transform hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 mobile-landscape:gap-1 mobile-landscape:text-xs"
            onClick={(e) => scrollToSection(e, '#contact')}
            tabIndex={0}
            aria-label="Schedule Consultation"
          >
            <Shield size={20} className="mobile-landscape:w-3 mobile-landscape:h-3" />
            Schedule Consultation
          </a>
          <a
            href="#resume"
            className="px-8 mobile-landscape:px-4 py-3 mobile-landscape:py-1.5 border-2 border-gray-800 dark:border-gray-300 text-gray-800 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 flex items-center justify-center gap-2 mobile-landscape:gap-1 active:scale-95 mobile-landscape:text-xs"
            onClick={(e) => scrollToSection(e, '#resume')}
            tabIndex={0}
            aria-label="View Experience"
          >
            <GitBranch size={20} className="mobile-landscape:w-3 mobile-landscape:h-3" />
            View Experience
          </a>
        </div>
        <div className="mt-12 lg:mt-20 mobile-landscape:mt-3 flex flex-wrap justify-center gap-4 sm:gap-8 lg:gap-12 mobile-landscape:gap-2 text-sm mobile-landscape:text-xs text-gray-600 dark:text-gray-400 mx-auto px-2">
          <div className="flex items-center gap-2 mobile-landscape:gap-1">
            <Zap className="w-4 h-4 mobile-landscape:w-2.5 mobile-landscape:h-2.5 text-green-500 flex-shrink-0" />
            <span className="whitespace-nowrap">Bleeding Edge</span>
          </div>
          <div className="flex items-center gap-2 mobile-landscape:gap-1">
            <Lock className="w-4 h-4 mobile-landscape:w-2.5 mobile-landscape:h-2.5 text-blue-500 flex-shrink-0" />
            <span className="whitespace-nowrap">Security First</span>
          </div>
          <div className="flex items-center gap-2 mobile-landscape:gap-1">
            <Database className="w-4 h-4 mobile-landscape:w-2.5 mobile-landscape:h-2.5 text-purple-500 flex-shrink-0" />
            <span className="whitespace-nowrap">Scalable Solutions</span>
          </div>
        </div>
      </main>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 sm:pb-10 mobile-landscape:pb-4">
        <div className="animate-bounce">
          <a
            href="#about"
            onClick={(e) => scrollToSection(e, '#about')}
            className="block cursor-pointer"
            aria-label="Scroll to About section"
          >
            <ChevronDown size={32} className="mobile-landscape:w-6 mobile-landscape:h-6 text-gray-400 dark:text-gray-600" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
