'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Sparkles, ArrowLeft } from 'lucide-react';
import { GlowCard } from '@/components/v1/ui';
import Link from 'next/link';

export default function SmartTalkPage() {
  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-950 flex items-center justify-center p-4">
      <div className="container max-w-2xl">
        {/* Back Button */}
        <Link
          href="/archive/v1/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlowCard
            customSize
            glowColor="purple"
            className="w-full h-auto bg-white dark:bg-gray-900/80"
          >
            <div className="text-center py-12">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-6"
              >
                <MessageSquare className="w-12 h-12 text-white" />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Come Talk to My AI Bot
              </motion.h1>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-2 mb-6"
              >
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <p className="text-xl text-purple-600 dark:text-purple-400 font-semibold">
                  Coming Soon
                </p>
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8 leading-relaxed"
              >
                An AI-powered chat interface is currently under development. Soon you'll be able to
                interact with an intelligent assistant to get instant answers about my portfolio,
                projects, and expertise.
              </motion.p>

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-left max-w-md mx-auto space-y-3 mb-8"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Ask questions about my skills and experience
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Get detailed information about specific projects
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Explore my certifications and achievements
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Get personalized recommendations and insights
                  </p>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Link
                  href="/archive/v1/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <MessageSquare className="w-5 h-5" />
                  Contact Me Instead
                </Link>
              </motion.div>

              {/* Footer Note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xs text-gray-500 dark:text-gray-500 mt-8"
              >
                Stay tuned for updates!
              </motion.p>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </div>
  );
}
