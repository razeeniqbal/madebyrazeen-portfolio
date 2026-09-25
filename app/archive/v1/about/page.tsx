'use client';

import { personalInfo, educationCards, careers } from '@/lib/data';
import { GraduationCap, User } from 'lucide-react';
import { EducationSection, CareerSection, GlowCard } from '@/components/v1/ui';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-950">
      <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gray-900 dark:bg-gray-100 p-2 rounded">
            <User className="w-6 h-6 text-white dark:text-gray-900" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About Me</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get to know the person behind the code</p>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mb-12">
        <GlowCard customSize glowColor="blue" className="w-full h-auto bg-white dark:bg-gray-900/80">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gray-900 dark:bg-gray-100 p-2 rounded">
              <GraduationCap className="w-5 h-5 text-white dark:text-gray-900" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Story</h2>
          </div>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              {personalInfo.bio}
            </p>
            <p className="text-sm">
              My journey started in civil engineering, but I discovered my passion for data and AI during 
              my time at G&P Geotechnic, where I automated engineering workflows and built data solutions. 
              That spark led me to become a Certified Data Analyst and pursue a Master's in Artificial Intelligence,
              and I haven't looked back since.
            </p>
            <p className="text-sm">
              Now as a Data Engineer at AEM Energy Solutions, I work on building data pipelines, moving data 
              between different systems, and creating smart analytics tools for the energy sector. Before this, 
              at EISmartwork, I built prediction models using massive datasets with over 10 million records and 
              created interactive dashboards that helped companies make better decisions 20% faster.
            </p>
            <p className="text-sm">
              I hold a Master's degree in AI from {personalInfo.university} with a CGPA of {personalInfo.cgpa}, 
              and I've earned certifications from big tech companies like Microsoft, Google Cloud, and IBM. I was 
              invited as a Google Speaker to talk about AI at AI Build 2025, and made it to the Top 20 
              in AWS National 2025 for training large language models.
            </p>
            <p className="text-sm">
              What drives me? Turning messy data into clear insights, building systems that learn and improve, 
              and staying ahead in the fast-moving world of AI. Whether it's designing data workflows, training 
              smart models, or creating visual dashboards, I'm passionate about solving tough problems that make 
              a real difference.
            </p>
          </div>
        </GlowCard>
      </div>

      {/* Career Section - Full Width */}
      <div className="mb-12">
        <CareerSection careers={careers} />
      </div>

      {/* Education Section */}
      <div className="mt-12">
        <EducationSection education={educationCards} />
      </div>
      </div>
    </div>
  );
}
