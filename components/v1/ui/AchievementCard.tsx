"use client"

import React from "react"
import { ExternalLink, Award } from "lucide-react"
import { GlowCard } from "./spotlight-card"
import { Achievement } from "@/lib/achievementsData"

interface AchievementCardProps {
  achievement: Achievement
}

const categoryColors = {
  certification: 'blue',
  award: 'orange',
  course: 'green',
  achievement: 'purple'
} as const;

const categoryLabels = {
  certification: 'Certification',
  award: 'Award',
  course: 'Course',
  achievement: 'Achievement'
};

export function AchievementCard({ achievement }: AchievementCardProps) {
  const CardContent = (
    <GlowCard
      customSize
      glowColor={categoryColors[achievement.category]}
      className="w-full h-full bg-white dark:bg-gray-900/80 hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col"
    >
      <div className="flex flex-col gap-4 flex-1">
        {/* Image */}
        <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <img
            src={achievement.image}
            alt={achievement.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                    <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                `;
              }
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {categoryLabels[achievement.category]}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {achievement.title}
          </h3>

          {/* Organization & Date */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {achievement.organization}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Issued: {achievement.issuedDate}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {achievement.description}
          </p>

          {/* Credential Info */}
          {achievement.credentialId && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Credential ID: <span className="font-mono">{achievement.credentialId}</span>
              </p>
            </div>
          )}

          {/* Link Indicator */}
          {achievement.credentialUrl && (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium pt-2">
              <ExternalLink className="w-4 h-4" />
              <span>View Credential</span>
            </div>
          )}
        </div>
      </div>
    </GlowCard>
  );

  // If there's a credential URL, wrap in a link
  if (achievement.credentialUrl) {
    return (
      <a
        href={achievement.credentialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {CardContent}
      </a>
    );
  }

  // Otherwise just return the card with height wrapper
  return <div className="h-full">{CardContent}</div>;
}
