import React from 'react';
import { safeNavigate } from '../../services/navigation';
import { socialProofLogos } from '../../constants';
import { SparklesIcon, CpuChipIcon, PuzzlePieceIcon, GitBranchIcon } from '../common/Icons';

const VoidBackground = () => (
    <>
      <div className="absolute inset-0 z-[-2] bg-black" />
      <div 
        className="absolute inset-0 z-[-1] opacity-40" 
        style={{
            backgroundImage: 'radial-gradient(circle at 25% 30%, #7DF9FF, transparent 30%), radial-gradient(circle at 75% 70%, #9b5cff, transparent 30%)',
            animation: 'gradient-fade 10s ease-in-out infinite',
            backgroundSize: '200% 200%',
            filter: 'blur(120px)',
        }}
       />
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at center, transparent 35%, #050507 70%)'
        }}
      />
    </>
  );

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-void-card/50 border border-void-line p-6 rounded-lg backdrop-blur-sm glow-border"
        onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
        }}
    >
        <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 flex items-center justify-center bg-void-accent/20 text-void-accent rounded-md">{icon}</div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-sm text-zinc-400">{children}</p>
    </div>
);


export const HomePage: React.FC = () => {
    
    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        safeNavigate(path);
    };

    return (
        <div className="relative overflow-hidden -mx-4">
             {/* Background Elements */}
            <VoidBackground />
            
            <div className="relative z-10 container mx-auto px-4">
                {/* Hero Section */}
                <div className="min-h-[80vh] flex flex-col justify-center items-center text-center py-10">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-lg animate-fade-in-up">
                        Develop. Preview. <span className="gradient-text">Ship.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg text-zinc-400 animate-fade-in-up opacity-0 [animation-delay:0.3s]">
                        Void is the ultimate serverless platform for developers, providing the tools to build and deploy high-performance web applications at the speed of light.
                    </p>
                    <div className="mt-12 flex items-center justify-center gap-x-6 animate-fade-in-up opacity-0 [animation-delay:0.6s]">
                        <a
                            href="/#/signup"
                            onClick={(e) => handleNav(e, '/signup')}
                            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            <span className="absolute -inset-full top-0 block -translate-y-full rounded-full bg-gradient-to-r from-void-accent to-void-neon transition-all duration-500 group-hover:translate-y-0"></span>
                            <span className="relative">Start Deploying for Free</span>
                        </a>
                        <a href="/#/docs" onClick={(e) => handleNav(e, '/docs')} className="group text-sm font-semibold leading-6 text-white hover:text-zinc-300 transition-colors">
                            View Docs <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">→</span>
                        </a>
                    </div>
                </div>

                {/* Social Proof Section */}
                <div className="py-16 text-center">
                    <p className="text-sm text-zinc-500 mb-6">TRUSTED BY THE WORLD'S MOST INNOVATIVE TEAMS</p>
                    <div className="flex justify-center items-center gap-8 flex-wrap">
                        {socialProofLogos.map(logo => (
                            <img key={logo.name} src={logo.url} alt={logo.name} className="h-6 opacity-40 grayscale hover:opacity-80 hover:grayscale-0 transition-all" />
                        ))}
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-20 max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                         <h2 className="text-4xl font-bold tracking-tighter text-white">The complete toolkit for the modern web.</h2>
                         <p className="mt-4 max-w-2xl mx-auto text-zinc-400">From hobby projects to enterprise-scale applications, Void provides the infrastructure you need to succeed.</p>
                    </div>
                     <div className="grid md:grid-cols-2 gap-6">
                        <FeatureCard icon={<GitBranchIcon />} title="Instant Previews">
                           Every Git push gets a unique, production-like URL. Share and test with your team before merging.
                        </FeatureCard>
                        <FeatureCard icon={<SparklesIcon />} title="Global Edge Network">
                           Deploy your static assets and serverless functions worldwide for the lowest possible latency.
                        </FeatureCard>
                         <FeatureCard icon={<CpuChipIcon />} title="Serverless Compute">
                           Run your backend code on demand without managing servers. Pay only for what you use.
                        </FeatureCard>
                         <FeatureCard icon={<PuzzlePieceIcon />} title="Managed Infrastructure">
                           Connect managed databases, storage, and third-party integrations with a single click.
                        </FeatureCard>
                    </div>
                </div>
            </div>
        </div>
    );
};