'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, User, Award, Briefcase, LayoutDashboard, MessageSquare, Mail, Sparkles } from 'lucide-react';
import { Github, Linkedin } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/archive/v1', icon: Home },
  { name: 'About', href: '/archive/v1/about', icon: User },
  { name: 'Achievements', href: '/archive/v1/achievements', icon: Award },
  { name: 'Projects', href: '/archive/v1/projects', icon: Briefcase },
  { name: 'Dashboard', href: '/archive/v1/dashboard', icon: LayoutDashboard },
  { name: 'Contact', href: '/archive/v1/contact', icon: Mail },
];

export default function MobileMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[100] bg-primary-950/95 backdrop-blur-sm border-b border-primary-800 shadow-md">
        <div className="flex items-center justify-between px-4 h-16">
          <Link href="/archive/v1" className="text-3xl font-handwriting text-white">
            Razeen Iqbal
          </Link>

          <div className="flex items-center gap-3">
            {/* Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-900 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="lg:hidden fixed left-0 top-16 bottom-0 w-80 max-w-[85vw] z-40 bg-primary-50 dark:bg-primary-950 border-r border-primary-200 dark:border-primary-800 overflow-y-auto"
          >
            <div className="p-6">
              {/* Profile Section */}
              <div className="mb-8">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto shadow-lg p-1">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
                      <Image
                        src="/profile.jpg"
                        alt="Razeen Iqbal"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        priority
                        quality={85}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-3xl font-handwriting text-gray-900 dark:text-white mb-1 transition-colors duration-300">
                    Razeen Iqbal
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Data Engineer & AI Specialist</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1 mb-6">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-200 dark:bg-primary-800 text-gray-900 dark:text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}

                {/* Come Talk to My AI Bot */}
                <Link
                  href="/archive/v1/smart-talk"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white transition-all duration-200 mt-4"
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">Talk to My AI Bot</span>
                </Link>
              </nav>

              {/* Social Links */}
              <div className="pt-6 border-t border-primary-200 dark:border-primary-800">
                <div className="flex items-center justify-center gap-3">
                  <a
                    href="https://github.com/razeeniqbal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-primary-200 dark:bg-primary-800 hover:bg-primary-300 dark:hover:bg-primary-700 rounded-lg transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5 text-gray-900 dark:text-gray-300" />
                  </a>
                  <a
                    href="https://linkedin.com/in/razeeniqbal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-primary-200 dark:bg-primary-800 hover:bg-primary-300 dark:hover:bg-primary-700 rounded-lg transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 text-gray-900 dark:text-gray-300" />
                  </a>
                  <a
                    href="mailto:razeeniqbal98@gmail.com"
                    className="p-2 bg-primary-200 dark:bg-primary-800 hover:bg-primary-300 dark:hover:bg-primary-700 rounded-lg transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="w-5 h-5 text-gray-900 dark:text-gray-300" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
