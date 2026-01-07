

import React from 'react';
import type { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import { safeNavigate } from '../services/navigation';
import { SparklesIcon, PlusIcon, CubeIcon, RocketLaunchIcon, CheckCircleIcon } from './common/Icons';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

// FIX: Create a component alias for motion.div to help TypeScript resolve the complex types from framer-motion.
// This can resolve issues where motion props like 'initial' or 'variants' are not recognized.
const MotionDiv = motion.div;

interface DashboardProps {
  projects: Project[];
  onUpdateProject: (project: Project) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; }> = ({ icon, label, value }) => (
    <div className="bg-void-card/50 border border-void-line rounded-lg p-4 flex items-center gap-4">
        <div className="w-8 h-8 flex items-center justify-center text-zinc-400 bg-void-line rounded-md">
            {icon}
        </div>
        <div>
            <p className="text-sm text-zinc-400">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const DashboardHeader: React.FC<{ projects: Project[] }> = ({ projects }) => {
    const totalDeployments = projects.reduce((acc, p) => acc + p.deployments.length, 0);
    const successfulDeployments = projects.flatMap(p => p.deployments).filter(d => d.status === 'Deployed').length;
    const successRate = totalDeployments > 0 ? ((successfulDeployments / totalDeployments) * 100).toFixed(1) : '100.0';

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard icon={<CubeIcon />} label="Total Projects" value={projects.length} />
            <StatCard icon={<RocketLaunchIcon />} label="Total Deployments" value={totalDeployments} />
            <StatCard icon={<CheckCircleIcon />} label="Success Rate" value={`${successRate}%`} />
        </div>
    );
};

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};


export const Dashboard: React.FC<DashboardProps> = ({ projects, onUpdateProject }) => {
  const { user } = useAuth();

  const handleNewProjectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    safeNavigate('/new');
  };

  const handleUpgradeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    safeNavigate('/upgrade');
  };

  return (
    <div className="space-y-8">
       <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-white">
            {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Projects'}
          </h2>
          <p className="text-zinc-400 mt-1">An overview of your deployments and projects.</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
            <button
                onClick={handleUpgradeClick}
                className="bg-void-card text-zinc-300 border border-void-line font-semibold px-4 py-2 hover:border-void-accent transition-colors text-sm flex items-center gap-2"
            >
                <SparklesIcon />
                Upgrade
            </button>
            <button
                onClick={handleNewProjectClick}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-md bg-white px-5 py-2 text-sm font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105"
            >
                <span className="absolute -inset-full top-0 block -translate-y-full rounded-full bg-gradient-to-r from-void-accent to-void-neon transition-all duration-500 group-hover:translate-y-0"></span>
                <span className="relative flex items-center gap-2">
                    <PlusIcon />
                    New Project
                </span>
            </button>
        </div>
      </div>

      <DashboardHeader projects={projects} />
      
      <MotionDiv 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map(project => (
          <MotionDiv key={project.id} variants={itemVariants}>
            <ProjectCard project={project} />
          </MotionDiv>
        ))}
      </MotionDiv>

      {projects.length === 0 && (
         <div className="text-center py-20 border-2 border-dashed border-void-line rounded-lg">
            <CubeIcon className="mx-auto h-12 w-12 text-zinc-600" />
            <h3 className="mt-4 text-xl font-semibold text-white">No projects yet</h3>
            <p className="mt-2 text-zinc-400">Get started by creating your first project.</p>
            <button
                onClick={handleNewProjectClick}
                className="mt-6 group relative inline-flex items-center justify-center overflow-hidden rounded-md bg-white px-5 py-2 text-sm font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105"
            >
                 <span className="absolute -inset-full top-0 block -translate-y-full rounded-full bg-gradient-to-r from-void-accent to-void-neon transition-all duration-500 group-hover:translate-y-0"></span>
                <span className="relative flex items-center gap-2">
                    <PlusIcon />
                    Create Project
                </span>
            </button>
        </div>
      )}
    </div>
  );
};