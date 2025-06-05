import { useState, useEffect } from 'react';
import { ChevronDown, Download, Mail, Github, Linkedin, Menu, X, Calendar, ArrowRight, Shield, Code, Server, Database, Moon, Sun, GitBranch, Lock, Zap, Phone, Brain, CheckCircle, XCircle } from 'lucide-react';
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
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);

  // Store form data at submission time to avoid timing issues with hCaptcha callback
  const [submissionData, setSubmissionData] = useState<FormData | null>(null);

  // Security: Track submission attempts for basic rate limiting
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number>(0);
  const [submissionCount, setSubmissionCount] = useState<number>(0);

  // Store hCaptcha widget ID for programmatic control
  const [hCaptchaWidgetId, setHCaptchaWidgetId] = useState<string | null>(null);

  /**
   * Natural smooth scroll with gentle easing
   */
  const smoothScrollTo = (targetPosition: number, duration: number = 1000) => {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    // Gentle ease-out curve that feels natural
    const easeOutQuart = (t: number): number => {
      return 1 - Math.pow(1 - t, 4);
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      const easedProgress = easeOutQuart(progress);
      window.scrollTo(0, startPosition + distance * easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

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
      smoothScrollTo(offsetPosition);
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
        scroll-behavior: auto;
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

  /**
   * Initialize hCaptcha widget after component mounts and when theme changes
   */
  useEffect(() => {
    const initializeHCaptcha = () => {
      // Check if hCaptcha is loaded and if widget needs to be rendered
      if (typeof window !== 'undefined' && (window as any).hcaptcha) {
        const captchaElement = document.getElementById('hcaptcha-container');
        if (captchaElement) {
          // Reset the element by removing any existing content
          captchaElement.innerHTML = '';
          
          const sitekey = captchaElement.getAttribute('data-sitekey');
          const size = captchaElement.getAttribute('data-size') || 'invisible';
          const theme = captchaElement.getAttribute('data-theme') || 'light';
          
          if (sitekey) {
            try {
              const widgetId = (window as any).hcaptcha.render(captchaElement, {
                sitekey: sitekey,
                size: size,
                theme: theme,
                callback: (token: string) => {
                  // This will be called when hCaptcha is completed
                  console.log('hCaptcha completed, submitting form...');
                  console.log('Submission data in callback:', submissionData);
                  console.log('Current form data in callback:', formData);
                  submitFormWithToken(token);
                },
                'error-callback': () => {
                  console.error('hCaptcha error occurred');
                  setIsSubmitting(false);
                  setFormStatus('error');
                }
              });
              setHCaptchaWidgetId(widgetId);
              console.log('hCaptcha invisible widget initialized/re-initialized from React');
            } catch (error) {
              console.error('Error initializing hCaptcha from React:', error);
            }
          }
        }
      } else {
        // If hCaptcha not loaded yet, try again in a bit
        setTimeout(initializeHCaptcha, 500);
      }
    };

    // Wait a moment for the DOM to be ready, then initialize
    const timeoutId = setTimeout(initializeHCaptcha, 100);
    
    return () => clearTimeout(timeoutId);
  }, [darkMode]); // Add darkMode as a dependency

  // Technical skills with professional expertise
  const skills: string[] = [
    '🏢 Enterprise SaaS',
    '🔒 Enterprise Security', 
    '⚡ Flowgramming',
    '🔑 IDP Integration',
    '📱 MDM Deployment',
    '🤖 Workflow Automation',
    '🧠 AI Integration'
  ];

  /**
   * Auto-rotate through skills every 2.5 seconds
   */
  useEffect(() => {
    if (visibleSections.has('about')) {
      const interval = setInterval(() => {
        setCurrentSkillIndex((prev) => (prev + 1) % skills.length);
      }, 2500);
      
      return () => clearInterval(interval);
    }
  }, [visibleSections, skills.length]);

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
    const { name, value } = e.target;
    // Sanitize input for security
    const sanitizedValue = sanitizeInput(value);
    setFormData({ ...formData, [name]: sanitizedValue });
  };

  /**
   * Submit form with hCaptcha token after challenge is completed
   * @param token - The hCaptcha token from the completed challenge
   */
  const submitFormWithToken = async (token: string) => {
    try {
      console.log('=== SUBMISSION FUNCTION DEBUG ===');
      console.log('hCaptcha token received:', token ? 'YES - ' + token.substring(0, 20) + '...' : 'NO');
      console.log('submissionData state:', submissionData);
      
      // Use the stored submission data
      if (!submissionData) {
        console.error('ERROR: No submission data available!');
        setFormStatus('error');
        setIsSubmitting(false);
        return;
      }
      
      const payload = {
        access_key: '618ea5ea-5cac-4d2f-9b2b-51bb959a95db',
        name: submissionData.name,
        email: submissionData.email,
        message: submissionData.message,
        'h-captcha-response': token,
        subject: `New message from ${submissionData.name}`,
        from_name: submissionData.name,
        replyto: submissionData.email,
      };
      
      console.log('=== FINAL PAYLOAD TO WEB3FORMS ===');
      console.log('Payload:', payload);
      console.log('Name field:', payload.name);
      console.log('Email field:', payload.email);  
      console.log('Message field:', payload.message);
      console.log('Token field:', payload['h-captcha-response'] ? 'PRESENT' : 'MISSING');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const responseData = await response.json();
        console.log('Success response:', responseData);
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' }); // Clear form
        setSubmissionData(null); // Clear captured submission data
        // Success message persists until page reload/navigation
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = await response.text();
        }
        console.error('Web3Forms submission error:', errorData);
        console.error('Error response status:', response.status);
        console.error('Error response statusText:', response.statusText);
        console.error('Full response headers:', [...response.headers.entries()]);
        
        // Check for common Web3Forms errors
        if (response.status === 422) {
          console.error('Validation error - check required fields');
        } else if (response.status === 401) {
          console.error('Access key error - invalid access key');
        } else if (response.status === 403) {
          console.error('Forbidden - possibly CAPTCHA verification failed');
        }
        
        setFormStatus('error');
        // Error message persists until successful resubmission
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus('error');
      // Error message persists until successful resubmission
    } finally {
      setIsSubmitting(false);
    }
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
    smoothScrollTo(0); // Uses default 1000ms duration
  };

  /**
   * Security: Sanitize user input to prevent basic injection attempts
   */
  const sanitizeInput = (input: string): string => {
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .substring(0, 5000); // Limit length
  };

  /**
   * Security: Validate email format more strictly
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
  };

  /**
   * Security: Check rate limiting (max 3 submissions per 5 minutes)
   */
  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    // Reset counter if more than 5 minutes have passed
    if (now - lastSubmissionTime > fiveMinutes) {
      setSubmissionCount(0);
    }
    
    // Check if under rate limit
    if (submissionCount >= 3) {
      const timeLeft = Math.ceil((fiveMinutes - (now - lastSubmissionTime)) / 1000 / 60);
      console.warn(`Rate limit exceeded. Please wait ${timeLeft} minutes before submitting again.`);
      return false;
    }
    
    return true;
  };

  return (
    <div className={`min-h-screen overflow-x-hidden ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-500 overflow-x-hidden">
        {/* Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 transition-all duration-500 transition-colors
          ${scrolled 
            ? 'bg-white dark:bg-gray-900 shadow-md' 
            : 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-md'
          }`} role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex items-center flex-shrink-0">
                <button
                  onClick={scrollToTop}
                  aria-label="Scroll to top"
                  tabIndex={0}
                  className="focus:outline-none rounded bg-transparent border-none p-0 m-0"
                  style={{ cursor: 'pointer' }}
                >
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent whitespace-nowrap">
                    Greg Reznik
                  </span>
                </button>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4 lg:space-x-8 flex-shrink-0">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm lg:text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium whitespace-nowrap"
                    onClick={(e) => {
                      scrollToSection(e, item.href);
                    }}
                  >
                    {item.name}
                  </a>
                ))}
                <button
                  onClick={toggleDarkMode}
                  className="p-1.5 lg:p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={18} className="lg:w-5 lg:h-5" /> : <Moon size={18} className="lg:w-5 lg:h-5" />}
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <button
                  onClick={toggleDarkMode}
                  className="p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={16} className="sm:w-5 sm:h-5" /> : <Moon size={16} className="sm:w-5 sm:h-5" />}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {mobileMenuOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-gray-100 dark:bg-gray-900 border-t dark:border-gray-800">
              <div className="px-3 sm:px-4 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
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
        <section id="home" className="min-h-screen mobile-landscape:min-h-[100svh] flex items-center justify-center relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-50 via-gray-100 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
            style={heroParallax}
          ></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <main id="main-content" tabIndex={-1} className={`relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full ${visibleSections.has('home') ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="mb-6 sm:mb-8 lg:mb-10 mobile-landscape:mb-2 flex justify-center">
              <div className="p-2 sm:p-3 mobile-landscape:p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                <Code className="w-8 h-8 sm:w-12 sm:h-12 mobile-landscape:w-5 mobile-landscape:h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl mobile-landscape:text-2xl font-extrabold mb-6 lg:mb-8 mobile-landscape:mb-1 leading-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent px-2 sm:whitespace-nowrap">
               Modern IT, Automated.
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

        {/* About Section */}
        <section id="about" className="py-16 sm:py-20 mobile-landscape:py-6 bg-gray-100 dark:bg-gray-800 transition-colors duration-500" aria-labelledby="about-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={visibleSections.has('about') ? 'animate-fade-in' : 'opacity-0'}>
              <SectionTitle>Technical Expertise</SectionTitle>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className={`${visibleSections.has('about') ? 'animate-slide-in-left' : 'opacity-0'}`}>
                <div className="relative max-w-lg mx-auto lg:mx-0">
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=800&fit=crop&auto=format&q=80"
                    alt="Modern laptop with code on screen in a professional workspace"
                    className="rounded-2xl shadow-xl object-cover aspect-square w-full h-64 sm:h-80"
                  />
                </div>
                <div className="mt-6 sm:mt-8 max-w-lg mx-auto lg:mx-0">
                  {/* Certification Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2 sm:gap-4 justify-center lg:justify-start">
                    {certifications.map((cert, index) => (
                      <div
                        key={cert}
                        className="bg-gray-50 dark:bg-gray-900 p-2 sm:p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col items-center gap-1 sm:gap-2 min-h-[60px] sm:min-h-[56px] text-center justify-center"
                        style={getStaggerDelay(index)}
                        aria-label={cert}
                      >
                        <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight">{cert}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Skills Rotating Carousel */}
                  <div className={`mt-4 sm:mt-6 ${visibleSections.has('about') ? 'animate-fade-in' : 'opacity-0'}`}>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 min-h-[48px] sm:min-h-[56px] flex items-center justify-center">
                      <div className="text-center w-full">
                        {/* Main rotating skill display */}
                        <div className="relative h-5 sm:h-6 flex items-center justify-center overflow-hidden">
                          {skills.map((skill, index) => (
                            <div
                              key={skill}
                              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                                index === currentSkillIndex 
                                  ? 'opacity-100 transform translate-y-0 scale-100' 
                                  : index === (currentSkillIndex - 1 + skills.length) % skills.length
                                  ? 'opacity-0 transform -translate-y-8 scale-95'
                                  : 'opacity-0 transform translate-y-8 scale-95'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-2">
                                <span className="text-sm sm:text-lg flex-shrink-0">{skill.split(' ')[0]}</span>
                                <h3 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent text-center min-w-0">
                                  {skill.split(' ').slice(1).join(' ')}
                                </h3>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Progress indicators */}
                        <div className="flex justify-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
                          {skills.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSkillIndex(index)}
                              className={`w-1 h-1 rounded-full transition-all duration-300 touch-manipulation ${
                                index === currentSkillIndex
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 w-3 sm:w-4'
                                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                              }`}
                              aria-label={`Show ${skills[index]}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${visibleSections.has('about') ? 'animate-slide-in-right' : 'opacity-0'} mt-8 lg:mt-0`}>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">Modern IT Strategy & Implementation</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                  With a strong track record in enterprise IT, I design and implement high-impact solutions that support mission-critical operations for top-tier organizations. I bring a unique blend of deep technical expertise and strategic business acumen to every engagement.
                </p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
                  I turn complex challenges into scalable, automated systems that drive efficiency and resilience—from zero-trust security architectures to full-scale device management platforms. I also help businesses uncover and evaluate AI opportunities, ensuring secure, practical, and high-value adoption of artificial intelligence across their workflows.
                </p>
                
                {/* Call to Action Button */}
                <div className="text-center lg:text-left">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-sm hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transform hover:-translate-y-1 active:scale-95 transition-all duration-300 mb-6 sm:mb-8 text-sm sm:text-base"
                    onClick={(e) => scrollToSection(e, '#contact')}
                    aria-label="Schedule Technical Consultation"
                  >
                    <Calendar size={18} className="sm:w-5 sm:h-5" />
                    Schedule Technical Consultation
                  </a>
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
                  href="/GregoryReznikResume-2025.pdf"
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
        <section id="services" className="py-8 sm:py-12 lg:py-16 bg-gray-100 dark:bg-gray-800 transition-colors duration-500" aria-labelledby="services-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={visibleSections.has('services') ? 'animate-fade-in' : 'opacity-0'}>
              <SectionTitle>Consulting Services</SectionTitle>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-stretch">
              {services.map((service, index) => (
                <div
                  key={index}
                  style={{
                    ...getStaggerDelay(index),
                    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                  }}
                  className={`h-full bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-lg transform hover:-translate-y-1 flex flex-col justify-between ${
                    visibleSections.has('services') 
                      ? 'opacity-100 translate-x-0' 
                      : `opacity-0 ${index < 2 ? '-translate-x-12' : 'translate-x-12'}`
                  }`}
                  tabIndex={0}
                  aria-label={service.title}
                >
                  <div className="flex flex-col flex-grow">
                    <div>
                      <div className="mb-3 sm:mb-4 text-blue-600 dark:text-blue-400">{service.icon}</div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 leading-tight">{service.title}</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 min-h-[40px] sm:min-h-[48px] items-end mt-auto">
                      {service.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 sm:px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium whitespace-nowrap"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-sm hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none active:scale-95 transition-all duration-300 mt-auto text-sm sm:text-base"
                    onClick={(e) => { e.preventDefault(); scrollToSection(e, '#contact'); }}
                    aria-label={`Learn more about ${service.title}`}
                  >
                    Learn More <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-6 sm:mt-8 text-center px-4">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                Need a custom solution? Let&#39;s discuss your technical challenges.
              </p>
              <Button
                variant="gradient"
                iconLeft={<Calendar size={18} className="sm:w-5 sm:h-5" />}
                className="gap-1.5 sm:gap-2 shadow-sm hover:shadow-lg transform hover:-translate-y-1 active:scale-95 transition-all duration-300 text-sm sm:text-base"
                onClick={(e) => scrollToSection(e, '#contact')}
              >
                Schedule Technical Consultation
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-8 sm:py-12 lg:py-16 bg-white dark:bg-gray-900 transition-colors duration-500" aria-labelledby="contact-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={visibleSections.has('contact') ? 'animate-fade-in' : 'opacity-0'}>
              <SectionTitle>Get In Touch</SectionTitle>
            </div>
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              <div className={`${visibleSections.has('contact') ? 'animate-slide-in-left' : 'opacity-0'}`}>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">Let's Connect</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
                  I help businesses modernize IT infrastructure, implement zero-trust security, and automate operations. I deliver solutions that are secure, efficient, and scalable. I also work closely with them to integrate AI in a way that enhances—not complicates—their workflows, turning technical challenges into competitive advantages.
                </p>
                <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Mail className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
                    <a href="mailto:gregreznik93@gmail.com" className="text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all">
                      gregreznik93@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Phone className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      (415) 309-2272
                    </span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Linkedin className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
                    <a href="https://www.linkedin.com/in/gregreznik93/" className="text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all" target="_blank" rel="noopener noreferrer">
                      linkedin.com/in/gregreznik93
                    </a>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Github className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
                    <a href="https://github.com/imfromthebay" className="text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all" target="_blank" rel="noopener noreferrer">
                      github.com/imfromthebay
                    </a>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Calendar className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
                    <a
                      href="https://calendar.app.google/bzcQZYGQtsoiTdua6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      aria-label="Book a meeting on my calendar"
                    >
                      Book a Meeting
                    </a>
                  </div>
                </div>
              </div>
              <div className={`${visibleSections.has('contact') ? 'animate-slide-in-right' : 'opacity-0'} mt-8 lg:mt-0`}>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-6 lg:p-8 transition-colors duration-500">
                  <form aria-label="Contact form" autoComplete="on"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setIsSubmitting(true);
                      
                      // Security: Check rate limiting first
                      if (!checkRateLimit()) {
                        setFormStatus('error');
                        setIsSubmitting(false);
                        alert('Too many submission attempts. Please wait a few minutes before trying again.');
                        return;
                      }
                      
                      // Clear any previous error status when starting new submission
                      if (formStatus === 'error') {
                        setFormStatus(null);
                      }
                      
                      // BULLETPROOF data capture with multiple fallback methods
                      let capturedFormData = {
                        name: formData.name,
                        email: formData.email,
                        message: formData.message
                      };
                      
                      // Fallback 1: Try FormData API from the form itself
                      try {
                        const formDataAPI = new FormData(e.target as HTMLFormElement);
                        const nameFromForm = formDataAPI.get('name') as string;
                        const emailFromForm = formDataAPI.get('email') as string;
                        const messageFromForm = formDataAPI.get('message') as string;
                        
                        if (nameFromForm && emailFromForm && messageFromForm) {
                          capturedFormData = {
                            name: nameFromForm,
                            email: emailFromForm,
                            message: messageFromForm
                          };
                          console.log('Using FormData API capture');
                        }
                      } catch (error) {
                        console.log('FormData API capture failed, using React state');
                      }
                      
                      // Fallback 2: Direct DOM element query if other methods fail
                      if (!capturedFormData.name || !capturedFormData.email || !capturedFormData.message) {
                        try {
                          const nameElement = document.getElementById('name') as HTMLInputElement;
                          const emailElement = document.getElementById('email') as HTMLInputElement;
                          const messageElement = document.getElementById('message') as HTMLTextAreaElement;
                          
                          if (nameElement?.value && emailElement?.value && messageElement?.value) {
                            capturedFormData = {
                              name: nameElement.value,
                              email: emailElement.value,
                              message: messageElement.value
                            };
                            console.log('Using DOM element capture');
                          }
                        } catch (error) {
                          console.log('DOM element capture failed');
                        }
                      }
                      
                      console.log('=== FORM SUBMISSION DEBUG ===');
                      console.log('Original formData state:', formData);
                      console.log('Final captured form data:', capturedFormData);
                      
                      // Enhanced security validation
                      if (!capturedFormData.name.trim() || !capturedFormData.email.trim() || !capturedFormData.message.trim()) {
                        console.error('Form validation failed: Missing required fields');
                        setFormStatus('error');
                        setIsSubmitting(false);
                        return;
                      }
                      
                      // Security: Validate email format
                      if (!isValidEmail(capturedFormData.email)) {
                        console.error('Form validation failed: Invalid email format');
                        setFormStatus('error');
                        setIsSubmitting(false);
                        alert('Please enter a valid email address.');
                        return;
                      }
                      
                      // Security: Check minimum length requirements
                      if (capturedFormData.name.length < 2) {
                        console.error('Form validation failed: Name too short');
                        setFormStatus('error');
                        setIsSubmitting(false);
                        alert('Name must be at least 2 characters long.');
                        return;
                      }
                      
                      if (capturedFormData.message.length < 10) {
                        console.error('Form validation failed: Message too short');
                        setFormStatus('error');
                        setIsSubmitting(false);
                        alert('Message must be at least 10 characters long.');
                        return;
                      }
                      
                      // Update rate limiting counters
                      setLastSubmissionTime(Date.now());
                      setSubmissionCount(prev => prev + 1);
                      
                      // Store the captured form data
                      setSubmissionData(capturedFormData);
                      console.log('Stored submission data:', capturedFormData);
                      console.log('Triggering hCaptcha...');
                      
                      // Trigger hCaptcha challenge popup
                      if (typeof window !== 'undefined' && (window as any).hcaptcha && hCaptchaWidgetId) {
                        try {
                          console.log('Executing hCaptcha with widget ID:', hCaptchaWidgetId);
                          (window as any).hcaptcha.execute(hCaptchaWidgetId);
                        } catch (error) {
                          console.error('Error executing hCaptcha:', error);
                          setFormStatus('error');
                          setIsSubmitting(false);
                        }
                      } else {
                        console.error('hCaptcha not available or widget not initialized');
                        console.log('hCaptcha available:', !!(window as any).hcaptcha);
                        console.log('Widget ID:', hCaptchaWidgetId);
                        setFormStatus('error');
                        setIsSubmitting(false);
                      }
                    }}
                  >
                    <div className="mb-4 sm:mb-6">
                      <label htmlFor="name" className="block text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        aria-required="true"
                        aria-label="Name"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all text-sm sm:text-base"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="mb-4 sm:mb-6">
                      <label htmlFor="email" className="block text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        aria-required="true"
                        aria-label="Email"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all text-sm sm:text-base"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="mb-4 sm:mb-6">
                      <label htmlFor="message" className="block text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        aria-required="true"
                        aria-label="Message"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all resize-none text-sm sm:text-base"
                        value={formData.message}
                        onChange={handleFormChange}
                        placeholder="Tell me about your project..."
                      ></textarea>
                    </div>
                    <input type="text" name="_gotcha" style={{ display: 'none' }} /> {/* Honeypot for spam protection */}
                    {/* hCaptcha will be triggered programmatically on form submit */}
                    <div 
                      id="hcaptcha-container"
                      className="h-captcha" 
                      data-sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                      data-theme={darkMode ? "dark" : "light"}
                      data-size="invisible"
                      style={{ display: 'none' }}
                    ></div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-sm hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transform hover:-translate-y-1 active:scale-95 transition-all duration-300 text-sm sm:text-base"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Secure Message'}
                    </button>
                    {formStatus === 'success' && (
                      <p className="mt-4 text-sm font-medium text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                        <CheckCircle size={18} /> Message sent successfully! I'll get back to you shortly.
                      </p>
                    )}
                    {formStatus === 'error' && (
                      <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                        <XCircle size={18} /> Oops! Something went wrong. Please try again later.
                      </p>
                    )}
                    <p className="mt-3 sm:mt-4 text-xs text-gray-500 dark:text-gray-500 text-center leading-relaxed">
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
          html, body { 
            transition: background-color 0.5s, color 0.5s; 
            overflow-x: hidden;
            max-width: 100vw;
          }
          * { max-width: 100%; }
        `}</style>
      </div>
    </div>
  );
};

export default PersonalWebsite;