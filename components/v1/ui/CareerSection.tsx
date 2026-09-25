"use client"

import React, { useState } from "react"
import { Briefcase } from "lucide-react"
import { GlowCard } from "./spotlight-card"

interface Career {
  company: string
  role: string
  period: string
  location: string
  type: 'Internship' | 'Onsite' | 'Remote' | 'Part-time' | 'Full-time' | 'Hybrid'
  logo?: string
  responsibilities: string[]
}

interface CareerSectionProps {
  careers: Career[]
  className?: string
}

export function CareerSection({ careers, className }: CareerSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleResponsibilities = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Internship':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'Onsite':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'Remote':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      case 'Hybrid':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
      case 'Part-time':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
      case 'Full-time':
        return 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gray-900 dark:bg-gray-100 p-2 rounded">
          <Briefcase className="w-6 h-6 text-white dark:text-gray-900" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Career</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">My professional journey.</p>
        </div>
      </div>

      {/* Career List */}
      <div className="space-y-4">
        {careers.map((career, index) => (
          <GlowCard
            key={index}
            customSize
            glowColor="green"
            className="w-full h-auto bg-white dark:bg-gray-900/80 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                {career.logo ? (
                  <img src={career.logo} alt={career.company} className="w-12 h-12" />
                ) : (
                  <Briefcase className="w-8 h-8 text-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {career.role}
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {career.company}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(career.type)}`}>
                    {career.type}
                  </span>
                </div>

                <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-500 mb-3">
                  <span className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600"></span>
                    {career.period}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600"></span>
                    {career.location}
                  </span>
                </div>

                {/* Responsibilities Toggle */}
                <button
                  onClick={() => toggleResponsibilities(index)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {expandedIndex === index ? 'Hide responsibilities' : 'Show responsibilities'}
                </button>

                {/* Responsibilities List */}
                {expandedIndex === index && (
                  <div className="mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    <ul className="space-y-2">
                      {career.responsibilities.map((responsibility, i) => (
                        <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  )
}
