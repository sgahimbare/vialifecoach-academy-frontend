import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-yellow-300 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Join millions of learners building in-demand skills. Get started
            today with our comprehensive mental wellness and coaching education.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Primary CTA */}
            <Button
              asChild
              size="lg"
              className="bg-background text-primary hover:bg-muted px-8 py-3 text-lg group font-semibold"
            >
              <Link to="/courses">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            {/* Secondary CTA */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-3 text-lg font-semibold"
            >
              <Link to="/community">
                <Users className="mr-2 h-5 w-5" />
                Join Community
              </Link>
            </Button>
          </div>

          <div className="mt-8 text-white text-sm">
            <p>Free to start • No credit card required • Instant access</p>
          </div>
        </div>
      </div>
    </section>
  );
}
