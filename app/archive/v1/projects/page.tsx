'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, Filter, Sparkles } from 'lucide-react';
import { projects, projectCategories, Project } from '@/lib/projectsData';
import { ProjectCard } from '@/components/v1/ui/ProjectCard';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Category filter
      const categoryMatch = selectedCategory === 'all' || project.category === selectedCategory;

      // Featured filter
      const featuredMatch = !showFeaturedOnly || project.featured;

      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const searchMatch = searchQuery === '' ||
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        project.techStack.some(tech => tech.toLowerCase().includes(searchLower));

      return categoryMatch && featuredMatch && searchMatch;
    });
  }, [searchQuery, selectedCategory, showFeaturedOnly]);

  const featuredProjects = projects.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-950">
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gray-900 dark:bg-gray-100 p-2 rounded">
              <Briefcase className="w-6 h-6 text-white dark:text-gray-900" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A showcase of both private and open-source projects I've built or contributed to.
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>

          {/* Category Filter and Featured Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Filter className="w-5 h-5" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white text-sm"
            >
              {projectCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Featured Toggle */}
            <button
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                showFeaturedOnly
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Featured Only ({featuredProjects.length})
            </button>
          </div>

          {/* Results Count */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Total: {filteredProjects.length}</span>
            {searchQuery && (
              <span>
                • Showing results for "{searchQuery}"
              </span>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
              Try adjusting your search query or filters to find what you're looking for.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">
            Got a Project in Mind?
          </h2>
          <p className="mb-6 max-w-2xl mx-auto text-blue-50">
            I'm always interested in collaborating on exciting data engineering, AI, and web development projects.
            Let's build something amazing together!
          </p>
          <a
            href="/archive/v1/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>
    </div>
  );
}
