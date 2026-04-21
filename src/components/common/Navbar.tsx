import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import type { NavItem } from '@/types';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { roleHomePath } from '@/routes/routeUtils';

const navigationItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'Resources', href: '/resources' },
  { name: 'Certifications', href: '/certifications' },
  { name: 'Community', href: '/community' },
  { name: 'Support', href: '/support' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, accessToken } = useAuth();
  const location = useLocation();
  const isStudentBoard = location.pathname.startsWith("/student/");

  return (
    <nav className={`${isStudentBoard ? "bg-slate-900 border-slate-700" : "bg-background border-border"} border-b shadow-sm sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="https://i.postimg.cc/dDPqTDcm/vialife.png" alt="Vialife Logo" className="h-8 w-8" />
            <span className={`text-xl font-bold ${isStudentBoard ? "text-slate-100" : "text-foreground"}`}>
              Vialifecoach Academy
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isStudentBoard ? "text-slate-300 hover:text-sky-300" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <NavLink to={accessToken && user ? roleHomePath(user.role) : "/signup"}>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {accessToken && user ? "Dashboard" : "Sign Up"}
              </Button>
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 border-t ${isStudentBoard ? "bg-slate-900 border-slate-700" : "bg-background border-border"}`}>
              {navigationItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                    isStudentBoard
                      ? "text-slate-300 hover:text-sky-300 hover:bg-slate-800"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  }`}
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <NavLink to={accessToken && user ? roleHomePath(user.role) : "/signup"}>
                  <Button variant="ghost" size="sm" className="justify-start">
                    {accessToken && user ? "Dashboard" : "Sign Up"}
                  </Button>
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
