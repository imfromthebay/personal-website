import React, { useState, useEffect } from 'react';
import { Mail, Phone, Linkedin, Github, Calendar, CheckCircle, XCircle } from 'lucide-react';
import SectionTitle from './SectionTitle';

interface ContactSectionProps {
  visibleSections: Set<string>;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ visibleSections }) => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hCaptchaWidgetId, setHCaptchaWidgetId] = useState<string | null>(null);
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number>(0);
  const [submissionCount, setSubmissionCount] = useState<number>(0);

  const sanitizeInput = (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .substring(0, 5000);
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
  };

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (now - lastSubmissionTime > fiveMinutes) {
      setSubmissionCount(0);
    }

    if (submissionCount >= 3) {
      const timeLeft = Math.ceil((fiveMinutes - (now - lastSubmissionTime)) / 1000 / 60);
      console.warn(`Rate limit exceeded. Please wait ${timeLeft} minutes before submitting again.`);
      return false;
    }

    return true;
  };

  const submitFormDirectly = async (token: string, submissionData: FormData) => {
    try {
      console.log('=== DIRECT SUBMISSION FUNCTION DEBUG ===');
      console.log('hCaptcha token received:', token ? 'YES - ' + token.substring(0, 20) + '...' : 'NO');
      console.log('Direct submission data:', submissionData);

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

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Success response:', responseData);
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
        const storedDataElement = document.getElementById('stored-submission-data');
        if (storedDataElement) {
          storedDataElement.textContent = '';
        }
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setFormData({ ...formData, [name]: sanitizedValue });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!checkRateLimit()) {
      setFormStatus('error');
      setIsSubmitting(false);
      alert('Too many submission attempts. Please wait a few minutes before trying again.');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus('error');
      setIsSubmitting(false);
      return;
    }

    if (!isValidEmail(formData.email)) {
      setFormStatus('error');
      setIsSubmitting(false);
      alert('Please enter a valid email address.');
      return;
    }

    if (formData.name.length < 2) {
      setFormStatus('error');
      setIsSubmitting(false);
      alert('Name must be at least 2 characters long.');
      return;
    }

    if (formData.message.length < 10) {
      setFormStatus('error');
      setIsSubmitting(false);
      alert('Message must be at least 10 characters long.');
      return;
    }

    setLastSubmissionTime(Date.now());
    setSubmissionCount(prev => prev + 1);

    const storedDataElement = document.getElementById('stored-submission-data');
    if (!storedDataElement) {
      const element = document.createElement('div');
      element.id = 'stored-submission-data';
      element.style.display = 'none';
      document.body.appendChild(element);
    }

    if (typeof window !== 'undefined' && (window as any).hcaptcha && hCaptchaWidgetId) {
      try {
        (window as any).hcaptcha.execute(hCaptchaWidgetId);
      } catch (error) {
        console.error('Error executing hCaptcha:', error);
        setFormStatus('error');
        setIsSubmitting(false);
      }
    } else {
      console.error('hCaptcha not available');
      setFormStatus('error');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const initializeHCaptcha = () => {
      if (typeof window !== 'undefined' && (window as any).hcaptcha) {
        const captchaElement = document.getElementById('hcaptcha-container');
        if (captchaElement) {
          captchaElement.innerHTML = '';

          const sitekey = captchaElement.getAttribute('data-sitekey');
          const size = captchaElement.getAttribute('data-size') || 'invisible';

          if (sitekey) {
            try {
              const widgetId = (window as any).hcaptcha.render(captchaElement, {
                sitekey: sitekey,
                size: size,
                theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
                callback: (token: string) => {
                  const storedDataElement = document.getElementById('stored-submission-data');
                  let currentSubmissionData = null;

                  if (storedDataElement && storedDataElement.textContent) {
                    try {
                      currentSubmissionData = JSON.parse(storedDataElement.textContent);
                    } catch (e) {
                      console.error('Failed to parse stored submission data');
                    }
                  }

                  if (!currentSubmissionData) {
                    const nameEl = document.getElementById('name') as HTMLInputElement;
                    const emailEl = document.getElementById('email') as HTMLInputElement;
                    const messageEl = document.getElementById('message') as HTMLTextAreaElement;

                    if (nameEl?.value && emailEl?.value && messageEl?.value) {
                      currentSubmissionData = {
                        name: nameEl.value,
                        email: emailEl.value,
                        message: messageEl.value
                      };
                    }
                  }

                  if (currentSubmissionData) {
                    submitFormDirectly(token, currentSubmissionData);
                  } else {
                    console.error('No submission data available in callback');
                    setIsSubmitting(false);
                    setFormStatus('error');
                  }
                },
                'error-callback': () => {
                  console.error('hCaptcha error occurred');
                  setIsSubmitting(false);
                  setFormStatus('error');
                }
              });
              setHCaptchaWidgetId(widgetId);
            } catch (error) {
              console.error('Error initializing hCaptcha:', error);
            }
          }
        }
      } else {
        setTimeout(initializeHCaptcha, 500);
      }
    };

    setTimeout(initializeHCaptcha, 100);
  }, []);

  return (
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
              <form aria-label="Contact form" autoComplete="on" onSubmit={handleSubmit}>
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
                <input type="text" name="_gotcha" style={{ display: 'none' }} />
                <div
                  id="hcaptcha-container"
                  className="h-captcha"
                  data-sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                  data-theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
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
  );
};

export default ContactSection;
