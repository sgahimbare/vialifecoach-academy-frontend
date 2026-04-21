import { Mail } from 'lucide-react';
import type { FooterSection } from '@/types';

const footerSections: FooterSection[] = [
  {
    title: 'Learn',
    links: [
      { name: 'Personal Growth', href: '/personal-growth' },
      { name: 'Mindset Mastery', href: '/mindset' },
      { name: 'Emotional Wellness', href: '/emotional-wellness' },
      { name: 'Life Balance', href: '/life-balance' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Guides & Worksheets', href: '/guides' },
      { name: 'Coaching Tools', href: '/tools' },
      { name: 'Journaling Prompts', href: '/journaling' },
      { name: 'Workshops', href: '/workshops' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'FAQ & Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact-us' },
      { name: 'Client Portal', href: '/portal' },
      { name: 'Community Support', href: '/community' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Success Stories', href: '/success-stories' },
      { name: 'Partnerships', href: '/partnerships' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

export function Footer() {
  return (
    <>
      <footer className="mt-0 border-t border-amber-500/40 bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 sm:pt-10 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
            {/* Company Info */}
            <div className="lg:col-span-1 lg:pr-6">
              <div className="mb-4 flex items-center space-x-2">
                <img
                  src="https://i.postimg.cc/dDPqTDcm/vialife.png"
                  alt="Vialife Logo"
                  className="h-8 w-8"
                />
                <span className="text-lg font-semibold tracking-wide">
  <span 
    onClick={() => window.location.href = '/login?admin=1&next=%2Fadmin'}
    className="cursor-pointer hover:text-white transition-colors duration-200"
    title="Click for admin access"
    aria-label="Admin login"
  >
    O
  </span>
  ur Academy
</span>
              </div>
              <p className="mb-5 text-sm leading-7 text-gray-300">
                We empower people worldwide through practical education in mental wellness, entrepreneurship,
                and personal growth.
              </p>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center space-x-2.5">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>academy@vialifecoach.org</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>support@vialifecoach.org</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>partnership@vialifecoach.org</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-300 transition-colors duration-200 hover:text-white"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Footer */}
          <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-gray-800 pt-6 md:flex-row md:items-center">
            <button
              onClick={() => window.location.href = '/lecturer-login?next=%2Flecturer'}
              className="text-sm text-gray-400 transition-colors duration-200 hover:text-white cursor-pointer"
              aria-label="Lecturer login"
              title="Click for lecturer access"
            >
              © 2026 Vialifecoach Academy. All rights reserved.
            </button>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <a
                href="/terms"
                className="text-sm text-gray-300 transition-colors duration-200 hover:text-white"
              >
                Terms of Service
              </a>
              <a
                href="/privacy"
                className="text-sm text-gray-300 transition-colors duration-200 hover:text-white"
              >
                Privacy Policy
              </a>
              <a
                href="/cookies"
                className="text-sm text-gray-300 transition-colors duration-200 hover:text-white"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
