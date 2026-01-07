import React from 'react';
import { safeNavigate } from '../../services/navigation';
import { socialProofLogos } from '../../constants';
import { SparklesIcon, CpuChipIcon, PuzzlePieceIcon, GitBranchIcon, RocketLaunchIcon, GlobeAltIcon, ShieldCheckIcon } from '../common/Icons';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;

const HeroSection = ({ onNav }: { onNav: (e: React.MouseEvent, path: string) => void }) => (
    <div className="relative pt-20 pb-32 flex flex-col items-center text-center overflow-hidden">
        {/* Abstract Background Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-void-accent/20 via-void-neon/10 to-transparent blur-[120px] rounded-full pointer-events-none z-0" />

        <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
        >
            <span className="inline-block py-1 px-3 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs font-medium text-zinc-400 mb-6 backdrop-blur-md">
                v1.0 is now live &rarr;
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-500 mb-6 max-w-4xl mx-auto leading-[1.1]">
                Your complete platform for the web.
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Void provides the frontend infrastructure and edge network to build, scale, and secure faster web applications.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <a
                    href="/#/signup"
                    onClick={(e) => onNav(e, '/signup')}
                    className="h-12 px-8 rounded-full bg-white text-black font-bold text-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                    <RocketLaunchIcon className="w-5 h-5" />
                    Start Deploying
                </a>
                <a
                    href="/#/docs"
                    onClick={(e) => onNav(e, '/docs')}
                    className="h-12 px-8 rounded-full bg-zinc-900 text-white border border-zinc-800 font-medium text-lg hover:bg-zinc-800 transition-all flex items-center gap-2"
                >
                    Read the Docs
                </a>
            </div>
        </MotionDiv>
    </div>
);

const FeatureGrid = () => (
    <div className="py-24 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
            <MotionDiv
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-8"
            >
                <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors group">
                    <div className="w-12 h-12 bg-black rounded-lg border border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <GlobeAltIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Global Edge Network</h3>
                    <p className="text-zinc-400 leading-relaxed">
                        Deploy your content to our high-performance edge network. We handle the complexity of distribution and caching.
                    </p>
                </div>
                <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors group">
                    <div className="w-12 h-12 bg-black rounded-lg border border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <CpuChipIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Serverless Functions</h3>
                    <p className="text-zinc-400 leading-relaxed">
                        Write backend code that scales automatically with traffic. No servers to manage, monitor, or patch.
                    </p>
                </div>
                <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors group">
                    <div className="w-12 h-12 bg-black rounded-lg border border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <ShieldCheckIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">DDoS Protection</h3>
                    <p className="text-zinc-400 leading-relaxed">
                        Enterprise-grade security built-in. Automatic SSL, custom firewalls, and instant threat mitigation.
                    </p>
                </div>
            </MotionDiv>
        </div>
    </div>
);

const SocialProof = () => (
    <div className="py-12 border-t border-b border-zinc-900 bg-black/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-sm font-semibold text-zinc-500 mb-8 tracking-widest uppercase">Trusted by forward-thinking teams</p>
            <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-50">
                {socialProofLogos.map(logo => (
                    <img key={logo.name} src={logo.url} alt={logo.name} className="h-8 md:h-10 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                ))}
            </div>
        </div>
    </div>
);

const CallToAction = ({ onNav }: { onNav: (e: React.MouseEvent, path: string) => void }) => (
    <div className="py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-void-accent/5 pointer-events-none" />
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
            Ready to deploy?
        </h2>
        <a
            href="/#/signup"
            onClick={(e) => onNav(e, '/signup')}
            className="inline-block px-10 py-4 text-xl font-bold bg-white text-black rounded-full hover:scale-105 transition-transform"
        >
            Get Started for Free
        </a>
    </div>
);

export const HomePage: React.FC = () => {
    const handleNav = (e: React.MouseEvent, path: string) => {
        e.preventDefault();
        safeNavigate(path);
    };

    return (
        <div className="bg-void-bg min-h-screen">
            <HeroSection onNav={handleNav} />
            <SocialProof />
            <FeatureGrid />
            <CallToAction onNav={handleNav} />
        </div>
    );
};