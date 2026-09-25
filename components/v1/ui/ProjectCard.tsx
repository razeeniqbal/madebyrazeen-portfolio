"use client"

import React from "react"
import { ExternalLink, Github, Star } from "lucide-react"
import { GlowCard } from "./spotlight-card"
import { Project } from "@/lib/projectsData"

interface ProjectCardProps {
  project: Project
}

const categoryColors = {
  web: 'blue',
  mobile: 'purple',
  ml: 'green',
  data: 'orange',
  other: 'blue'
} as const;

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="relative h-full">
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 z-10 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <Star className="w-3 h-3 fill-current" />
          Featured
        </div>
      )}

      <GlowCard
        customSize
        glowColor={categoryColors[project.category]}
        className="w-full h-full bg-white dark:bg-gray-900/80 hover:shadow-2xl transition-all duration-300 flex flex-col min-h-full"
      >
        {/* Project Image */}
        <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden mb-4">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                    <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                `;
              }
            }}
          />
        </div>

        {/* Project Content */}
        <div className="flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {project.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 rounded"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 rounded">
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-blue-600 dark:text-blue-400 font-medium"
              >
                #{tag.replace(/\s+/g, '')}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Project
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  project.liveUrl ? 'flex-shrink-0' : 'flex-1'
                } flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors`}
              >
                <Github className="w-4 h-4" />
                {!project.liveUrl && 'GitHub'}
              </a>
            )}
            {!project.liveUrl && !project.githubUrl && (
              <div className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm font-medium rounded-lg">
                Private Project
              </div>
            )}
          </div>
        </div>
      </GlowCard>
    </div>
  );
}
