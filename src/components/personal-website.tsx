import React, { useState, useEffect } from 'react';
import { ChevronDown, Download, Mail, Github, Linkedin, Twitter, Menu, X, Calendar, Clock, ArrowRight, ExternalLink, Shield, Code, Server, Database, Moon, Sun, Terminal, Cpu, GitBranch, Lock, Zap } from 'lucide-react';

const PersonalWebsite = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());

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
      .animate-fade-in { animation: fade-in 0.8s ease-out; }
      .animate-slide-in-left { animation: slide-in-left 0.8s ease-out; }
      .animate-slide-in-right { animation: slide-in-right 0.8s ease-out; }
      .animate-scale-in { animation: scale-in 0.8s ease-out; }
      .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
      .bg-grid-pattern {
        background-image: 
          linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setScrollY(window.scrollY);
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
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Resume', href: '#resume' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' }
  ];

  const services = [
    {
      title: 'Cloud Architecture & DevOps',
      description: 'Designing scalable cloud infrastructures with AWS, Azure, and GCP. Implementing CI/CD pipelines and infrastructure as code.',
      icon: <Server className="w-8 h-8" />,
      tech: ['AWS', 'Kubernetes', 'Terraform', 'Docker']
    },
    {
      title: 'Security Consulting',
      description: 'Comprehensive security audits, penetration testing, and implementation of zero-trust architectures.',
      icon: <Shield className="w-8 h-8" />,
      tech: ['OWASP', 'ISO 27001', 'SOC 2', 'PCI DSS']
    },
    {
      title: 'System Architecture',
      description: 'Designing distributed systems, microservices architectures, and high-performance computing solutions.',
      icon: <Cpu className="w-8 h-8" />,
      tech: ['Microservices', 'Event-Driven', 'CQRS', 'DDD']
    }
  ];

  const portfolio = [
    {
      title: 'Enterprise Kubernetes Platform',
      description: 'Built a multi-tenant Kubernetes platform handling 10K+ deployments daily with 99.99% uptime',
      tech: ['Kubernetes', 'Istio', 'Prometheus', 'GitOps'],
      metrics: '10K+ deployments/day',
      image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=300&fit=crop'
    },
    {
      title: 'Real-time Data Pipeline',
      description: 'Architected a streaming data pipeline processing 100M+ events per hour with sub-second latency',
      tech: ['Kafka', 'Spark', 'Cassandra', 'Python'],
      metrics: '100M+ events/hour',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop'
    },
    {
      title: 'Zero-Trust Security Framework',
      description: 'Implemented enterprise-wide zero-trust architecture reducing security incidents by 85%',
      tech: ['OAuth2', 'mTLS', 'SIEM', 'WAF'],
      metrics: '85% incident reduction',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop'
    }
  ];

  const blogPosts = [
    {
      title: 'Implementing Zero-Downtime Deployments in Kubernetes',
      excerpt: 'A comprehensive guide to rolling updates, blue-green deployments, and canary releases in production Kubernetes clusters.',
      date: '2024-03-15',
      readTime: '12 min read',
      category: 'DevOps',
      tags: ['Kubernetes', 'CI/CD', 'High Availability']
    },
    {
      title: 'Building Secure APIs: Beyond OWASP Top 10',
      excerpt: 'Advanced security patterns for API development including rate limiting, API gateways, and threat modeling.',
      date: '2024-02-28',
      readTime: '15 min read',
      category: 'Security',
      tags: ['API Security', 'OWASP', 'Authentication']
    },
    {
      title: 'Optimizing Database Performance at Scale',
      excerpt: 'Techniques for query optimization, indexing strategies, and database sharding for high-traffic applications.',
      date: '2024-01-20',
      readTime: '18 min read',
      category: 'Database',
      tags: ['PostgreSQL', 'Performance', 'Scaling']
    }
  ];

  const skills = [
    { name: 'Cloud Architecture (AWS/Azure/GCP)', level: 95 },
    { name: 'Kubernetes & Container Orchestration', level: 92 },
    { name: 'Python/Go/Java', level: 90 },
    { name: 'Security & Compliance', level: 88 },
    { name: 'System Design & Architecture', level: 94 },
    { name: 'DevOps & CI/CD', level: 91 }
  ];

  const certifications = [
    'AWS Solutions Architect Professional',
    'Certified Kubernetes Administrator (CKA)',
    'CISSP - Certified Information Systems Security Professional',
    'Google Cloud Professional Cloud Architect'
  ];

  const handleSubmit = () => {
    // Input validation
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Sanitize inputs (basic XSS prevention)
    const sanitizedData = {
      name: formData.name.replace(/[<>]/g, ''),
      email: formData.email.replace(/[<>]/g, ''),
      message: formData.message.replace(/[<>]/g, '')
    };
    
    console.log('Form submitted:', sanitizedData);
    alert('Thank you for your message! I\'ll respond within 24 hours.');
    setFormData({ name: '', email: '', message: '' });
  };

  // Parallax effect for hero section
  const heroParallax = {
    transform: `translateY(${scrollY * 0.5}px)`
  };

  // Staggered animation helper
  const getStaggerDelay = (index) => ({
    animationDelay: `${index * 100}ms`
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md' 
            : 'bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Terminal className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  John Doe
                </span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                    onClick={() => setActiveSection(item.name.toLowerCase())}
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
                    onClick={() => {
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
          <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto ${visibleSections.has('home') ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="mb-6 flex justify-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                <Code className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Senior IT Consultant
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
              Cloud Architecture • DevOps • Security Engineering
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Building secure, scalable infrastructure solutions for Fortune 500 companies. 
              Specializing in cloud-native architectures and enterprise security.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#contact"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                <Shield size={20} />
                Schedule Consultation
              </a>
              <a
                href="#portfolio"
                className="px-8 py-3 border-2 border-gray-800 dark:border-gray-300 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900 transition-all duration-300 flex items-center gap-2"
              >
                <GitBranch size={20} />
                View Projects
              </a>
            </div>
            <div className="mt-12 flex justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-500" />
                <span>99.99% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" />
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-500" />
                <span>10B+ Transactions</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown size={32} className="text-gray-400 dark:text-gray-600" />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent ${
              visibleSections.has('about') ? 'animate-fade-in' : 'opacity-0'
            }`}>
              Technical Expertise
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className={`${visibleSections.has('about') ? 'animate-slide-in-left' : 'opacity-0'}`}>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=400&fit=crop"
                    alt="Professional headshot"
                    className="rounded-2xl shadow-xl"
                  />
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl -z-10"></div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {certifications.map((cert, index) => (
                    <div 
                      key={cert} 
                      className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-md text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                      style={getStaggerDelay(index)}
                    >
                      <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
              <div className={`${visibleSections.has('about') ? 'animate-slide-in-right' : 'opacity-0'}`}>
                <h3 className="text-2xl font-semibold mb-4">Engineering Excellence at Scale</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  With over 15 years in enterprise IT, I've architected solutions that power 
                  mission-critical systems for global organizations. My approach combines 
                  deep technical expertise with strategic business thinking.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  I specialize in transforming complex technical challenges into elegant, 
                  maintainable solutions that scale. From migrating legacy systems to 
                  cloud-native architectures to implementing zero-trust security frameworks, 
                  I deliver results that exceed expectations.
                </p>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={skill.name} style={getStaggerDelay(index)}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
                        <span className="text-gray-600 dark:text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
        <section id="resume" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent ${
              visibleSections.has('resume') ? 'animate-fade-in' : 'opacity-0'
            }`}>
              Professional Experience
            </h2>
            <div className={`bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 ${
              visibleSections.has('resume') ? 'animate-scale-in' : 'opacity-0'
            }`}>
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-6">Experience</h3>
                <div className="space-y-8">
                  <div className="border-l-4 border-blue-600 dark:border-blue-400 pl-6">
                    <h4 className="text-xl font-semibold">Principal Cloud Architect</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">TechCorp Global • 2020 - Present</p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                      <li>Led cloud transformation reducing infrastructure costs by $2.5M annually</li>
                      <li>Architected multi-region Kubernetes platform serving 50M+ daily users</li>
                      <li>Implemented zero-trust security model across 200+ microservices</li>
                      <li>Mentored team of 25 engineers on cloud-native best practices</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-purple-600 dark:border-purple-400 pl-6">
                    <h4 className="text-xl font-semibold">Senior DevOps Engineer</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Innovation Systems • 2017 - 2020</p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                      <li>Built CI/CD pipelines reducing deployment time from hours to minutes</li>
                      <li>Achieved 99.99% uptime for critical production services</li>
                      <li>Designed disaster recovery strategy with RTO &lt; 15 minutes</li>
                      <li>Automated infrastructure provisioning with Terraform and Ansible</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-green-600 dark:border-green-400 pl-6">
                    <h4 className="text-xl font-semibold">Security Engineer</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">CyberDefense Inc • 2014 - 2017</p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                      <li>Conducted security audits for Fortune 500 companies</li>
                      <li>Implemented SIEM solutions detecting 95% of security incidents</li>
                      <li>Developed secure coding standards adopted company-wide</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-6">Education</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-indigo-600 dark:border-indigo-400 pl-6">
                    <h4 className="text-xl font-semibold">Master of Science in Computer Science</h4>
                    <p className="text-gray-600 dark:text-gray-400">MIT • 2012 - 2014</p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Specialization: Distributed Systems & Cybersecurity</p>
                  </div>
                  <div className="border-l-4 border-indigo-600 dark:border-indigo-400 pl-6">
                    <h4 className="text-xl font-semibold">Bachelor of Science in Computer Engineering</h4>
                    <p className="text-gray-600 dark:text-gray-400">Stanford University • 2008 - 2012</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                  <Download size={20} />
                  Download Full Resume (PDF)
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent ${
              visibleSections.has('services') ? 'animate-fade-in' : 'opacity-0'
            }`}>
              Consulting Services
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-900 rounded-2xl p-8 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ${
                    visibleSections.has('services') ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={getStaggerDelay(index)}
                >
                  <div className="text-blue-600 dark:text-blue-400 mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{service.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href="#contact"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Learn More <ArrowRight size={16} className="ml-2" />
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Need a custom solution? Let's discuss your technical challenges.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                <Calendar size={20} />
                Schedule Technical Consultation
              </a>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent ${
              visibleSections.has('portfolio') ? 'animate-fade-in' : 'opacity-0'
            }`}>
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {portfolio.map((project, index) => (
                <div
                  key={index}
                  className={`bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ${
                    visibleSections.has('portfolio') ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={getStaggerDelay(index)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {project.metrics}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a
                      href="#"
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      View Case Study <ExternalLink size={16} className="ml-2" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent ${
              visibleSections.has('blog') ? 'animate-fade-in' : 'opacity-0'
            }`}>
              Technical Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <article
                  key={index}
                  className={`bg-white dark:bg-gray-900 rounded-2xl p-6 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ${
                    visibleSections.has('blog') ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={getStaggerDelay(index)}
                >
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-gray-500 dark:text-gray-500"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {post.readTime}
                      </span>
                    </div>
                    <a
                      href="#"
                      className="text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      Read More →
                    </a>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-12 text-center">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-800 dark:border-gray-300 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900 transition-all duration-300"
              >
                <Terminal size={20} />
                View All Articles
              </a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent ${
              visibleSections.has('contact') ? 'animate-fade-in' : 'opacity-0'
            }`}>
              Get In Touch
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className={`${visibleSections.has('contact') ? 'animate-slide-in-left' : 'opacity-0'}`}>
                <h3 className="text-2xl font-semibold mb-6">Let's Build Something Great</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Whether you're looking to modernize your infrastructure, implement 
                  DevOps best practices, or strengthen your security posture, I'm here 
                  to help transform your technical challenges into competitive advantages.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Mail className="text-blue-600 dark:text-blue-400" size={24} />
                    <a href="mailto:john.doe@example.com" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      john.doe@example.com
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Shield className="text-blue-600 dark:text-blue-400" size={24} />
                    <span className="text-gray-700 dark:text-gray-300">
                      PGP Key: 0x1234567890ABCDEF
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Github className="text-blue-600 dark:text-blue-400" size={24} />
                    <a href="https://github.com" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      github.com/johndoe
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Linkedin className="text-blue-600 dark:text-blue-400" size={24} />
                    <a href="https://linkedin.com" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      linkedin.com/in/johndoe
                    </a>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Security Note:</strong> All communications are encrypted. 
                    For sensitive discussions, please use my PGP key.
                  </p>
                </div>
              </div>
              <div className={`${visibleSections.has('contact') ? 'animate-slide-in-right' : 'opacity-0'}`}>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your project..."
                    ></textarea>
                  </div>
                  <button
                    onClick={handleSubmit}
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
        <footer className="bg-gray-900 dark:bg-black text-gray-300 py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#about" className="hover:text-blue-400 transition-colors">About</a></li>
                  <li><a href="#services" className="hover:text-blue-400 transition-colors">Services</a></li>
                  <li><a href="#portfolio" className="hover:text-blue-400 transition-colors">Portfolio</a></li>
                  <li><a href="#blog" className="hover:text-blue-400 transition-colors">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Technical Stack</h4>
                <ul className="space-y-2">
                  <li>AWS, Azure, GCP</li>
                  <li>Kubernetes, Docker</li>
                  <li>Terraform, Ansible</li>
                  <li>Python, Go, Java</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Security & Compliance</h4>
                <ul className="space-y-2">
                  <li>SOC 2 Type II</li>
                  <li>ISO 27001</li>
                  <li>GDPR Compliant</li>
                  <li>HIPAA Compliant</li>
                </ul>
              </div>
            </div>
            <div className="text-center pt-8 border-t border-gray-800">
              <p className="mb-4">
                © 2024 John Doe. All rights reserved. | Built with React & Tailwind CSS
              </p>
              <div className="flex justify-center space-x-6">
                <a href="https://github.com" className="hover:text-blue-400 transition-colors">
                  <Github size={20} />
                </a>
                <a href="https://linkedin.com" className="hover:text-blue-400 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="https://twitter.com" className="hover:text-blue-400 transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PersonalWebsite;