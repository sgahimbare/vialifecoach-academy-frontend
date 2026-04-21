import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Video, 
  Dumbbell,
  CheckCircle,
  Lock,
  Trophy,
  Star,
  Volume2,
  Maximize,
  Settings,
  Clock,
  Type,
  Palette,
  Bookmark,
  Printer
} from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  content: string;
  lesson_type: 'video' | 'reading' | 'exercise';
  order: number;
  completed: boolean;
  locked: boolean;
  media_urls?: string[];
}

interface Module {
  id: number;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
  completed: boolean;
  locked: boolean;
  quiz_required?: boolean;
  quiz_completed?: boolean;
  min_pass_percentage?: number;
}

interface CourseProgress {
  total_lessons: number;
  completed_lessons: number;
  current_lesson: number;
  current_module: number;
  overall_progress: number;
}

export default function CoursePlayerPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQuizGate, setShowQuizGate] = useState(false);
  
  // Enhanced visibility state variables
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [readingProgress, setReadingProgress] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentModule = modules[currentModuleIndex];
  const currentLesson = currentModule?.lessons[currentLessonIndex];

  useEffect(() => {
    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);

  useEffect(() => {
    if (currentLesson && videoRef.current) {
      if (currentLesson.lesson_type === 'video') {
        videoRef.current.addEventListener('timeupdate', handleVideoProgress);
        videoRef.current.addEventListener('ended', handleVideoEnded);
      }
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleVideoProgress);
        videoRef.current.removeEventListener('ended', handleVideoEnded);
      }
    };
  }, [currentLesson]);

  async function loadCourseData() {
    try {
      setLoading(true);
      
      // Load course overview
      const courseResponse = await fetch(`/api/v1/courses/${courseId}/overview`);
      const courseData = await courseResponse.json();
      if (courseData.success) {
        setCourse(courseData.data);
      }

      // Load modules with lessons
      const modulesResponse = await fetch(`/api/v1/courses/${courseId}/modules-with-lessons`);
      const modulesData = await modulesResponse.json();
      if (modulesData.success) {
        setModules(modulesData.data);
      }

      // Load progress
      const progressResponse = await fetch(`/api/v1/student/courses/${courseId}/progress`);
      const progressData = await progressResponse.json();
      if (progressData.success) {
        setProgress(progressData.data);
        setCurrentModuleIndex(progressData.data.current_module);
        setCurrentLessonIndex(progressData.data.current_lesson);
      }
    } catch (err) {
      console.error('Error loading course data:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleVideoProgress() {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress);
    }
  }

  function handleVideoEnded() {
    completeLesson();
  }

  async function completeLesson() {
    if (!currentLesson) return;

    try {
      const response = await fetch(`/api/v1/student/lessons/${currentLesson.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        // Update local state
        const updatedModules = [...modules];
        updatedModules[currentModuleIndex].lessons[currentLessonIndex].completed = true;
        setModules(updatedModules);

        // Show celebration
        showCompletionCelebration();

        // Check if module is complete
        const moduleLessons = updatedModules[currentModuleIndex].lessons;
        const allLessonsComplete = moduleLessons.every(lesson => lesson.completed);
        
        if (allLessonsComplete) {
          updatedModules[currentModuleIndex].completed = true;
          
          // Check if quiz is required
          if (currentModule.quiz_required && !currentModule.quiz_completed) {
            setShowQuizGate(true);
            return;
          }
        }

        // Auto-advance to next lesson
        setTimeout(() => {
          goToNextLesson();
        }, 3000);
      }
    } catch (err) {
      console.error('Error completing lesson:', err);
    }
  }

  function showCompletionCelebration() {
    setShowCelebration(true);
    
    // Play celebration sound (if available)
    const audio = new Audio('/sounds/celebration.mp3');
    audio.play().catch(() => {
      // Ignore if audio fails to play
    });

    // Hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  }

  function goToNextLesson() {
    if (!currentModule) return;

    // Try next lesson in current module
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else {
      // Try next module
      if (currentModuleIndex < modules.length - 1) {
        const nextModule = modules[currentModuleIndex + 1];
        if (!nextModule.locked) {
          setCurrentModuleIndex(currentModuleIndex + 1);
          setCurrentLessonIndex(0);
        }
      }
    }
  }

  function goToPreviousLesson() {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      const prevModule = modules[currentModuleIndex - 1];
      setCurrentLessonIndex(prevModule.lessons.length - 1);
    }
  }

  function selectLesson(moduleIndex: number, lessonIndex: number) {
    const module = modules[moduleIndex];
    const lesson = module.lessons[lessonIndex];
    
    if (!lesson.locked) {
      setCurrentModuleIndex(moduleIndex);
      setCurrentLessonIndex(lessonIndex);
    }
  }

  // Enhanced visibility functions
  const calculateWordCount = (content: string): number => {
    if (!content) return 0;
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const calculateReadingTime = (content: string): number => {
    const words = calculateWordCount(content);
    return Math.ceil(words / 200); // Average reading speed: 200 words per minute
  };

  const toggleFontSize = () => {
    setFontSize(prev => {
      const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
      const currentIndex = sizes.indexOf(prev);
      return sizes[(currentIndex + 1) % sizes.length];
    });
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const themes: Array<'light' | 'sepia' | 'dark'> = ['light', 'sepia', 'dark'];
      const currentIndex = themes.indexOf(prev);
      return themes[(currentIndex + 1) % themes.length];
    });
  };

  const enhanceContentVisibility = (content: string): string => {
    if (!content) return '';
    
    // Enhanced markdown to HTML conversion with MAXIMUM visibility
    return content
      // Headers with much better visibility
      .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-bold text-black mt-8 mb-4 border-b-4 border-blue-600 pb-3 bg-yellow-50 px-4 py-2 rounded-lg">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold text-black mt-10 mb-6 border-b-4 border-blue-700 pb-4 bg-blue-50 px-6 py-3 rounded-lg shadow-md">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-black text-black mt-12 mb-8 border-b-4 border-blue-800 pb-6 bg-gradient-to-r from-blue-100 to-purple-100 px-8 py-4 rounded-xl shadow-lg">$1</h1>')
      
      // Bold text with MAXIMUM visibility - large background and strong text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-black text-xl bg-yellow-300 px-4 py-2 rounded-lg border-2 border-yellow-500 shadow-md block my-3">$1</strong>')
      
      // Italic text with better visibility
      .replace(/\*(.*?)\*/g, '<em class="italic text-black text-lg bg-blue-100 px-3 py-1 rounded-md border border-blue-300 inline-block">$1</em>')
      
      // Underline text with better visibility
      .replace(/<u>(.*?)<\/u>/g, '<u class="underline decoration-4 decoration-red-500 text-black text-lg font-bold bg-red-50 px-3 py-1 rounded-md">$1</u>')
      
      // Lists with MAXIMUM visibility
      .replace(/^- (.*$)/gm, '<li class="ml-6 mb-4 text-black text-lg font-medium flex items-start bg-green-50 p-3 rounded-lg border-2 border-green-300"><span class="inline-block w-4 h-4 bg-green-600 rounded-full mr-3 mt-1 flex-shrink-0 shadow-sm"></span><span class="flex-1">$1</span></li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-6 mb-4 text-black text-lg font-bold flex items-start bg-purple-50 p-3 rounded-lg border-2 border-purple-300"><span class="inline-block w-8 h-8 bg-purple-600 text-white rounded-full mr-3 mt-1 flex-shrink-0 text-center font-black shadow-sm flex items-center justify-center">$1.</span><span class="flex-1">$2</span></li>')
      
      // Paragraphs with MAXIMUM visibility
      .replace(/\n\n/g, '</p><p class="mb-6 leading-loose text-black text-base font-medium bg-white p-4 rounded-lg border-2 border-gray-300 shadow-sm">')
      
      // Line breaks with better spacing
      .replace(/\n/g, '<br class="block mb-3">')
      
      // Links with MAXIMUM visibility
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-700 hover:text-blue-900 underline decoration-4 hover:decoration-blue-700 transition-colors text-lg font-bold bg-blue-100 px-4 py-2 rounded-lg border-2 border-blue-300 inline-block shadow-sm" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Code blocks with MAXIMUM visibility
      .replace(/`([^`]+)`/g, '<code class="bg-gray-800 text-white px-4 py-2 rounded-lg text-lg font-mono border-2 border-gray-600 shadow-md inline-block">$1</code>')
      
      // Blockquotes with MAXIMUM visibility
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-8 border-orange-500 pl-6 py-4 mb-6 bg-orange-50 text-black text-lg font-medium rounded-r-lg border-2 border-orange-300 shadow-md">$1</blockquote>')
      
      // Highlight important text with MAXIMUM visibility
      .replace(/!!(.*?)!!/g, '<mark class="bg-gradient-to-r from-yellow-300 to-yellow-400 text-black text-xl font-black px-6 py-3 rounded-lg border-2 border-yellow-600 shadow-lg block my-4 text-center">$1</mark>')
      
      // Regular text - make sure all text is visible
      .replace(/^(?!<h[1-6]|<li|<p|<blockquote|<code|<a|<mark|<br|<\/)/gm, '<p class="text-black text-lg font-medium mb-4 leading-relaxed">');
  };

  const getFontSizeClass = (): string => {
    switch (fontSize) {
      case 'small': return 'text-lg'; // Changed from text-sm to text-lg
      case 'large': return 'text-2xl'; // Changed from text-lg to text-2xl
      default: return 'text-xl'; // Changed from text-base to text-xl
    }
  };

  const getThemeClass = (): string => {
    switch (theme) {
      case 'sepia': return 'bg-amber-100 text-black'; // Changed to make text more visible
      case 'dark': return 'bg-gray-800 text-white'; // Changed to make text more visible
      default: return 'bg-white text-black'; // Changed to make text more visible
    }
  };

  const fontSizeClass = getFontSizeClass();
  const themeClass = getThemeClass();

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // TODO: Save bookmark to backend
  };

  const handlePrint = () => {
    window.print();
  };

  // Simulate reading progress based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function renderLessonContent() {
    if (!currentLesson) return null;

    switch (currentLesson.lesson_type) {
      case 'video':
        return (
          <div className="bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full aspect-video"
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={currentLesson.media_urls?.[0]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Custom Video Controls */}
            <div className="bg-gray-900 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => videoRef.current?.play()}
                    className="p-2 text-white hover:bg-gray-800 rounded"
                  >
                    <Play className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => videoRef.current?.pause()}
                    className="p-2 text-white hover:bg-gray-800 rounded"
                  >
                    <Pause className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-white hover:bg-gray-800 rounded">
                    <Volume2 className="h-5 w-5" />
                  </button>
                  <span className="text-white text-sm">
                    {Math.floor(videoProgress)}% Complete
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-white hover:bg-gray-800 rounded">
                    <Settings className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-white hover:bg-gray-800 rounded">
                    <Maximize className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${videoProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        );

      case 'reading':
        return (
          <div className="max-w-none">
            <div className="bg-white rounded-xl border-4 border-black shadow-lg overflow-hidden">
              {/* Lesson Header */}
              <div className="bg-gradient-to-r from-yellow-300 to-orange-300 px-8 py-6 border-b-4 border-black">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-black mb-2">{currentLesson.title}</h2>
                    <div className="flex items-center gap-4 text-lg font-black text-black">
                      <span className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-full">
                        <BookOpen className="h-6 w-6 text-black" />
                        Reading Lesson
                      </span>
                      <span className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-full">
                        <Clock className="h-6 w-6 text-black" />
                        {calculateReadingTime(currentLesson.content)} min read
                      </span>
                      <span className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-full">
                        <Type className="h-6 w-6 text-black" />
                        {calculateWordCount(currentLesson.content)} words
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* SUPER SIMPLIFIED CONTENT AREA */}
              <div className="p-8 bg-white">
                {/* DEBUG INFO */}
                <div className="mb-6 p-4 bg-red-500 border-4 border-black rounded-lg">
                  <h3 className="text-2xl font-black text-white mb-2">DEBUG INFO:</h3>
                  <div className="text-white text-xl font-black">
                    <p>Current Lesson: {currentLesson?.title || 'NO TITLE'}</p>
                    <p>Content Length: {currentLesson?.content?.length || 0} characters</p>
                    <p>Content Type: {typeof currentLesson?.content}</p>
                  </div>
                </div>
                
                {/* RAW CONTENT DISPLAY */}
                <div className="mb-6 p-6 bg-yellow-400 border-4 border-black rounded-lg">
                  <h3 className="text-2xl font-black text-black mb-4">RAW LESSON CONTENT:</h3>
                  <div className="text-2xl font-black text-black bg-white p-4 border-2 border-black rounded">
                    {currentLesson?.content || 'NO CONTENT FOUND - LESSON IS EMPTY'}
                  </div>
                </div>
                
                {/* SUPER SIMPLE CONTENT DISPLAY */}
                <div className="p-6 bg-green-400 border-4 border-black rounded-lg">
                  <h3 className="text-2xl font-black text-black mb-4">SIMPLE CONTENT DISPLAY:</h3>
                  <div className="text-3xl font-black text-black bg-white p-6 border-2 border-black rounded leading-loose">
                    {currentLesson?.content ? (
                      <div>
                        {currentLesson.content.split('\n').map((line, index) => (
                          <p key={index} className="mb-4 text-black">{line || 'EMPTY LINE'}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-black">❌ NO CONTENT TO DISPLAY - LESSON IS EMPTY</p>
                    )}
                  </div>
                </div>
                
                {/* TEST CONTENT */}
                <div className="mt-6 p-6 bg-blue-400 border-4 border-black rounded-lg">
                  <h3 className="text-2xl font-black text-white mb-4">TEST CONTENT (Should always be visible):</h3>
                  <div className="text-3xl font-black text-white">
                    <p>✅ This text should be visible</p>
                    <p>✅ If you can see this, the display is working</p>
                    <p>✅ The issue is with the lesson content data</p>
                  </div>
                </div>
                
                {/* EMBEDDED COURSE IFRAME */}
                <div className="mt-6">
                  <h3 className="text-xl font-black text-gray-800 mb-4">🎓 Featured Interactive Courses</h3>
                  <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
                    {/* FIRST COURSE */}
                    <article className="overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 border border-gray-200 bg-white shadow-lg hover:shadow-xl">
                      {/* Course Thumbnail - Professional Image */}
                      <div 
                        className="h-44 w-full relative cursor-pointer group"
                        onClick={() => window.open('https://my.coursebox.ai/courses/216034/about', '_blank')}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
                          alt="Premium Coursebox Course"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Overlay with play button */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/90 rounded-full p-3 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                              <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-white text-sm font-semibold">Click to open course</p>
                          </div>
                        </div>
                        {/* Course badge overlay */}
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-purple-600 text-white shadow-lg">
                            Interactive Course
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-800">
                          Interactive Course
                        </span>
                        <h4 className="mt-3 line-clamp-2 text-lg font-semibold text-gray-900">The Confidence Code: Building Unstoppable Self-Belief</h4>
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                          Access our premium interactive course content with advanced features and certification.
                        </p>
                        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                          <span>Self-paced</span>
                          <span>Certificate</span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => window.open('https://my.coursebox.ai/courses/216034/about', '_blank')}
                            className="flex-1 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                          >
                            View Course
                          </button>
                          <button
                            onClick={() => window.open('https://my.coursebox.ai/courses/216034/about', '_blank')}
                            className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors"
                            title="Open in new tab"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </article>

                    {/* SECOND COURSE - EMBEDDED IFRAME */}
                    <article className="overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 border border-gray-200 bg-white shadow-lg hover:shadow-xl">
                      {/* Course Thumbnail - Professional Image */}
                      <div 
                        className="h-44 w-full relative cursor-pointer group"
                        onClick={() => window.open('https://my.coursebox.ai/courses/216047/about', '_blank')}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
                          alt="Recognizing and Overcoming Manipulative Relationships"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Overlay with play button */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/90 rounded-full p-3 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                              <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-white text-sm font-semibold">Click to open course</p>
                          </div>
                        </div>
                        {/* Course badge overlay */}
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-blue-600 text-white shadow-lg">
                            Relationship Course
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800">
                          Relationship Course
                        </span>
                        <h4 className="mt-3 line-clamp-2 text-lg font-semibold text-gray-900">Recognizing and Overcoming Manipulative Relationships</h4>
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                          Learn to identify and navigate complex relationship dynamics with confidence and clarity.
                        </p>
                        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                          <span>Self-paced</span>
                          <span>Certificate</span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => window.open('https://my.coursebox.ai/courses/216047/about', '_blank')}
                            className="flex-1 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                          >
                            View Course
                          </button>
                          <button
                            onClick={() => window.open('https://my.coursebox.ai/courses/216047/about', '_blank')}
                            className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                            title="Open in new tab"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
                
                {/* Lesson Actions */}
                <div className="mt-8 p-4 bg-gray-200 border-4 border-black">
                  <button
                    onClick={completeLesson}
                    className="px-8 py-4 bg-green-600 text-white text-xl font-black border-4 border-black rounded-lg hover:bg-green-700"
                  >
                    ✅ MARK AS COMPLETE
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'exercise':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h3 className="text-xl font-semibold mb-6">Practice Exercise</h3>
            <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
            <button
              onClick={completeLesson}
              className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Complete Exercise
            </button>
          </div>
        );

      default:
        return <div>Content not available</div>;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#EEF4FF] via-[#F7FAFF] to-[#F5F7FB]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/courses/${courseId}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#D8E4FB] rounded-lg text-[#5D6B82] hover:text-[#1F4E8C] hover:border-[#1F4E8C] hover:shadow-md transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course
          </Link>

          <div className="mt-6">
            <h1 className="text-4xl font-bold text-[#102347] mb-3">{course?.title}</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#1F4E8C] rounded-full"></div>
              <p className="text-xl text-[#5D6B82]">Course Player</p>
              <div className="w-2 h-2 bg-[#1F4E8C] rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 h-full">
          {/* Left Sidebar - Modules List */}
          <div className="lg:col-span-1 h-full">
            <div className="bg-white rounded-2xl border border-[#D8E4FB] shadow-lg p-6 h-full flex flex-col">
              <h2 className="text-lg font-bold text-[#102347] mb-4">Modules</h2>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {modules.map((module, moduleIndex) => (
                  <button
                    key={module.id}
                    onClick={() => setCurrentModuleIndex(moduleIndex)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                      moduleIndex === currentModuleIndex
                        ? 'border-[#1F4E8C] bg-[#EEF4FF] shadow-md'
                        : 'border-[#E6ECF5] hover:border-[#1F4E8C] hover:bg-[#FAFBFE]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        moduleIndex === currentModuleIndex
                          ? 'bg-[#1F4E8C] text-white'
                          : 'bg-[#E6ECF5] text-[#5D6B82]'
                      }`}>
                        {module.order}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#102347] truncate">
                          {module.title}
                        </h3>
                        <p className="text-xs text-[#5D6B82]">
                          {module.lessons.length} lessons
                        </p>
                      </div>
                      {module.completed && (
                        <div className="text-green-500">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
                
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={goToPreviousLesson}
                    disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={goToNextLesson}
                    disabled={!currentLesson || currentLesson.locked}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                
                {!currentLesson?.completed && !currentLesson?.locked && (
                  <button
                    onClick={completeLesson}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mt-4"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            {currentLesson ? (
              renderLessonContent()
            ) : (
              <div className="text-center py-12">
                <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Lesson Locked</h3>
                <p className="text-gray-600">Complete previous lessons to unlock this content.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
