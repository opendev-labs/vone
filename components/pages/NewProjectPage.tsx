import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { Template, GitProvider, Repository, Workflow } from '../../types';
import { mockTemplates, mockRepositories, mockWorkflows } from '../../constants';
import { GitHubIcon, GitLabIcon, BitbucketIcon, SearchIcon, PuzzlePieceIcon, CubeIcon, GitBranchIcon } from '../common/Icons';
import { TemplateCard } from './TemplateCard';
import { ConfigureProjectForm } from '../common/ConfigureProjectForm';
import { WorkflowCard } from './WorkflowCard';

type ActiveView = 'import' | 'template' | 'workflow' | 'none';

interface NewProjectPageProps {
    onDeployTemplate: (template: Template, projectName: string) => void;
    onImportRepository: (repo: Repository, projectName: string) => void;
    onDeployWorkflow: (workflow: Workflow, projectName: string) => void;
    connectedProvider: GitProvider | null;
    setConnectedProvider: (provider: GitProvider | null) => void;
}

const GitProviderButton: React.FC<{
    provider: GitProvider,
    icon: React.ReactNode,
    onClick: () => void,
}> = ({ provider, icon, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-2.5 px-4 border border-zinc-700 hover:bg-void-card bg-void-line transition-colors"
    >
        <div className="flex items-center gap-3">
            {icon}
            <span className="text-sm font-medium text-zinc-200">Continue with {provider}</span>
        </div>
        <span className="text-zinc-500 text-xs">&rarr;</span>
    </button>
);

const RepoList: React.FC<{
    repos: Repository[],
    onImport: (repo: Repository, projectName: string) => void
}> = ({ repos, onImport }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [configuringRepoId, setConfiguringRepoId] = useState<string | null>(null);

    const filteredRepos = useMemo(() =>
        repos.filter(repo => repo.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [repos, searchTerm]
    );

    return (
        <div className="space-y-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-void-card border border-zinc-700 py-2 pl-9 pr-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-void-neon"
                />
            </div>
            <div className="border border-void-line rounded-lg">
                {filteredRepos.map(repo => (
                    <div key={repo.id} className="p-3 border-b border-void-line last:border-b-0">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-white font-medium">{repo.name}</p>
                                <p className="text-xs text-zinc-500">{repo.owner} &middot; {repo.updatedAt}</p>
                            </div>
                            {configuringRepoId !== repo.id && (
                                <button onClick={() => setConfiguringRepoId(repo.id)} className="text-sm bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold px-4 py-1 hover:bg-zinc-700 transition-colors">
                                    Import
                                </button>
                            )}
                        </div>
                        {configuringRepoId === repo.id && (
                            <ConfigureProjectForm
                                defaultName={repo.name}
                                onDeploy={(projectName) => {
                                    onImport(repo, projectName);
                                    setConfiguringRepoId(null);
                                }}
                                onCancel={() => setConfiguringRepoId(null)}
                            />
                        )}
                    </div>
                ))}
                {filteredRepos.length === 0 && (
                    <div className="text-center p-8 text-zinc-500">
                        <p>No repositories found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const SelectionCard: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void }> = ({ icon, title, description, onClick }) => (
    <button onClick={onClick} className="text-left bg-void-card border border-void-line rounded-lg p-6 hover:border-void-accent transition-colors w-full">
        <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-void-line rounded-md text-zinc-300">{icon}</div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <p className="text-zinc-400">{description}</p>
    </button>
);


export const NewProjectPage: React.FC<NewProjectPageProps> = ({
    onDeployTemplate,
    onImportRepository,
    onDeployWorkflow,
    connectedProvider,
    setConnectedProvider
}) => {
    const [activeView, setActiveView] = useState<ActiveView>('none');
    const { gitHubAccessToken } = useAuth();
    const [realRepos, setRealRepos] = useState<Repository[]>([]);
    const [isLoadingRepos, setIsLoadingRepos] = useState(false);

    useEffect(() => {
        if (connectedProvider === 'GitHub' && gitHubAccessToken) {
            setIsLoadingRepos(true);
            fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
                headers: {
                    'Authorization': `Bearer ${gitHubAccessToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch repos');
                    return res.json();
                })
                .then(data => {
                    const mappedRepos: Repository[] = data.map((repo: any) => ({
                        id: repo.id.toString(),
                        name: repo.name,
                        owner: repo.owner.login,
                        description: repo.description || '',
                        updatedAt: new Date(repo.updated_at).toLocaleDateString(),
                        provider: 'GitHub',
                        url: repo.html_url
                    }));
                    // Filter out forks if desired, or keep them.
                    setRealRepos(mappedRepos);
                })
                .catch(err => {
                    console.error("Error fetching GitHub repos:", err);
                    // Fallback to mock or empty
                })
                .finally(() => setIsLoadingRepos(false));
        }
    }, [connectedProvider, gitHubAccessToken]);

    const handleConnect = (provider: GitProvider) => {
        setConnectedProvider(provider);
    };

    const gitProviderIcons: Record<GitProvider, React.ReactNode> = {
        GitHub: <GitHubIcon />,
        GitLab: <GitLabIcon />,
        Bitbucket: <BitbucketIcon />,
    };

    const renderContent = () => {
        if (activeView === 'none') {
            return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <SelectionCard
                        icon={<GitBranchIcon className="w-6 h-6" />}
                        title="Import Git Repository"
                        description="Deploy from an existing repository on GitHub, GitLab, or Bitbucket."
                        onClick={() => setActiveView('import')}
                    />
                    <SelectionCard
                        icon={<PuzzlePieceIcon className="w-6 h-6" />}
                        title="Clone a Template"
                        description="Get started quickly with a pre-built boilerplate for popular frameworks."
                        onClick={() => setActiveView('template')}
                    />
                    <SelectionCard
                        icon={<CubeIcon className="w-6 h-6" />}
                        title="Use a Workflow"
                        description="Deploy a full stack with pre-configured frameworks and services."
                        onClick={() => setActiveView('workflow')}
                    />
                </div>
            )
        }

        const backButton = (
            <button onClick={() => setActiveView('none')} className="text-sm text-zinc-400 hover:text-white mb-8 inline-block">&larr; Back to options</button>
        );

        switch (activeView) {
            case 'import':
                return (
                    <div>
                        {backButton}
                        <div className="bg-void-card border border-void-line rounded-lg p-6 space-y-5 max-w-lg mx-auto">
                            <h2 className="text-xl font-semibold text-white">Import Git Repository</h2>
                            {!connectedProvider ? (
                                <div className="space-y-3">
                                    <GitProviderButton provider="GitHub" icon={<GitHubIcon />} onClick={() => handleConnect('GitHub')} />
                                    <GitProviderButton provider="GitLab" icon={<GitLabIcon />} onClick={() => handleConnect('GitLab')} />
                                    <GitProviderButton provider="Bitbucket" icon={<BitbucketIcon />} onClick={() => handleConnect('Bitbucket')} />
                                </div>
                            ) : (
                                <div>
                                    <div className="flex justify-between items-center mb-4 p-2 bg-void-line">
                                        <div className="flex items-center gap-2">
                                            {gitProviderIcons[connectedProvider]}
                                            <span className="text-sm text-zinc-300">Connected as <span className="font-semibold text-white">opendev-labs</span></span>
                                        </div>
                                        <button onClick={() => setConnectedProvider(null)} className="text-xs text-zinc-400 hover:text-white">
                                            Disconnect
                                        </button>
                                    </div>
                                    {isLoadingRepos ? (
                                        <div className="p-8 text-center text-zinc-400">Loading repositories from GitHub...</div>
                                    ) : (
                                        <RepoList
                                            repos={connectedProvider === 'GitHub' && realRepos.length > 0 ? realRepos : mockRepositories[connectedProvider]}
                                            onImport={onImportRepository}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'template':
                return (
                    <div>
                        {backButton}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {mockTemplates.map(template => (
                                <TemplateCard
                                    key={template.id}
                                    template={template}
                                    onDeploy={onDeployTemplate}
                                />
                            ))}
                        </div>
                    </div>
                );
            case 'workflow':
                return (
                    <div>
                        {backButton}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mockWorkflows.map(workflow => (
                                <WorkflowCard
                                    key={workflow.id}
                                    workflow={workflow}
                                    onDeploy={onDeployWorkflow}
                                />
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white">Let's build something new.</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-zinc-400">To create a new Project, choose one of the options below.</p>
            </div>

            <div>
                {renderContent()}
            </div>
        </div>
    );
};