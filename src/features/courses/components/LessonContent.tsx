import { motion } from 'motion/react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { CheckCircle, Play, FileText, HelpCircle, PenTool, Clock, ArrowRight } from 'lucide-react';
import { VideoPlayer } from '../components/VideoPlayer';
import type { Lesson, Course } from '../../../types/course';

interface LessonContentProps {
  lesson: Lesson;
  course: Course;
  isCompleted: boolean;
  onMarkComplete: () => void;
  onNextLesson: () => void;
  hasNextLesson: boolean;
}

export function LessonContent({ 
  lesson, 
  course, 
  isCompleted, 
  onMarkComplete, 
  onNextLesson, 
  hasNextLesson 
}: LessonContentProps) {
  
  // Helper functions for video content
  const getVideoUrl = (lessonId: string): string => {
    // In a real app, this would fetch actual video URLs
    return 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';
  };

  const getSubtitles = (lessonId: string) => {
    // Sample subtitles - in a real app, these would come from your CMS
    return [
      { start: 0, end: 5, text: 'Welcome to this lesson on ' + lesson.title },
      { start: 5, end: 10, text: 'In this video, we will explore key concepts and practical applications.' },
      { start: 10, end: 15, text: 'Let\'s begin by understanding the fundamental principles.' },
      { start: 15, end: 20, text: 'Take notes as we progress through each section.' },
      { start: 20, end: 25, text: 'Feel free to pause and rewind as needed.' }
    ];
  };

  const getReadingContent = (lesson: Lesson, course: Course) => {
    // Generate comprehensive reading content based on course category
    const courseCategory = getCourseCategory(course.title);
    const baseContent = lesson.content || '';
    
    switch (courseCategory) {
      case 'personal-development':
        return (
          <div className="space-y-4">
            <p className="leading-relaxed">
              {baseContent || `In the field of personal development and life coaching, ${lesson.title.toLowerCase()} represents a fundamental skill that every coach must master. This approach involves understanding the psychological and emotional dynamics that drive human behavior and motivation.`}
            </p>
            <p className="leading-relaxed">
              When working with clients in personal transformation, it's essential to create a safe space where individuals feel comfortable exploring their deepest aspirations and challenges. The coaching relationship is built on trust, empathy, and the coach's ability to guide without judgment.
            </p>
            <h4>Practical Application</h4>
            <p className="leading-relaxed">
              Consider how this concept applies to real-world coaching scenarios. Whether you're helping someone overcome limiting beliefs, set meaningful goals, or navigate life transitions, the principles discussed here will serve as your foundation.
            </p>
          </div>
        );
      
      case 'leadership':
        return (
          <div className="space-y-4">
            <p className="leading-relaxed">
              {baseContent || `Leadership development and success mentorship require a deep understanding of ${lesson.title.toLowerCase()} as it relates to organizational dynamics and team performance. Effective leaders must balance vision with execution, inspiration with accountability.`}
            </p>
            <p className="leading-relaxed">
              In today's rapidly changing business environment, leaders must be adaptable, emotionally intelligent, and capable of fostering innovation within their teams. The mentorship aspect involves not just guiding direct reports, but developing future leaders throughout the organization.
            </p>
            <h4>Strategic Implementation</h4>
            <p className="leading-relaxed">
              The concepts presented here can be immediately applied in your leadership context. Consider your current challenges and how these principles might reshape your approach to team management and organizational influence.
            </p>
          </div>
        );
      
      case 'speaking':
        return (
          <div className="space-y-4">
            <p className="leading-relaxed">
              {baseContent || `Motivational speaking and content creation demand mastery of ${lesson.title.toLowerCase()} to effectively connect with and inspire audiences. The art of persuasion combines storytelling, emotional intelligence, and authentic delivery.`}
            </p>
            <p className="leading-relaxed">
              Modern content creation requires understanding both traditional oratory skills and digital platforms. Your message must resonate across different mediums while maintaining authenticity and impact. The key is finding your unique voice and learning to adapt it for various audiences and contexts.
            </p>
            <h4>Content Strategy</h4>
            <p className="leading-relaxed">
              Whether you're speaking to a live audience or creating digital content, the principles discussed here will help you craft messages that not only inform but transform. Consider how you can apply these concepts to your current or future content initiatives.
            </p>
          </div>
        );
      
      case 'corporate':
        return (
          <div className="space-y-4">
            <p className="leading-relaxed">
              {baseContent || `Corporate wellness and staff development programs must address ${lesson.title.toLowerCase()} as part of a comprehensive approach to organizational health. This involves understanding the interconnection between employee wellbeing and business performance.`}
            </p>
            <p className="leading-relaxed">
              Successful wellness initiatives require buy-in from leadership, measurable outcomes, and sustainable implementation strategies. The goal is to create a culture where employee wellbeing is valued not just as a benefit, but as a strategic advantage.
            </p>
            <h4>Implementation Framework</h4>
            <p className="leading-relaxed">
              The strategies outlined here provide a roadmap for developing and implementing effective wellness programs. Consider how you might adapt these concepts to your organization's unique culture and needs.
            </p>
          </div>
        );
      
      case 'youth':
        return (
          <div className="space-y-4">
            <p className="leading-relaxed">
              {baseContent || `Youth and student development requires specialized understanding of ${lesson.title.toLowerCase()} as it applies to different developmental stages and learning styles. Young people face unique challenges that require tailored approaches to guidance and support.`}
            </p>
            <p className="leading-relaxed">
              Working with youth involves recognizing their potential while respecting their autonomy. The goal is to provide guidance that empowers rather than directs, fostering independence and critical thinking skills that will serve them throughout their lives.
            </p>
            <h4>Age-Appropriate Strategies</h4>
            <p className="leading-relaxed">
              The techniques discussed here are specifically designed for youth engagement. Consider how developmental psychology informs the application of these concepts in educational and mentoring contexts.
            </p>
          </div>
        );
      
      default:
        return (
          <p className="text-muted-foreground leading-relaxed">
            {baseContent || `This lesson explores important concepts about ${lesson.title.toLowerCase()}. You'll discover practical applications and develop skills essential for your professional development.`}
          </p>
        );
    }
  };

  const getCourseCategory = (courseTitle: string): string => {
    if (courseTitle.includes('Personal Development') || courseTitle.includes('Life Coaching')) {
      return 'personal-development';
    }
    if (courseTitle.includes('Leadership') || courseTitle.includes('Success')) {
      return 'leadership';
    }
    if (courseTitle.includes('Motivational') || courseTitle.includes('Speaking')) {
      return 'speaking';
    }
    if (courseTitle.includes('Corporate') || courseTitle.includes('Wellness')) {
      return 'corporate';
    }
    if (courseTitle.includes('Youth') || courseTitle.includes('Student')) {
      return 'youth';
    }
    return 'general';
  };

  const getLearningObjectives = (lesson: Lesson, course: Course): string[] => {
    const courseCategory = getCourseCategory(course.title);
    
    switch (courseCategory) {
      case 'personal-development':
        return [
          'Master foundational coaching principles and techniques',
          'Develop empathetic listening and questioning skills',
          'Learn to facilitate client self-discovery and goal setting',
          'Understand ethical boundaries in coaching relationships'
        ];
      case 'leadership':
        return [
          'Develop strategic thinking and vision-setting capabilities',
          'Master team dynamics and conflict resolution',
          'Learn to mentor and develop emerging leaders',
          'Build authentic leadership presence and influence'
        ];
      case 'speaking':
        return [
          'Craft compelling narratives that inspire action',
          'Develop confident delivery and stage presence',
          'Learn to adapt content for different audiences',
          'Master digital content creation and distribution'
        ];
      case 'corporate':
        return [
          'Design evidence-based wellness program frameworks',
          'Measure and evaluate program effectiveness',
          'Build organizational support for wellness initiatives',
          'Address diverse employee needs and preferences'
        ];
      case 'youth':
        return [
          'Understand developmental psychology and learning styles',
          'Build trust and rapport with young people',
          'Develop age-appropriate guidance techniques',
          'Foster independence and critical thinking skills'
        ];
      default:
        return [
          'Understand core concepts and principles',
          'Apply knowledge to real-world scenarios',
          'Develop practical implementation skills'
        ];
    }
  };
  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'reading': return 'bg-green-100 text-green-800';
      case 'quiz': return 'bg-purple-100 text-purple-800';
      case 'assignment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'reading': return <FileText className="w-4 h-4" />;
      case 'quiz': return <HelpCircle className="w-4 h-4" />;
      case 'assignment': return <PenTool className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const renderLessonContent = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <div className="space-y-6">
            <VideoPlayer
              src={getVideoUrl(lesson.id)}
              title={lesson.title}
              subtitles={getSubtitles(lesson.id)}
              onProgress={(progress: number) => {
                if (progress > 80) {
                  onMarkComplete();
                }
              }}
              onComplete={onMarkComplete}
            />
            {lesson.content && (
              <div className="prose max-w-none">
                <p className="text-muted-foreground">{lesson.content}</p>
              </div>
            )}
          </div>
        );
      
      case 'reading':
        return (
          <div className="space-y-6">
            <div className="prose max-w-none">
              {getReadingContent(lesson, course)}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">
                      <strong>Key Learning Objectives:</strong>
                    </p>
                    <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
                      {getLearningObjectives(lesson, course).map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'quiz':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="text-center">
                <HelpCircle className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                <h3 className="mb-2">Knowledge Check</h3>
                <p className="text-muted-foreground mb-4">
                  Test your understanding of the concepts covered in this module.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Start Quiz
                </Button>
              </div>
            </Card>
          </div>
        );
      
      case 'assignment':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="text-center">
                <PenTool className="w-16 h-16 mx-auto mb-4 text-orange-600" />
                <h3 className="mb-2">Practical Assignment</h3>
                <p className="text-muted-foreground mb-4">
                  Apply what you've learned through this hands-on exercise.
                </p>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  View Assignment
                </Button>
              </div>
            </Card>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Content for this lesson is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Lesson Header */}
          <div className="border-b border-border pb-6">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={getLessonTypeColor(lesson.type)}>
                {getLessonIcon(lesson.type)}
                <span className="ml-1 capitalize">{lesson.type}</span>
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {lesson.duration}
              </div>
              {isCompleted && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
            
            <h1 className="mb-4">{lesson.title}</h1>
            
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Part of: {course.title}
              </p>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="min-h-[400px]">
            {renderLessonContent()}
          </div>

          {/* Lesson Actions */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {!isCompleted && (
                  <Button onClick={onMarkComplete} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </Button>
                )}
                {isCompleted && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Lesson Completed</span>
                  </div>
                )}
              </div>
              
              {hasNextLesson && (
                <Button onClick={onNextLesson} variant="outline">
                  Next Lesson
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}