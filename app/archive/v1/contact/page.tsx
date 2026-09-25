'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlowCard } from '@/components/v1/ui';
import { personalInfo } from '@/lib/data';
import { Mail, Github, Linkedin, MapPin, Phone, Send, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate sending
    setTimeout(() => {
      setStatus('sent');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
      color: 'blue' as const,
    },
    {
      icon: Github,
      label: 'GitHub',
      value: '@razeeniqbal',
      href: personalInfo.github,
      color: 'purple' as const,
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: '@razeeniqbal',
      href: personalInfo.linkedin,
      color: 'blue' as const,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: personalInfo.phone,
      color: 'green' as const,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: personalInfo.location,
      color: 'orange' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-950">
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gray-900 dark:bg-gray-100 p-2 rounded">
              <MessageSquare className="w-6 h-6 text-white dark:text-gray-900" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Let's connect and build something amazing together
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8 md:items-stretch">
          {/* Contact Form */}
          <GlowCard
            customSize
            glowColor="blue"
            className="w-full h-full bg-white dark:bg-gray-900/80 flex flex-col"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Send a Message
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Fill out the form below and I'll get back to you as soon as possible
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                    placeholder="Name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                    placeholder="Email"
                  />
                </div>

                {/* Message Field */}
                <div className="flex-1 flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white resize-none min-h-[250px]"
                    placeholder="Your message here..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'sending' && (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  )}
                  {status === 'sent' && (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Message Sent!
                    </>
                  )}
                  {status === 'idle' && (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                  {status === 'error' && (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      Try Again
                    </>
                  )}
                </button>

                {status === 'sent' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
                  >
                    <p className="text-sm text-green-800 dark:text-green-200 text-center">
                      Thanks for reaching out! I'll respond as soon as possible.
                    </p>
                  </motion.div>
                )}
              </form>
          </GlowCard>

          {/* Contact Info and Status Combined */}
          <div className="flex flex-col gap-4">
            <GlowCard
              customSize
              glowColor="purple"
              className="w-full h-auto bg-white dark:bg-gray-900/80 flex-1"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Other Ways to Reach Me
              </h2>

              <div className="space-y-3">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={method.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {method.href ? (
                      <a
                        href={method.href}
                        target={method.href.startsWith('http') ? '_blank' : undefined}
                        rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                      >
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
                          <method.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {method.label}
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {method.value}
                          </p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-lg">
                          <method.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {method.label}
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {method.value}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </GlowCard>

            {/* Status Card */}
            <GlowCard
              customSize
              glowColor="green"
              className="w-full h-auto bg-gradient-to-br from-green-500 to-emerald-600"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-white/80">Status</p>
                  <p className="text-base font-bold text-white">{personalInfo.status}</p>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>

        {/* Demo Note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlowCard
            customSize
            glowColor="orange"
            className="w-full h-auto bg-amber-50 dark:bg-amber-900/20"
          >
            <div className="flex items-start gap-3">
              <div className="bg-amber-500 p-2 rounded-lg flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Demo Mode
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Form submissions are currently in demo mode for testing purposes.
                </p>
              </div>
            </div>
          </GlowCard>
        </motion.div>

        {/* Location Section */}
        <GlowCard
          customSize
          glowColor="blue"
          className="w-full h-auto bg-white dark:bg-gray-900/80"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Based in {personalInfo.location}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Working remotely and locally. Open to collaborations, freelance projects, and full-time opportunities in data engineering and AI.
            </p>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
