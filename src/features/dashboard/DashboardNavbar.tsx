import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  BookOpen, 
  Menu, 
  Search,
  Home,
  Award,
  MessageCircle 
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardNavbarProps {
  onLogout?: () => void;
  userName?: string;
  userEmail?: string;
  notifications?: number;
}

export function DashboardNavbar({ 
  onLogout, 
  userName = "Student", 
  userEmail = "student@academy.com",
  notifications = 0 
}: DashboardNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl text-gray-900">
                  <span className="font-bold">DicetheLifeCoach</span>
                  <span className="font-normal text-gray-600 ml-1">Academy</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
              <BookOpen className="w-4 h-4 mr-2" />
              My Courses
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
              <Award className="w-4 h-4 mr-2" />
              Achievements
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
              <MessageCircle className="w-4 h-4 mr-2" />
              Community
            </Button>
          </div>

          {/* Right Side - Notifications and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Button - Hidden on small screens */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            >
              <Search className="w-4 h-4" />
            </Button>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            >
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {notifications > 9 ? '9+' : notifications}
                </Badge>
              )}
            </Button>

            {/* User Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300"
                >
                  <User className="h-4 w-4 text-blue-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-600 hover:text-blue-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                <Home className="w-4 h-4 mr-3" />
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                <BookOpen className="w-4 h-4 mr-3" />
                My Courses
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                <Award className="w-4 h-4 mr-3" />
                Achievements
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                <MessageCircle className="w-4 h-4 mr-3" />
                Community
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                <Search className="w-4 h-4 mr-3" />
                Search
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}