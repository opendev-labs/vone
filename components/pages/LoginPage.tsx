import React, { useState } from 'react';
import { safeNavigate } from '../../services/navigation';
import { GitHubIcon, GitLabIcon, GmailIcon } from '../common/Icons';
import { useAuth } from '../../hooks/useAuth';
import { ErrorMessage } from '../common/ErrorMessage';
import { GITHUB_CLIENT_ID, GITHUB_OAUTH_URL, GITHUB_SCOPES } from '../../config';

const SocialButton: React.FC<{ provider: string, icon: React.ReactNode, href?: string, onClick?: () => void }> = ({ provider, icon, href, onClick }) => {
    const Tag = href ? 'a' : 'button';
    const buttonProps = href ? { href } : { type: 'button' as const, onClick };

    return (
        <Tag {...buttonProps} className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-void-line bg-void-line/50 hover:bg-void-card transition-colors cursor-pointer active:scale-95 duration-200 select-none">
            {icon}
            <span className="text-sm font-medium text-zinc-200">Continue with {provider}</span>
        </Tag>
    )
}

const VoidLogo = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
        <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 7L7 12L12 17L17 12L12 7Z" fill="white" />
    </svg>
);


export const LoginPage: React.FC = () => {
    const { login, loginWithGitHub } = useAuth();
    const [error, setError] = useState('');

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        safeNavigate(path);
    };

    const handleGmailLogin = () => {
        login({ name: 'Demo User', email: 'demo.user@gmail.com' });
    };

    const handleGitLabLogin = () => {
        login({ name: 'GitLab User', email: 'user@gitlab.com' });
    };

    const handleEmailLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        localStorage.setItem('void_verification_user', JSON.stringify({ email, name: 'Valued User' }));
        safeNavigate('/verify-email');
    };

    const gitHubAuthUrl = `${GITHUB_OAUTH_URL}?client_id=${GITHUB_CLIENT_ID}&scope=${encodeURIComponent(GITHUB_SCOPES)}`;


    return (
        <div className="py-12 sm:py-20 flex items-center justify-center">
            <div className="w-full max-w-sm p-8 bg-void-card border border-void-line rounded-lg">
                <VoidLogo />
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tighter text-white">Log in to Void</h1>
                    <p className="mt-2 text-zinc-400 text-sm">Welcome back.</p>
                </div>

                <div className="space-y-3">
                    <SocialButton
                        provider="GitHub"
                        icon={<GitHubIcon />}
                        onClick={async () => {
                            setError('');
                            try {
                                await loginWithGitHub();
                            } catch (err: any) {
                                let msg = 'Failed to sign in with GitHub.';
                                if (err.code === 'auth/popup-closed-by-user') msg = 'Sign-in cancelled.';
                                if (err.code === 'auth/cancelled-popup-request') msg = 'Popup blocked or cancelled.';
                                setError(msg);
                            }
                        }}
                    />
                    <SocialButton provider="GitLab" icon={<GitLabIcon />} onClick={handleGitLabLogin} />
                    <SocialButton provider="Gmail" icon={<GmailIcon />} onClick={handleGmailLogin} />
                </div>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-void-line"></div>
                    <span className="flex-shrink mx-4 text-xs text-zinc-500">OR</span>
                    <div className="flex-grow border-t border-void-line"></div>
                </div>

                <form className="space-y-4" onSubmit={handleEmailLogin}>
                    {error && <ErrorMessage message={error} />}
                    <div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full bg-void-bg border border-void-line py-2 px-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-void-neon"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full bg-void-bg border border-void-line py-2 px-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-void-neon"
                            placeholder="Password"
                        />
                    </div>
                    <button type="submit" className="w-full bg-white text-black font-semibold py-2.5 px-4 hover:bg-zinc-200 transition-colors">
                        Continue with Email
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-zinc-400">
                    Don't have an account?{' '}
                    <a href="/#/signup" onClick={(e) => handleNav(e, '/signup')} className="text-void-neon hover:underline font-semibold">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};
