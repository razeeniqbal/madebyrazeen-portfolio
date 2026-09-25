'use client';

import React, { useState, useMemo } from 'react';
import { Search, Award, Filter } from 'lucide-react';
import { achievements, Achievement } from '@/lib/achievementsData';
import { AchievementCard } from '@/components/v1/ui/AchievementCard';

export default function AchievementsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter and search achievements
  const filteredAchievements = useMemo(() => {
    return achievements.filter((achievement) => {
      // Category filter
      const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;

      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const searchMatch = searchQuery === '' ||
        achievement.title.toLowerCase().includes(searchLower) ||
        achievement.organization.toLowerCase().includes(searchLower) ||
        achievement.description.toLowerCase().includes(searchLower) ||
        achievement.credentialId?.toLowerCase().includes(searchLower);

      return categoryMatch && searchMatch;
    });
  }, [searchQuery, selectedCategory]);

  const categories = [
    { value: 'all', label: 'All Achievements', count: achievements.length },
    { value: 'certification', label: 'Certifications', count: achievements.filter(a => a.category === 'certification').length },
    { value: 'award', label: 'Awards', count: achievements.filter(a => a.category === 'award').length },
    { value: 'course', label: 'Courses', count: achievements.filter(a => a.category === 'course').length },
    { value: 'achievement', label: 'Achievements', count: achievements.filter(a => a.category === 'achievement').length },
  ];

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-950">
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gray-900 dark:bg-gray-100 p-2 rounded">
              <Award className="w-6 h-6 text-white dark:text-gray-900" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Achievements</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A curated collection of certificates and badges I've earned throughout my professional and academic journey.
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
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Filter className="w-5 h-5" />
              <span className="text-sm font-medium">Filter achievements...</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white text-sm"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label} ({category.count})
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Total: {filteredAchievements.length}</span>
            {searchQuery && (
              <span>
                • Showing results for "{searchQuery}"
              </span>
            )}
          </div>
        </div>

        {/* Achievements Grid */}
        {filteredAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <div key={achievement.id} className="h-full">
                <AchievementCard achievement={achievement} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No achievements found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
              Try adjusting your search query or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
