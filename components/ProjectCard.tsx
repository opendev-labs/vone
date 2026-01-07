import React from 'react';
import type { Project, GitProvider } from '../types';
import { StatusIndicator } from './common/Indicators';
import { safeNavigate } from '../services/navigation';
import { GitHubIcon, GitLabIcon, BitbucketIcon, GitBranchIcon } from './common/Icons';

interface ProjectCardProps {
  project: Project;
}

const GitProviderIcon: React.FC<{ provider?: GitProvider }> = ({ provider }) => {
    const icons: Record<GitProvider, React.ReactNode> = {
        GitHub: <GitHubIcon />,
        GitLab: <GitLabIcon />,
        Bitbucket: <BitbucketIcon />,
    };
    if (!provider || !icons[provider]) return null;
    return <div className="text-zinc-400">{icons[provider]}</div>;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const href = `#/projects/${project.id}`;
  
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    safeNavigate(href);
  };
  
  const latestDeployment = project.deployments[0];

  return (
    <div 
        className="relative transition-transform duration-300 ease-out hover:-translate-y-1"
        onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
        }}
    >
      <div className="absolute -inset-px bg-gradient-to-r from-void-accent to-void-neon rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      <a 
        href={href}
        onClick={handleNav}
        className="relative block bg-void-card rounded-lg border border-void-line p-5 h-full flex flex-col justify-between glow-border"
      >
        <div>
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-white text-lg">{project.name}</h3>
            <GitProviderIcon provider={project.gitProvider} />
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400 font-mono">
            <GitBranchIcon className="h-4 w-4 shrink-0" />
            <span className="truncate" title={latestDeployment?.commit}>
                {latestDeployment?.commit.split(' - ')[1] || 'No deployments yet'}
            </span>
          </div>
           <p className="text-xs text-zinc-500 font-mono mt-1 ml-6 truncate">
              {latestDeployment?.commit.split(' - ')[0] || ''}
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-void-line flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
              {latestDeployment ? (
                  <>
                      <StatusIndicator status={latestDeployment.status} />
                      <span className="text-zinc-300">{latestDeployment.status}</span>
                  </>
              ) : (
                  <span className="text-zinc-500">Not deployed</span>
              )}
          </div>
          <span className="text-zinc-500">{project.lastUpdated}</span>
        </div>
      </a>
    </div>
  );
};