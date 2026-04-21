import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Award, 
  Settings, 
  User,
  LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function LecturerNav() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    {
      label: "Dashboard",
      href: "/lecturer",
      icon: Home,
    },
    {
      label: "Courses",
      href: "/lecturer/courses",
      icon: BookOpen,
    },
    {
      label: "Live Discussions",
      href: "/lecturer/live-discussions",
      icon: MessageSquare,
    },
    {
      label: "Community",
      href: "/lecturer/community",
      icon: Users,
    },
    {
      label: "Grading",
      href: "/lecturer/grading",
      icon: Award,
    },
    {
      label: "Profile",
      href: "/lecturer/profile",
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/lecturer") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="lecturer-nav">
      <ul className="lecturer-nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`lecturer-nav-link ${isActive(item.href) ? "active" : ""}`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      
      <div className="lecturer-nav-footer">
        <div className="lecturer-nav-user">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-cyan-600 flex items-center justify-center">
              <User className="h-4 w-4 text-cyan-100" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-cyan-100 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-cyan-300 truncate">
                Lecturer
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="lecturer-nav-logout"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
