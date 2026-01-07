import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AnimatedLoaderIcon } from '../common/AnimatedLoaderIcon';

const LoadingText: React.FC<{ text: string }> = ({ text }) => {
    return (
        <p className="mt-6 text-lg text-zinc-400 tracking-widest font-mono">
            {text.split('').map((char, i) => (
                <span
                    key={i}
                    className="opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${500 + i * 50}ms` }}
                >
                    {char}
                </span>
            ))}
        </p>
    )
}

export const GitHubCallbackHandler: React.FC = () => {
    const { login } = useAuth();
    const [statusText, setStatusText] = useState("Authenticating with GitHub...");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
            // --- This is where the real backend interaction would happen ---
            // In a real application:
            // 1. Send the 'code' to your backend API.
            //    e.g., fetch('/api/auth/github', { method: 'POST', body: JSON.stringify({ code }) })
            // 2. Your backend exchanges the code for an access token with GitHub, using your Client ID and Client Secret.
            // 3. Your backend uses the access token to fetch user data from the GitHub API.
            // 4. Your backend returns the user data (e.g., name, email) to the frontend.
            // 5. The frontend calls `login(userData)`.

            // We simulate this process with a timeout.
            setTimeout(() => {
                setStatusText("Fetching user details...");
                setTimeout(() => {
                    const mockUser = {
                        name: 'GitHub User',
                        email: 'user.from.github@void.app'
                    };
                    login(mockUser);

                    // Clean up the URL to remove the 'code' query parameter.
                    // This prevents the code from being reused on a page refresh.
                    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);

                }, 1500);
            }, 2000);

        } else {
            // Handle error case where no code is present
            setStatusText("Authentication failed. Redirecting...");
            setTimeout(() => {
                window.location.href = window.location.pathname + '#/login';
            }, 2000);
        }

    }, [login]);

    return (
        <div className="fixed inset-0 bg-void-bg flex flex-col items-center justify-center z-[100]">
            <AnimatedLoaderIcon size={64} strokeWidth={1.5} />
            <LoadingText text={statusText} />
            <div className="absolute bottom-10 text-center text-xs text-zinc-600 max-w-md">
                This is a simulation. In a real application, your browser would securely communicate with the Void backend to verify your GitHub identity without exposing any secrets.
            </div>
        </div>
    );
};
