import { useState, useEffect } from 'react';
import { ChevronDown, Download, Mail, Github, Linkedin, Menu, X, Calendar, ArrowRight, Shield, Code, Server, Database, Moon, Sun, GitBranch, Lock, Zap, Phone, Brain } from 'lucide-react';
import SectionTitle from './components/SectionTitle';
import Button from './components/Button';

// Constants for better maintainability
const NAVIGATION_HEIGHT = 64;
const SCROLL_THRESHOLD = 50;
const BACK_TO_TOP_THRESHOLD = 300;
const INTERSECTION_THRESHOLD = 0.1;
const STAGGER_DELAY_MS = 100;
const PARALLAX_FACTOR = 0.5;

// Type definitions for data structures
interface NavigationItem {
  name: string;
  href: string;
}

interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  tech: string[];
}

interface Skill {
  name: string;
  level: number;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Main component for the personal website featuring responsive design,
 * dark mode support, smooth animations, and accessibility features.
 */
const PersonalWebsite = () => {
  // State management
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set<string>());
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });

  /**
   * Smoothly scrolls to a specific section with proper offset for fixed navigation
   * @param e - The mouse event from the clicked element
   * @param sectionId - The target section ID (e.g., '#about')
   */
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.querySelector(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - NAVIGATION_HEIGHT;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  /**
   * Initialize dark mode preference from localStorage or system preference
   */
  useEffect(() => {
    // Check if user has a saved preference in localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode !== null) {
      // Use saved preference
      setDarkMode(savedDarkMode === 'true');
    } else {
      // Fall back to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }

    // Inject custom animation styles
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slide-in-left {
        from { opacity: 0; transform: translateX(-50px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes slide-in-right {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes scale-in {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.4,0,0.2,1); }
      .animate-slide-in-left { animation: slide-in-left 0.8s cubic-bezier(0.4,0,0.2,1); }
      .animate-slide-in-right { animation: slide-in-right 0.8s cubic-bezier(0.4,0,0.2,1); }
      .animate-scale-in { animation: scale-in 0.8s cubic-bezier(0.4,0,0.2,1); }
      .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.4,0,0.2,1); }
      .bg-grid-pattern {
        background-image: 
          linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
      }
      html {
        scroll-behavior: smooth;
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `;
    document.head.appendChild(styleSheet);
    
    // Cleanup function to remove injected styles
    return () => {
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  /**
   * Handle scroll events for navigation styling and back-to-top button
   */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > SCROLL_THRESHOLD);
      setScrollY(currentScrollY);
      setShowBackToTop(currentScrollY > BACK_TO_TOP_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Set up intersection observer for scroll-triggered animations
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: INTERSECTION_THRESHOLD }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  /**
   * Toggle between light and dark mode and save preference
   */
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    // Save preference to localStorage
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  /**
   * Apply dark mode styles to document root and body
   */
  useEffect(() => {
    const documentElement = document.documentElement;
    const body = document.body;
    const transitionStyle = 'background-color 0.5s, color 0.5s';

    if (darkMode) {
      documentElement.classList.add('dark');
      documentElement.style.backgroundColor = '#111827';
      body.style.backgroundColor = '#111827';
    } else {
      documentElement.classList.remove('dark');
      documentElement.style.backgroundColor = '#f3f4f6';
      body.style.backgroundColor = '#f3f4f6';
    }
    
    documentElement.style.transition = transitionStyle;
    body.style.transition = transitionStyle;
  }, [darkMode]);

  // Navigation menu items
  const navigation: NavigationItem[] = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Resume', href: '#resume' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' }
  ];

  // Services offered data
  const services: Service[] = [
    {
      title: 'AI Opportunity Assessment & Implementation',
      description: 'I work with businesses to identify where AI can make a real impact—whether that\'s streamlining operations, improving customer experience, or unlocking new insights. I focus on making AI adoption secure, practical, and aligned with your goals, so it delivers real value without adding unnecessary complexity.',
      icon: <Brain className="w-8 h-8" />,
      tech: ['ChatGPT', 'Claude', 'Gemini', 'AI']
    },
    {
      title: 'IT Service Desk Deployment',
      description: 'I design and implement modern IT service desks from the ground up. By leveraging contemporary platforms, I deliver automated, scalable, and user-friendly support. I streamline ticketing, approvals, and employee lifecycle processes for secure and efficient operations.',
      icon: <Zap className="w-8 h-8" />,
      tech: ['Jira', 'Slack', 'Linear', 'ClickUp', 'Asana', 'Notion']
    },
    {
      title: 'Enterprise SaaS Management',
      description: 'I implement and oversee 100+ SaaS integrations (Okta, Slack, Jira, Confluence, etc.). I automate user lifecycle management (onboarding/offboarding), access reviews, and RBAC. I streamline SaaS procurement, SSO, and security policy enforcement for secure and efficient operations.',
      icon: <Server className="w-8 h-8" />,
      tech: ['Okta', 'Slack', 'Jira', 'Confluence']
    },
    {
      title: 'Flowgramming & Integration',
      description: 'As an expert in complex workflow and no-code automation, I design and implement robust solutions. I connect enterprise systems through API integrations and create scalable workflow designs.',
      icon: <GitBranch className="w-8 h-8" />,
      tech: ['API Integration', 'Workflow Design', 'Zapier', 'Okta Workflows']
    }
  ];

  // Technical skills with proficiency levels
  const skills: Skill[] = [
    { name: 'Enterprise SaaS', level: 88 },
    { name: 'Enterprise Security', level: 91 },
    { name: 'Flowgramming', level: 90 },
    { name: 'IDP Integration', level: 92 },
    { name: 'MDM Deployment', level: 94 },
    { name: 'Workflow Automation', level: 95 }
  ];

  // Professional certifications and specializations
  const certifications: string[] = [
    'MDM and IDP Implementation',
    'AI Opportunity Assessment',
    'Enterprise Security Hardening',
    'IT Leadership & Mentoring'
  ];

  /**
   * Handle form input changes for the contact form
   * @param e - The change event from form inputs
   */
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Calculate parallax effect for hero section background
   */
  const heroParallax = {
    transform: `translateY(${scrollY * PARALLAX_FACTOR}px)`
  };

  /**
   * Generate staggered animation delay for list items
   * @param index - The index of the item in the list
   * @returns CSS style object with animation delay
   */
  const getStaggerDelay = (index: number) => ({
    animationDelay: `${index * STAGGER_DELAY_MS}ms`
  });

  /**
   * Scroll to the top of the page smoothly
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-500">
        {/* Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 transition-all duration-500 transition-colors
          ${scrolled 
            ? 'bg-white dark:bg-gray-900 shadow-md' 
            : 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-md'
          }`} role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={scrollToTop}
                  aria-label="Scroll to top"
                  tabIndex={0}
                  className="focus:outline-none rounded bg-transparent border-none p-0 m-0"
                  style={{ cursor: 'pointer' }}
                >
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Greg Reznik
                  </span>
                </button>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                    onClick={(e) => {
                      scrollToSection(e, item.href);
                    }}
                  >
                    {item.name}
                  </a>
                ))}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center gap-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-gray-100 dark:bg-gray-900 border-t dark:border-gray-800">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    onClick={(e) => {
                      scrollToSection(e, item.href);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-50 via-gray-100 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
            style={heroParallax}
          ></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <main id="main-content" tabIndex={-1} className={`relative z-10 text-center px-4 max-w-4xl mx-auto ${visibleSections.has('home') ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="mb-6 flex justify-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                <Code className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
               Modern IT, Automated.
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-3 font-medium">
              I help fast-growing companies automate, secure, and scale their IT operations.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              I deliver no-code automation, seamless MDM/IDP integration, and enterprise system connectivity. I specialize in workflow design, API integration, and helping businesses securely scale AI across their operations for greater efficiency and insight.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#contact"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-sm hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transform hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center gap-2"
                onClick={(e) => scrollToSection(e, '#contact')}
                tabIndex={0}
                aria-label="Schedule Consultation"
              >
                <Shield size={20} />
                Schedule Consultation
              </a>
              <a
                href="#resume"
                className="px-8 py-3 border-2 border-gray-800 dark:border-gray-300 text-gray-800 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 flex items-center gap-2 active:scale-95"
                onClick={(e) => scrollToSection(e, '#resume')}
                tabIndex={0}
                aria-label="View Experience"
              >
                <GitBranch size={20} />
                View Experience
              </a>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-gray-600 dark:text-gray-400 mx-auto">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-500" />
                <span>Bleeding Edge</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" />
                <span>Security First</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-500" />
                <span>Scalable Solutions</span>
              </div>
            </div>
          </main>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 sm:pb-10">
            <div className="animate-bounce">
              <a 
                href="#about" 
                onClick={(e) => scrollToSection(e, '#about')}
                className="block cursor-pointer"
                aria-label="Scroll to About section"
              >
                <ChevronDown size={32} className="text-gray-400 dark:text-gray-600" />
              </a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 sm:py-20 bg-gray-100 dark:bg-gray-800 transition-colors duration-500" aria-labelledby="about-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={visibleSections.has('about') ? 'animate-fade-in' : 'opacity-0'}>
              <SectionTitle>Technical Expertise</SectionTitle>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className={`${visibleSections.has('about') ? 'animate-slide-in-left' : 'opacity-0'}`}>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop"
                    alt="Code on a terminal screen"
                    className="rounded-2xl shadow-xl object-cover aspect-square w-full h-80 max-w-lg mx-auto"
                  />
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl -z-10"></div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {certifications.map((cert, index) => (
                    <div
                      key={cert}
                      className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 flex items-center gap-2 min-h-[56px] break-words whitespace-normal min-w-0"
                      style={getStaggerDelay(index)}
                      aria-label={cert}
                    >
                      <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 break-words whitespace-normal min-w-0">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`${visibleSections.has('about') ? 'animate-slide-in-right' : 'opacity-0'}`}>
                <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Modern IT Strategy & Implementation</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  With a strong track record in enterprise IT, I design and implement high-impact solutions that support mission-critical operations for top-tier organizations. I bring a unique blend of deep technical expertise and strategic business acumen to every engagement.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  I turn complex challenges into scalable, automated systems that drive efficiency and resilience—from zero-trust security architectures to full-scale device management platforms. I also help businesses uncover and evaluate AI opportunities, ensuring secure, practical, and high-value adoption of artificial intelligence across their workflows.
                </p>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={skill.name} style={getStaggerDelay(index)}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
                        <span className="text-gray-600 dark:text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2" role="progressbar" aria-valuenow={skill.level} aria-valuemin={0} aria-valuemax={100} aria-label={skill.name}>
                        <div
                          className={`bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-1000 ${
                            visibleSections.has('about') ? '' : 'w-0'
                          }`}
                          style={{ 
                            width: visibleSections.has('about') ? `${skill.level}%` : '0%',
                            transitionDelay: `${index * 100}ms`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resume Section */}
        <section id="resume" className="py-16 sm:py-20 bg-white dark:bg-gray-900 transition-colors duration-500" aria-labelledby="resume-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={visibleSections.has('resume') ? 'animate-fade-in' : 'opacity-0'}>
              <SectionTitle>Professional Experience</SectionTitle>
            </div>
            <div className={`bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 md:p-12 transition-colors duration-500 space-y-10 ${
              visibleSections.has('resume') ? 'animate-scale-in' : 'opacity-0'
            }`}>
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Experience</h3>
                <div className="space-y-8">
                  <div className="border-l-4 border-blue-600 dark:border-blue-400 pl-6">
                    <h4 className="text-xl font-semibold">Senior IT Systems Engineer</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">OpenSea • April 2022 - Present</p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                      <li>Founded and architected complete IT stack from scratch, including MDM, IDP, and security solutions</li>
                      <li>Led implementation of zero-trust security architecture with hardware-based MFA and EDR deployment</li>
                      <li>Managed 180+ vendor SSO integrations and automated employee lifecycle access management</li>
                      <li>Built comprehensive automation framework using Terraform, GitHub Actions, and Okta Workflows</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-purple-600 dark:border-purple-400 pl-6">
                    <h4 className="text-xl font-semibold">IT Engineer</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Scribd • September 2019 - April 2022</p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                      <li>Led implementation of enterprise SaaS stack including Jamf, Okta, and security solutions</li>
                      <li>Built CI/CD pipeline for Jamf asset control and automated endpoint security management</li>
                      <li>Managed 100+ app integrations and implemented comprehensive RBAC system</li>
                      <li>Deployed and managed Crowdstrike Falcon EDR with automated monitoring</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-green-600 dark:border-green-400 pl-6">
                    <h4 className="text-xl font-semibold">Systems Administrator</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Atlassian • January 2019 - June 2019</p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                      <li>Top US team ticket resolver with 4.97/5 customer satisfaction rating</li>
                      <li>Managed A/V systems and conference room technology infrastructure</li>
                      <li>Automated new-hire setup process and maintained JAMF policies</li>
                      <li>Led company-wide technology rollouts including Zoom migration and Yubikey deployment</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-yellow-600 dark:border-yellow-400 pl-6">
                    <h4 className="text-xl font-semibold">IT Support Specialist</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">SigFig • May 2017 - Dec 2018</p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                      <li>Resolved 43%+ of IT support requests without escalation</li>
                      <li>Led conference room upgrades and office buildouts</li>
                      <li>Managed onboarding, JAMF, and SSO integrations</li>
                      <li>Standardized hardware and optimized procurement</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-pink-600 dark:border-pink-400 pl-6">
                    <h4 className="text-xl font-semibold">IT Intern</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Synack, Inc. • May 2016 - Oct 2016</p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                      <li>Provided IT support for devices, apps, and AV systems</li>
                      <li>Managed JAMF patching and device imaging</li>
                      <li>Maintained IT inventory and security compliance</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <a
                  href="/personal-website/GregoryReznikResume-2025.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-1 active:scale-95 transition-all duration-300"
                >
                  <Download size={20} />
                  Download Full Resume (PDF)
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-8 sm:py-12 bg-gray-100 dark:bg-gray-800 transition-colors duration-500" aria-labelledby="services-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={visibleSections.has('services') ? 'animate-fade-in' : 'opacity-0'}>
              <SectionTitle>Consulting Services</SectionTitle>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
              {services.map((service, index) => (
                <div
                  key={index}
                  style={{
                    ...getStaggerDelay(index),
                    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                  }}
                  className={`h-full bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-lg transform hover:-translate-y-1 flex flex-col justify-between ${
                    visibleSections.has('services') 
                      ? 'opacity-100 translate-x-0' 
                      : `opacity-0 ${index < 2 ? '-translate-x-12' : 'translate-x-12'}`
                  }`}
                  tabIndex={0}
                  aria-label={service.title}
                >
                  <div className="flex flex-col flex-grow">
                    <div>
                      <div className="mb-4 text-blue-600 dark:text-blue-400">{service.icon}</div>
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
                        {service.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6 min-h-[48px] items-end mt-auto">
                      {service.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-sm hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none active:scale-95 transition-all duration-300 mt-auto"
                    onClick={(e) => { e.preventDefault(); scrollToSection(e, '#contact'); }}
                    aria-label={`Learn more about ${service.title}`}
                  >
                    Learn More <ArrowRight size={16} className="ml-2" />
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Need a custom solution? Let&#39;s discuss your technical challenges.
              </p>
              <Button
                variant="gradient"
                iconLeft={<Calendar size={20} />}
                className="gap-2 shadow-sm hover:shadow-lg transform hover:-translate-y-1 active:scale-95 transition-all duration-300"
                onClick={(e) => scrollToSection(e, '#contact')}
              >
                Schedule Technical Consultation
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-8 sm:py-12 bg-white dark:bg-gray-900 transition-colors duration-500" aria-labelledby="contact-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={visibleSections.has('contact') ? 'animate-fade-in' : 'opacity-0'}>
              <SectionTitle>Get In Touch</SectionTitle>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`${visibleSections.has('contact') ? 'animate-slide-in-left' : 'opacity-0'}`}>
                <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Let's Connect</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  I help businesses modernize IT infrastructure, implement zero-trust security, and automate operations. I deliver solutions that are secure, efficient, and scalable. I also work closely with them to integrate AI in a way that enhances—not complicates—their workflows, turning technical challenges into competitive advantages.
                </p>
                <div className="mt-8 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Mail className="text-blue-600 dark:text-blue-400" size={24} />
                    <a href="mailto:gregreznik93@gmail.com" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      gregreznik93@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="text-blue-600 dark:text-blue-400" size={24} />
                    <span className="text-gray-700 dark:text-gray-300">
                      (415) 309-2272
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Linkedin className="text-blue-600 dark:text-blue-400" size={24} />
                    <a href="https://www.linkedin.com/in/gregreznik93/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" target="_blank" rel="noopener noreferrer">
                      linkedin.com/in/gregreznik93
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Github className="text-blue-600 dark:text-blue-400" size={24} />
                    <a href="https://github.com/imfromthebay" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" target="_blank" rel="noopener noreferrer">
                      github.com/imfromthebay
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
                    <a
                      href="https://calendar.app.google/bzcQZYGQtsoiTdua6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      aria-label="Book a meeting on my calendar"
                    >
                      Book a Meeting
                    </a>
                  </div>
                </div>
              </div>
              <div className={`${visibleSections.has('contact') ? 'animate-slide-in-right' : 'opacity-0'}`}>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 transition-colors duration-500">
                  <form aria-label="Contact form" autoComplete="on">
                    <div className="mb-6">
                      <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        aria-required="true"
                        aria-label="Name"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="mb-6">
                      <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        aria-required="true"
                        aria-label="Email"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        aria-required="true"
                        aria-label="Message"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all resize-none"
                        value={formData.message}
                        onChange={handleFormChange}
                        placeholder="Tell me about your project..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-sm hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none active:scale-95 transition-all duration-300"
                    >
                      Send Secure Message
                    </button>
                    <p className="mt-4 text-xs text-gray-500 dark:text-gray-500 text-center">
                      Your information is encrypted and will never be shared.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
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

        {/* Back to Top Button */}
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

        {/* Global style for html, body background-color transition */}
        <style>{`
          html, body { transition: background-color 0.5s, color 0.5s; }
        `}</style>
      </div>
    </div>
  );
};

export default PersonalWebsite;