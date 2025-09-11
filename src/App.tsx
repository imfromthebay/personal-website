import { useState, useEffect } from 'react';
import { Download, Calendar, ArrowRight, Brain } from 'lucide-react';
import SectionTitle from './components/SectionTitle';
import Button from './components/Button';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

// Constants for better maintainability
const NAVIGATION_HEIGHT = 64;
const BACK_TO_TOP_THRESHOLD = 300;
const INTERSECTION_THRESHOLD = 0.1;
const STAGGER_DELAY_MS = 100;

// Type definitions for data structures
interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  tech: string[];
}

/**
 * Main component for the personal website featuring responsive design,
 * dark mode support, smooth animations, and accessibility features.
 */
const PersonalWebsite = () => {
  // State management
  const [darkMode, setDarkMode] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set<string>());
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);




  /**
   * Natural smooth scroll with gentle easing
   */
  const smoothScrollTo = (targetPosition: number, duration: number = 1000) => {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

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
   * Toggle between light and dark mode and save preference
   */
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  /**
   * Scroll to the top of the page smoothly
   */
  const scrollToTop = () => {
    smoothScrollTo(0);
  };

  // Initialize effects
  useEffect(() => {
    // Dark mode initialization
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }

    // Inject custom animation styles
    const styleSheet = document.createElement('style');
    styleSheet.innerText = `
      @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slide-in-left { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes slide-in-right { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.4,0,0.2,1); }
      .animate-slide-in-left { animation: slide-in-left 0.8s cubic-bezier(0.4,0,0.2,1); }
      .animate-slide-in-right { animation: slide-in-right 0.8s cubic-bezier(0.4,0,0.2,1); }
      .animate-scale-in { animation: scale-in 0.8s cubic-bezier(0.4,0,0.2,1); }
      .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.4,0,0.2,1); }
      .bg-grid-pattern {
        background-image: linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
      }
      html { scroll-behavior: auto; }
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

    return () => {
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  // Scroll and intersection effects
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setShowBackToTop(currentScrollY > BACK_TO_TOP_THRESHOLD);
    };

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

    window.addEventListener('scroll', handleScroll);
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Dark mode effect
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

  // Auto-rotate through skills every 2.5 seconds
  useEffect(() => {
    if (visibleSections.has('about')) {
      const interval = setInterval(() => {
        setCurrentSkillIndex((prev) => (prev + 1) % skills.length);
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [visibleSections, skills.length]);

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
      icon: <Download className="w-8 h-8" />,
      tech: ['Jira', 'Slack', 'Linear', 'ClickUp', 'Asana', 'Notion']
    },
    {
      title: 'Enterprise SaaS Management',
      description: 'I implement and oversee 100+ SaaS integrations (Okta, Slack, Jira, Confluence, etc.). I automate user lifecycle management (onboarding/offboarding), access reviews, and RBAC. I streamline SaaS procurement, SSO, and security policy enforcement for secure and efficient operations.',
      icon: <Calendar className="w-8 h-8" />,
      tech: ['Okta', 'Slack', 'Jira', 'Confluence']
    },
    {
      title: 'Flowgramming & Integration',
      description: 'As an expert in complex workflow and no-code automation, I design and implement robust solutions. I connect enterprise systems through API integrations and create scalable workflow designs.',
      icon: <ArrowRight className="w-8 h-8" />,
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
   * Generate staggered animation delay for list items
   */
  const getStaggerDelay = (index: number) => ({
    animationDelay: `${index * STAGGER_DELAY_MS}ms`
  });

  return (
    <div className={`min-h-screen overflow-x-hidden ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-500 overflow-x-hidden">
        <Navigation
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          scrollToSection={scrollToSection}
        />

        <HeroSection
          visibleSections={visibleSections}
          scrollToSection={scrollToSection}
          scrollY={scrollY}
        />

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
                        <Download className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
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

        <ContactSection visibleSections={visibleSections} />

        <Footer />

        <BackToTop showBackToTop={showBackToTop} scrollToTop={scrollToTop} />

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