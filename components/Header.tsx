import React, { useState, useRef, useEffect } from 'react';
import { safeNavigate } from '../services/navigation';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';
import { DocsIcon, LogoutIcon, MenuIcon, NewProjectIcon, UsageIcon, XIcon, TerminalIcon } from './common/Icons';

const VoidLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M12 7L7 12L12 17L17 12L12 7Z" fill="white" className="group-hover:animate-logo-pulse" />
    </svg>
);

const UserMenu: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length === 1) return names[0][0].toUpperCase();
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-8 h-8 bg-void-accent flex items-center justify-center text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-void-bg focus:ring-void-accent"
            >
                {getInitials(user.name)}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-void-card border border-void-line shadow-lg py-1 z-50 rounded-md">
                    <div className="px-4 py-2 border-b border-void-line">
                        <p className="text-sm text-white font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                    </div>
                     <a href="/#/docs" onClick={(e) => { e.preventDefault(); safeNavigate('/docs'); setIsOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-void-line hover:text-white transition-colors">
                        <DocsIcon /> Docs
                    </a>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-void-line hover:text-white transition-colors"
                    >
                        <LogoutIcon /> Log out
                    </button>
                </div>
            )}
        </div>
    );
};


const NavLink: React.FC<{ path: string; label: string; currentPath: string; onClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void; }> = ({ path, label, currentPath, onClick }) => {
    const isActive = currentPath === path.replace('/#/', '');
    return (
         <a href={path} onClick={(e) => onClick(e, path)} className={`relative text-zinc-300 hover:text-white transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:bg-void-neon after:transition-transform after:duration-300 after:ease-in-out ${isActive ? 'text-white after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'}`}>
            {label}
        </a>
    )
};


export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.hash.replace(/^#\/?/, ''));

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.replace(/^#\/?/, ''));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    safeNavigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="py-3 px-4 md:px-8 sticky top-0 z-50 bg-void-bg/80 backdrop-blur-md border-b border-void-line">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/#/" onClick={(e) => handleNav(e, '/')} className="flex items-center gap-3 group">
          <VoidLogo />
          <h1 className="text-lg font-semibold text-white tracking-wide">void</h1>
        </a>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <NavLink path="/#/docs" label="Docs" currentPath={currentPath} onClick={handleNav} />
            {isAuthenticated && (
              <>
                <NavLink path="/#/new" label="New Project" currentPath={currentPath} onClick={handleNav} />
                <NavLink path="/#/usage" label="Usage" currentPath={currentPath} onClick={handleNav} />
                <NavLink path="/#/cli" label="CLI" currentPath={currentPath} onClick={handleNav} />
              </>
            )}
            <NavLink path="/#/pricing" label="Pricing" currentPath={currentPath} onClick={handleNav} />
          </nav>
          <div className="flex items-center gap-4">
             {isAuthenticated && user ? (
                 <UserMenu user={user} onLogout={logout} />
             ) : (
                <>
                    <a href="/#/login" onClick={(e) => handleNav(e, '/login')} className="hidden sm:inline-block text-sm text-zinc-300 hover:text-white transition-colors">Login</a>
                    <a href="/#/signup" onClick={(e) => handleNav(e, '/signup')} className="text-sm bg-white text-black font-semibold px-4 py-1.5 hover:bg-zinc-200 transition-colors">Sign Up</a>
                </>
             )}
              <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                    {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
                </button>
            </div>
          </div>
        </div>
      </div>

       {/* Mobile Menu */}
       <div className={`fixed inset-0 z-40 bg-void-bg/95 backdrop-blur-xl md:hidden transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="container mx-auto pt-20 px-4">
                 <nav className="flex flex-col items-center gap-8 text-lg font-medium">
                    <a href="/#/docs" onClick={(e) => handleNav(e, '/docs')} className="text-zinc-300 hover:text-void-neon transition-colors flex items-center gap-2"><DocsIcon /> Docs</a>
                    {isAuthenticated && (
                      <>
                        <a href="/#/new" onClick={(e) => handleNav(e, '/new')} className="text-zinc-300 hover:text-void-neon transition-colors flex items-center gap-2"><NewProjectIcon/> New Project</a>
                        <a href="/#/usage" onClick={(e) => handleNav(e, '/usage')} className="text-zinc-300 hover:text-void-neon transition-colors flex items-center gap-2"><UsageIcon /> Usage</a>
                        <a href="/#/cli" onClick={(e) => handleNav(e, '/cli')} className="text-zinc-300 hover:text-void-neon transition-colors flex items-center gap-2"><TerminalIcon className="h-6 w-6" /> CLI</a>
                      </>
                    )}
                    <a href="/#/pricing" onClick={(e) => handleNav(e, '/pricing')} className="text-zinc-300 hover:text-void-neon transition-colors">Pricing</a>
                 </nav>
            </div>
       </div>
    </header>
  );
};