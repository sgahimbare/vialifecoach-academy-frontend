import { Card, CardContent } from '@/components/ui/card';
import {
  Network,
  Shield,
  Smartphone,
  Cloud,
  Code,
  Database,
  Monitor,
  Cpu,
} from 'lucide-react';
import type { FeatureCard } from '@/types';

const features: FeatureCard[] = [
  {
    icon: 'Network',
    title: 'Emotional Intelligence',
    description:
      'Master the basics of emotional intelligence with comprehensive courses on self-awareness, empathy, and relationship building.',
  },
  {
    icon: 'Shield',
    title: 'Mindset Mastery',
    description:
      'Learn to cultivate a growth mindset with courses on cognitive behavioral techniques and positive psychology.',
  },
  {
    icon: 'Smartphone',
    title: 'Life Coaching Techniques',
    description:
      'Explore proven coaching methodologies and frameworks for guiding clients through personal transformation.',
  },
  {
    icon: 'Cloud',
    title: 'Human Behavior Insights',
    description:
      'Understand human behavior patterns and motivations with evidence-based psychological principles.',
  },
  {
    icon: 'Code',
    title: 'Trauma-Informed Care',
    description:
      'Develop skills in trauma-sensitive approaches and healing-centered practices for holistic wellness.',
  },
  {
    icon: 'Database',
    title: 'Wellness Coaching',
    description:
      'Analyze and support holistic health through integrated approaches to physical, mental, and emotional well-being.',
  },
  {
    icon: 'Monitor',
    title: 'Professional Development',
    description:
      'Master coaching business skills, ethics, and client management essential for successful practitioners.',
  },
  {
    icon: 'Cpu',
    title: 'Evidence-Based Interventions',
    description:
      'Stay current with research-backed therapeutic techniques and emerging trends in mental health coaching.',
  },
];

const iconComponents = {
  Network,
  Shield,
  Smartphone,
  Cloud,
  Code,
  Database,
  Monitor,
  Cpu,
};

export function FeaturesSection() {
  return (
    <section className="bg-slate-100 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Comprehensive Mental Wellness & Coaching Education
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From understanding human behavior to mastering evidence-based interventions, our courses prepare you to support healing, growth, and meaningful change.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent =
              iconComponents[feature.icon as keyof typeof iconComponents];

            return (
              <Card
                key={index}
                className="group border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10 group-hover:bg-primary transition-colors duration-300">
                      <IconComponent className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
