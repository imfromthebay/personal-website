import { useState, useEffect } from 'react';
import { ChevronDown, Download, Mail, Github, Linkedin, Menu, X, Calendar, ArrowRight, Shield, Code, Server, Database, Moon, Sun, Terminal, GitBranch, Lock, Zap, Phone } from 'lucide-react';
import SectionTitle from './components/SectionTitle';
import Card from './components/Card';
import Button from './components/Button';

const PersonalWebsite = () => {
  const [, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Smooth scroll to section
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.querySelector(sectionId);
    if (element) {
      const navHeight = 64; // Height of the fixed navigation
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Initialize dark mode and styles
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);

    // Inject animation styles
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
      /* Smooth scrolling for all browsers */
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
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setScrollY(window.scrollY);
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode class to root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#111827'; // gray-900
      document.body.style.backgroundColor = '#111827'; // gray-900
      document.documentElement.style.transition = 'background-color 0.5s, color 0.5s';
      document.body.style.transition = 'background-color 0.5s, color 0.5s';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#ffffff';
      document.body.style.backgroundColor = '#ffffff';
      document.documentElement.style.transition = 'background-color 0.5s, color 0.5s';
      document.body.style.transition = 'background-color 0.5s, color 0.5s';
    }
  }, [darkMode]);

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Resume', href: '#resume' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' }
  ];

  const services = [
    {
      title: 'IT Service Desk Deployment & Automation',
      description: 'Architected and deployed modern IT service desks from scratch, leveraging modern platforms to deliver automated, scalable, and user-friendly support experiences. Automated ticketing, approvals, and employee lifecycle processes for rapid, secure, and efficient IT operations.',
      icon: <Zap className="w-8 h-8" />,
      tech: ['Jira', 'Slack', 'Linear', 'ClickUp', 'Asana', 'Notion']
    },
    {
      title: 'Flowgramming & Integration',
      description: 'Expert in designing and implementing complex workflow automations and no-code automation solutions using modern platforms. Specializing in connecting enterprise systems through API integrations, seamless automation between tools, and scalable workflow design.',
      icon: <GitBranch className="w-8 h-8" />,
      tech: ['API Integration', 'Workflow Design', 'Zapier', 'Okta Workflows']
    },
    {
      title: 'Enterprise SaaS Management',
      description: 'Implemented and managed 100+ SaaS integrations (Okta, Slack, Jira, Confluence, etc.). Automated user onboarding/offboarding, access reviews, and RBAC. Streamlined SaaS procurement, SSO, and security policy enforcement for efficient, secure operations.',
      icon: <Server className="w-8 h-8" />,
      tech: ['Okta', 'Slack', 'Jira', 'Confluence']
    }
  ];

  const skills = [
    { name: 'Enterprise SaaS', level: 88 },
    { name: 'Enterprise Security', level: 91 },
    { name: 'Flowgramming', level: 90 },
    { name: 'IDP Integration', level: 92 },
    { name: 'MDM Deployment', level: 94 },
    { name: 'Workflow Automation', level: 95 }
  ];

  const certifications = [
    'MDM Deployment',
    'IDP Architecture/Implementation',
    'Enterprise Security Hardening',
    'IT Leadership & Mentoring'
  ];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Parallax effect for hero section
  const heroParallax = {
    transform: `translateY(${scrollY * 0.5}px)`
  };

  // Staggered animation helper
  const getStaggerDelay = (index: number) => ({
    animationDelay: `${index * 100}ms`
  });

  // Scroll to top function
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
                <Terminal className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Gregory Reznik
                </span>
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
                      setActiveSection(item.name.toLowerCase());
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
            <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    onClick={(e) => {
                      scrollToSection(e, item.href);
                      setActiveSection(item.name.toLowerCase());
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
            className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
            style={heroParallax}
          ></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <main id="main-content" tabIndex={-1} className={`relative z-10 text-center px-4 max-w-4xl mx-auto ${visibleSections.has('home') ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="mb-6 flex justify-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                <Code className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-none overflow-visible break-keep bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Senior IT Systems Engineer
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
              IT Automation • MDM • IDP • Flowgramming
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Building powerful no-code automation solutions, seamless MDM and IDP integrations, and enterprise system connectivity. Specializing in workflow design and API integration through modern automation platforms.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#contact"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                onClick={(e) => scrollToSection(e, '#contact')}
              >
                <Shield size={20} />
                Schedule Consultation
              </a>
              <a
                href="#resume"
                className="px-8 py-3 border-2 border-gray-800 dark:border-gray-300 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900 transition-all duration-300 flex items-center gap-2"
                onClick={(e) => scrollToSection(e, '#resume')}
              >
                <GitBranch size={20} />
                View Experience
              </a>
            </div>
            <div className="mt-12 flex justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
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
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <a 
              href="#about" 
              onClick={(e) => scrollToSection(e, '#about')}
              className="block cursor-pointer"
              aria-label="Scroll to About section"
            >
              <ChevronDown size={32} className="text-gray-400 dark:text-gray-600" />
            </a>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 sm:py-20 bg-white dark:bg-gray-800 transition-colors duration-500" aria-labelledby="about-title">
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
                      className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 flex items-center gap-2 min-h-[56px]"
                      style={getStaggerDelay(index)}
                      aria-label={cert}
                    >
                      <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`${visibleSections.has('about') ? 'animate-slide-in-right' : 'opacity-0'}`}>
                <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">IT Excellence at Scale</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  With extensive experience in enterprise IT, I&#39;ve architected and implemented solutions that power 
                  mission-critical systems for leading organizations. My approach combines deep technical expertise 
                  with strategic business thinking.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  I specialize in transforming complex technical challenges into elegant, automated solutions that scale. 
                  From implementing zero-trust security frameworks to building comprehensive device management systems, 
                  I deliver results that exceed expectations.
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
        <section id="resume" className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500" aria-labelledby="resume-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={visibleSections.has('resume') ? 'animate-fade-in' : 'opacity-0'}>
              <SectionTitle>Professional Experience</SectionTitle>
            </div>
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 md:p-12 transition-colors duration-500 space-y-10 ${
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
                    <p className="text-gray-600 dark:text-gray-400 mb-2">SigFig • May 2017 - Dec 2018 • San Francisco Bay Area</p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                      <li>Resolved 43%+ of IT support requests without escalation</li>
                      <li>Led conference room upgrades and office buildouts</li>
                      <li>Managed onboarding, JAMF, and SSO integrations</li>
                      <li>Standardized hardware and optimized procurement</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-pink-600 dark:border-pink-400 pl-6">
                    <h4 className="text-xl font-semibold">IT Intern</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Synack, Inc. • May 2016 - Oct 2016 • Redwood City, CA</p>
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
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
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
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {services.map((service, index) => (
                <div key={index} style={getStaggerDelay(index)} className={`h-full ${visibleSections.has('services') ? 'animate-fade-in-up' : 'opacity-0'}`}>
                  <Card
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    tech={service.tech}
                  >
                    <Button
                      variant="gradient"
                      iconRight={<ArrowRight size={16} className="ml-2" />}
                      className="w-full justify-center mt-auto"
                      onClick={(e) => { e.preventDefault(); scrollToSection(e, '#contact'); }}
                      aria-label={`Learn more about ${service.title}`}
                    >
                      Learn More
                    </Button>
                  </Card>
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
                className="gap-2"
                onClick={(e) => scrollToSection(e, '#contact')}
              >
                Schedule Technical Consultation
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-500" aria-labelledby="contact-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={visibleSections.has('contact') ? 'animate-fade-in' : 'opacity-0'}>
              <SectionTitle>Get In Touch</SectionTitle>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`${visibleSections.has('contact') ? 'animate-slide-in-left' : 'opacity-0'}`}>
                <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Let&#39;s Connect</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Whether you&#39;re looking to modernize your IT infrastructure, implement 
                  zero-trust security, or automate your IT operations, I&#39;m here to help 
                  transform your technical challenges into competitive advantages.
                </p>
                <div className="space-y-4">
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
                </div>
              </div>
              <div className={`${visibleSections.has('contact') ? 'animate-slide-in-right' : 'opacity-0'}`}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 transition-colors duration-500">
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all resize-none"
                      value={formData.message}
                      onChange={handleFormChange}
                      placeholder="Tell me about your project..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Send Secure Message
                  </button>
                  <p className="mt-4 text-xs text-gray-500 dark:text-gray-500 text-center">
                    Your information is encrypted and will never be shared.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-black text-gray-700 dark:text-gray-300 py-8 sm:py-12 border-t border-gray-200 dark:border-gray-800 transition-colors duration-500" role="contentinfo">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#home" className="hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 rounded" onClick={(e) => scrollToSection(e, '#home')}>Home</a></li>
                  <li><a href="#resume" className="hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 rounded" onClick={(e) => scrollToSection(e, '#resume')}>Resume</a></li>
                  <li><a href="#services" className="hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 rounded" onClick={(e) => scrollToSection(e, '#services')}>Services</a></li>
                  <li><a href="#contact" className="hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 rounded" onClick={(e) => scrollToSection(e, '#contact')}>Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Technical Stack</h4>
                <div className="grid grid-cols-2 gap-x-0 gap-y-1 text-base text-gray-700 dark:text-gray-300">
                  <span>Crowdstrike</span>
                  <span>Intune</span>
                  <span>Jamf</span>
                  <span>Jira</span>
                  <span>Okta</span>
                  <span>SentinelOne</span>
                  <span>Slack</span>
                  <span>Zapier</span>
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Expertise</h4>
                <ul className="space-y-2">
                  <li>Workflow Automation</li>
                  <li>MDM Deployment</li>
                  <li>Enterprise Security</li>
                  <li>Enterprise SaaS</li>
                </ul>
              </div>
            </div>
            <div className="text-center pt-8 border-t border-gray-800">
              <p className="mb-4">
                &copy; 2025 Greg Reznik. All rights reserved. | Built with React &amp; Tailwind CSS
              </p>
              <div className="flex justify-center space-x-6">
                <a href="https://github.com/imfromthebay" className="hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 rounded" target="_blank" rel="noopener noreferrer">
                  <Github size={20} />
                </a>
                <a href="https://www.linkedin.com/in/gregreznik93/" className="hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 rounded" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={20} />
                </a>
                <a href="mailto:gregreznik93@gmail.com" className="hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 rounded">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-white rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${
            showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
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