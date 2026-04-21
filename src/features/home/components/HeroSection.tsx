import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Award, BookOpen } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative bg-gradient-to-br from-accent/30 via-background to-accent/30 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-0 right-4 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-destructive rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                <Award className="h-4 w-4" />
                <span>Vialifecoach Academy</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight font-bahnschrift">
                Transform Lives<br />
                Build Your Mental Health
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Join a global community of transformative coaches mastering emotional intelligence, life coaching techniques, and human behavior insights through immersive learning experiences and practical applications.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="px-8 py-3 text-lg group" onClick={() => window.location.href = '/login'}>
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-foreground">17.5M+</div>
                  <div className="text-sm text-muted-foreground">Students Enrolled</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-foreground">180+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-foreground">26</div>
                  <div className="text-sm text-muted-foreground">Course Tracks</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="relative">
            <div className="relative bg-card text-card-foreground rounded-2xl shadow-2xl p-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground border-b pb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4"></span>
                </div>

                <div>
                  <img src="https://i.postimg.cc/90Qz1DDx/Vialifecoach.png" alt="Vialife Coach hero image" className="w-full rounded-lg" />
                </div>
                
                <div className="flex justify-center">
                <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-2 rounded-lg text-sm">
                    You only know the importance of starting when you have started, start now and achieve more
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-green-500 text-white p-4 rounded-xl shadow-lg">
              <Award className="h-6 w-6" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-purple-500 text-white p-4 rounded-xl shadow-lg">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
