import { Link, useLocation } from "react-router-dom";
import { Home, Users, BookOpen, Award, Settings } from "lucide-react";

export function ProgramNavigation() {
  const location = useLocation();
  
  const navigationItems = [
    {
      name: "Program Overview",
      href: "/program/women-refugee-rise",
      icon: <Home className="h-4 w-4" />
    },
    {
      name: "Mental Health",
      href: "/program/mental-health",
      icon: <Users className="h-4 w-4" />
    },
    {
      name: "Entrepreneurship",
      href: "/program/entrepreneurship",
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      name: "Virtual Assistant",
      href: "/program/virtual-assistant",
      icon: <Award className="h-4 w-4" />
    }
  ];

  return (
    <nav className="bg-white shadow-sm border border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                location.pathname === item.href
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
