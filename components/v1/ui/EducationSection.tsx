"use client"

import React from "react"
import { GraduationCap, Download } from "lucide-react"
import { GlowCard } from "./spotlight-card"

interface Education {
  institution: string
  degree: string
  field: string
  period: string
  location: string
  cgpa?: string
  logo?: string
}

interface EducationSectionProps {
  education: Education[]
  className?: string
}

export function EducationSection({ education, className }: EducationSectionProps) {
  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/Razeen_Iqbal_Resume.pdf';
    link.download = 'Razeen_Iqbal_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPortfolio = () => {
    // Open portfolio in new tab (this entire website)
    window.open(window.location.origin, '_blank');
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gray-900 dark:bg-gray-100 p-2 rounded">
            <GraduationCap className="w-6 h-6 text-white dark:text-gray-900" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">My educational journey.</p>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleDownloadPortfolio}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Download Portfolio</span>
          </button>
          <button
            onClick={handleDownloadResume}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Download Resume</span>
          </button>
        </div>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {education.map((edu, index) => (
          <GlowCard
            key={index}
            customSize
            glowColor="orange"
            className="w-full h-auto bg-white dark:bg-gray-900/80 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                {edu.logo ? (
                  <img src={edu.logo} alt={edu.institution} className="w-12 h-12" />
                ) : (
                  <GraduationCap className="w-8 h-8 text-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {edu.institution}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {edu.degree} • {edu.field}
                </div>
                <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-500">
                  <span className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600"></span>
                    {edu.period}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600"></span>
                    {edu.location}
                  </span>
                  {edu.cgpa && (
                    <span className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600"></span>
                      CGPA: {edu.cgpa}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  )
}
