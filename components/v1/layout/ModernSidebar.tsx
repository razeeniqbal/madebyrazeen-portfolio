'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, User, Award, Briefcase, LayoutDashboard, MessageSquare, Mail, Sparkles } from 'lucide-react';
import { Github, Linkedin } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/archive/v1', icon: Home },
  { name: 'About', href: '/archive/v1/about', icon: User },
  { name: 'Achievements', href: '/archive/v1/achievements', icon: Award },
  { name: 'Projects', href: '/archive/v1/projects', icon: Briefcase },
  { name: 'Dashboard', href: '/archive/v1/dashboard', icon: LayoutDashboard },
  { name: 'Contact', href: '/archive/v1/contact', icon: Mail },
];

export default function ModernSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 text-gray-100 p-4 flex flex-col border-r border-primary-800/50">
      {/* Profile Section */}
      <div className="mb-4">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto shadow-lg p-1">
            <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden bg-white">
              <Image
                src="/profile.jpg"
                alt="Razeen Iqbal"
                width={80}
                height={80}
                className="w-full h-full object-cover rounded-full"
                priority
                quality={85}
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-handwriting text-white mb-0.5">
            Razeen Iqbal
          </h2>
          <p className="text-xs text-gray-400 mb-2">Data Engineer & AI Specialist</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-200 dark:bg-primary-800 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-accent-blue' : ''}`} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}

        {/* Come Talk to My AI Bot - Special Button */}
        <div className="pt-1">
          <Link
            href="/archive/v1/smart-talk"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-200 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium">Talk to My AI Bot</span>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-primary-200 dark:border-primary-800">
        {/* Social Links */}
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <a
            href="https://github.com/razeeniqbal"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-primary-200 dark:bg-primary-800 hover:bg-primary-300 dark:hover:bg-primary-700 rounded-full transition-all duration-200"
            aria-label="GitHub"
          >
            <Github className="w-3.5 h-3.5 text-gray-700 dark:text-gray-400" />
          </a>
          <a
            href="https://linkedin.com/in/razeeniqbal"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-primary-200 dark:bg-primary-800 hover:bg-primary-300 dark:hover:bg-primary-700 rounded-full transition-all duration-200"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-3.5 h-3.5 text-gray-700 dark:text-gray-400" />
          </a>
          <a
            href="mailto:razeeniqbal98@gmail.com"
            className="p-2 bg-primary-200 dark:bg-primary-800 hover:bg-primary-300 dark:hover:bg-primary-700 rounded-full transition-all duration-200"
            aria-label="Email"
          >
            <Mail className="w-3.5 h-3.5 text-gray-700 dark:text-gray-400" />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-[10px] text-center text-gray-600 dark:text-gray-500 leading-tight">
          © 2025 <span className="font-handwriting">Razeen Iqbal</span><br />All rights reserved.
        </p>
      </div>
    </aside>
  );
}
