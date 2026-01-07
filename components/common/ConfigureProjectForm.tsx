
import React, { useState } from 'react';
import { AnimatedLoaderIcon } from './AnimatedLoaderIcon';

interface ConfigureProjectFormProps {
    defaultName: string;
    onDeploy: (projectName: string) => void;
    onCancel: () => void;
}

export const ConfigureProjectForm: React.FC<ConfigureProjectFormProps> = ({ defaultName, onDeploy, onCancel }) => {
    const [projectName, setProjectName] = useState(defaultName);
    const [isDeploying, setIsDeploying] = useState(false);
    const urlFriendlyName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (projectName.trim() && !isDeploying) {
            setIsDeploying(true);
            // Simulate network delay before navigating
            setTimeout(() => {
                onDeploy(projectName.trim());
            }, 1000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-void-line/50 p-4 mt-2 space-y-3">
            <div>
                <label className="text-sm font-medium text-white block mb-1">Project Name</label>
                <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-void-card border border-zinc-700 py-2 px-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-void-neon"
                    required
                    autoFocus
                />
                 <p className="text-xs text-zinc-500 mt-1">
                    Your project will be deployed to <code className="text-zinc-400">{urlFriendlyName}.void.app</code>
                </p>
            </div>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="text-sm bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold px-4 py-1.5 hover:bg-zinc-700 disabled:opacity-50" disabled={isDeploying}>
                    Cancel
                </button>
                <button type="submit" className="text-sm bg-white text-black font-semibold px-4 py-1.5 hover:bg-zinc-200 w-24 h-[34px] flex items-center justify-center disabled:bg-zinc-300" disabled={isDeploying}>
                    {isDeploying ? <AnimatedLoaderIcon size={20} className="text-black" /> : 'Deploy'}
                </button>
            </div>
        </form>
    );
};
