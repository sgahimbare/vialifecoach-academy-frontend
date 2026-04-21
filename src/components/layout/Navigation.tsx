import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Users, Briefcase, User, Settings } from "lucide-react";

export function Navigation() {
  const location = useLocation();
  
  const navigation = [
    { name: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
    { name: "Courses", href: "/courses", icon: <BookOpen className="h-4 w-4" /> },
    { name: "Opportunities", href: "/application-portal", icon: <Briefcase className="h-4 w-4" /> },
    { name: "Community", href: "/community", icon: <Users className="h-4 w-4" /> },
  ];

  const adminNavigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <Home className="h-4 w-4" /> },
    { name: "Profile", href: "/profile", icon: <User className="h-4 w-4" /> },
    { name: "Settings", href: "/settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const currentPath = location.pathname;
  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {(isAdminRoute ? adminNavigation : navigation).map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                currentPath === item.href
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
