import { TrendingUp, Users, Globe, Award } from 'lucide-react';

const stats = [
  {
    icon: Users,
    number: '17.5M+',
    label: 'Students Worldwide',
    description: 'Active learners in our global community',
  },
  {
    icon: Globe,
    number: '180+',
    label: 'Countries',
    description: 'Represented in our network',
  },
  {
    icon: Award,
    number: '2.8M+',
    label: 'Certificates Issued',
    description: 'Industry-recognized credentials earned',
  },
  {
    icon: TrendingUp,
    number: '89%',
    label: 'Job Placement Rate',
    description: 'Graduates employed within 6 months',
  },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Trusted by Millions Worldwide
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Join the largest network of technology learners and educators, 
            building skills that power the digital world.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;

            return (
              <div key={index} className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>

                <div className="text-4xl font-bold mb-2">
                  {stat.number}
                </div>

                <div className="text-xl font-semibold text-primary-foreground/90 mb-2">
                  {stat.label}
                </div>

                <p className="text-primary-foreground/70 text-sm">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
