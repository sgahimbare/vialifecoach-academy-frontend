import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Layers, 
  Plus, 
  Edit, 
  Trash2, 
  Video, 
  BookOpen, 
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Save,
  X,
  Image as ImageIcon,
  FileText,
  Play,
  Users,
  TrendingUp,
  Clock,
  Target,
  Settings,
  BarChart3,
  Award,
  Lock,
  Unlock,
  CheckCircle,
  Circle,
  Upload
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { apiRequest } from "@/lib/api";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  category_id?: number;
  thumbnail_url: string;
  published: boolean;
  instructor_id?: number;
  created_at?: string;
  updated_at?: string;
  modules_count?: number;
  lessons_count?: number;
  total_students?: number;
  average_progress?: number;
}

interface Module {
  id: number;
  title: string;
  description?: string;
  order: number;
  published: boolean;
  lessons_count: number;
  quiz_required?: boolean;
  min_pass_percentage?: number;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  content: string;
  lesson_type: 'video' | 'reading' | 'exercise';
  order: number;
  published: boolean;
  media_urls?: string[];
  video_url?: string;
  image_urls?: string[];
  completed?: boolean;
  locked?: boolean;
  sub_lessons?: Array<{
    id: number;
    title: string;
    body?: string;
    order_index?: number;
  }>;
}

interface CourseAnalytics {
  total_enrollments: number;
  active_students: number;
  completion_rate: number;
  average_time_to_complete: number;
  quiz_performance: number;
  engagement_score: number;
}

export default function UnifiedCourseManagementPage() {
  const courseId = useParams<{ courseId: string }>().courseId;

  // Debug: Log the courseId parameter
  console.log('URL courseId parameter:', courseId);
  console.log('Parsed courseId:', courseId ? parseInt(courseId) : 'null');
  
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [analytics, setAnalytics] = useState<CourseAnalytics | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedLessonDetails, setSelectedLessonDetails] = useState<Record<string, unknown> | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingCourse, setEditingCourse] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [courseImageFile, setCourseImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingCourse, setSavingCourse] = useState(false); // Add saving state
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'content' | 'analytics' | 'settings'>('overview');
  const [showCelebration, setShowCelebration] = useState(false);

  const [editorActiveTab, setEditorActiveTab] = useState<'reading' | 'practice' | 'video'>('reading');
  const [editorReadingIndex, setEditorReadingIndex] = useState(0);
  const [editorPracticeIndex, setEditorPracticeIndex] = useState(0);
  const [editorSubIndex, setEditorSubIndex] = useState(0);
  const [editorDraft, setEditorDraft] = useState<{ reading: EditorSection[]; practice: EditorSection[] }>({
    reading: [],
    practice: []
  });

  type EditorSection = {
    title: string;
    body: string;
    colon: boolean;
  };

  const READING_SECTION_TITLES = [
    "Lesson Overview",
    "Lesson Outcomes",
    "Definition",
    "How It Works",
    "Deepening the Idea",
    "Common Obstacles",
    "Real Life Example",
    "Practice Plan",
    "Reflection and Faith",
    "Commitment",
    "Common Mistakes and Fixes",
    "Scripture Focus",
    "Affirmation"
  ];

  const PRACTICE_SECTION_TITLES = [
    "Practice Steps",
    "Reflection Questions",
    "Weekly Challenge Checklist",
    "Common Mistakes",
    "Weekly Challenge",
    "Coaching Questions",
    "Application Prompt"
  ];

  const PRACTICE_SECTION_TITLES_WITH_COLON = new Set([
    "Practice Steps",
    "Reflection Questions",
    "Weekly Challenge Checklist",
    "Common Mistakes"
  ]);

  function splitBlocks(content: string) {
    return String(content || "").split(/\n{2,}/).filter(Boolean);
  }

  function parseReadingSections(content: string): EditorSection[] {
    const blocks = splitBlocks(content);
    const sections: EditorSection[] = [];
    let current: EditorSection | null = null;

    blocks.forEach((block) => {
      const lines = block.split("\n");
      const firstLine = (lines[0] || "").trim();
      const normalized = firstLine.replace(/:$/, "");
      const isPractice = PRACTICE_SECTION_TITLES.includes(normalized);
      const isReadingHeading = READING_SECTION_TITLES.includes(normalized);

      if (isPractice) {
        current = null;
        return;
      }

      if (isReadingHeading) {
        const rawBody = lines.slice(1).join("\n").trim();
        const body = rawBody.includes("<") ? rawBody : plainToHtml(rawBody);
        current = {
          title: normalized,
          colon: firstLine.endsWith(":"),
          body
        };
        sections.push(current);
        return;
      }

      if (!current) {
        const rawBody = block.trim();
        current = {
          title: "Reading Notes",
          colon: false,
          body: rawBody.includes("<") ? rawBody : plainToHtml(rawBody)
        };
        sections.push(current);
        return;
      }

      const merged = [htmlToPlain(current.body), block.trim()].filter(Boolean).join("\n\n");
      current.body = merged.includes("<") ? merged : plainToHtml(merged);
  });

    if (!sections.length) {
      sections.push({ title: "Lesson Overview", colon: false, body: "" });
    }
    return sections;
  }

  function parsePracticeSections(content: string): EditorSection[] {
    const blocks = splitBlocks(content);
    const sections: EditorSection[] = [];

    blocks.forEach((block) => {
      const lines = block.split("\n");
      const firstLine = (lines[0] || "").trim();
      const normalized = firstLine.replace(/:$/, "");
      if (!PRACTICE_SECTION_TITLES.includes(normalized)) return;

      const rawBody = lines.slice(1).join("\n").trim();
      sections.push({
        title: normalized,
        colon: firstLine.endsWith(":") || PRACTICE_SECTION_TITLES_WITH_COLON.has(normalized),
        body: rawBody.includes("<") ? rawBody : plainToHtml(rawBody)
      });
    });

    return sections;
  }

  function buildLessonContent(reading: EditorSection[], practice: EditorSection[]) {
    const sections = [...reading, ...practice]
      .map((section) => {
        const heading = `${section.title}${section.colon ? ":" : ""}`;
        const bodyText = String(section.body || "").trim();
        if (!bodyText.trim()) return heading;
        return `${heading}\n${bodyText}`;
      })
      .filter(Boolean);

    return sections.join("\n\n");
  }

  function plainToHtml(text: string) {
    if (!text) return "";
    const blocks = text.split(/\n{2,}/).filter(Boolean);
    const htmlBlocks = blocks.map((block) => {
      const lines = block.split("\n").filter(Boolean);
      const isBullet = lines.every((line) => line.trim().startsWith("- "));
      const isNumbered = lines.every((line) => /^\d+\.\s+/.test(line.trim()));
      if (isBullet) {
        const items = lines.map((line) => line.replace(/^-+\s+/, ""));
        return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
      }
      if (isNumbered) {
        const items = lines.map((line) => line.replace(/^\d+\.\s+/, ""));
        return `<ol>${items.map((item) => `<li>${item}</li>`).join("")}</ol>`;
      }
      const escaped = lines.join("<br/>");
      return `<p>${escaped}</p>`;
    });
    return htmlBlocks.join("");
  }

  function htmlToPlain(html: string) {
    if (!html) return "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const blocks: string[] = [];

    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) blocks.push(text);
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      if (tag === "br") {
        blocks.push("");
        return;
      }
      if (tag === "ul" || tag === "ol") {
        const items = Array.from(el.querySelectorAll("li")).map((li) => `- ${li.textContent?.trim() || ""}`);
        if (items.length) {
          blocks.push(items.join("\n"));
        }
        return;
      }
      if (["p", "div", "section", "blockquote", "pre", "h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
        const text = el.textContent?.trim() || "";
        if (text) blocks.push(text);
        return;
      }
      Array.from(el.childNodes).forEach(walk);
    };

    Array.from(doc.body.childNodes).forEach(walk);
    return blocks.filter(Boolean).join("\n\n");
  }

  function getSubLessons(lesson: Lesson | null) {
    if (selectedLessonDetails) {
      const contentBlocks = (selectedLessonDetails as Record<string, unknown>).content;
      const blocks = Array.isArray(contentBlocks) ? contentBlocks : [];
      const subLessons = blocks
        .filter((item) => String((item as Record<string, unknown>).content_type || "").toLowerCase() === "sub_lesson")
        .map((item) => ({
          id: Number((item as Record<string, unknown>).id),
          title: String((item as Record<string, unknown>).title || ""),
          body: String((item as Record<string, unknown>).body || ""),
          order_index: Number((item as Record<string, unknown>).order_index || 0)
        }))
        .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
      return subLessons;
    }
    if (!lesson?.sub_lessons?.length) return [];
    return [...lesson.sub_lessons].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  }

  function getCurrentEditorContent(lesson: Lesson | null, subIndex: number) {
    const subLessons = getSubLessons(lesson);
    if (subLessons.length > 0) {
      return subLessons[subIndex]?.body || "";
    }
    if (selectedLessonDetails) {
      const contentBlocks = (selectedLessonDetails as Record<string, unknown>).content;
      const blocks = Array.isArray(contentBlocks) ? contentBlocks : [];
      const textBlock = blocks.find(
        (item) => String((item as Record<string, unknown>).content_type || "").toLowerCase() === "text"
      ) as Record<string, unknown> | undefined;
      if (textBlock) return String(textBlock.body || "");
    }
    return lesson?.content || "";
  }

  function getEditorContentId(lesson: Lesson | null, subIndex: number) {
    const subLessons = getSubLessons(lesson);
    if (subLessons.length > 0) {
      return subLessons[subIndex]?.id || null;
    }
    return lesson?.id || null;
  }

  function updateEditorSection(kind: "reading" | "practice", index: number, value: string) {
    setEditorDraft((prev) => {
      const list = [...prev[kind]];
      if (!list[index]) return prev;
      list[index] = { ...list[index], body: value };
      return { ...prev, [kind]: list };
    });
  }

  function updateEditorSectionTitle(kind: "reading" | "practice", index: number, value: string) {
    setEditorDraft((prev) => {
      const list = [...prev[kind]];
      if (!list[index]) return prev;
      list[index] = { ...list[index], title: value };
      return { ...prev, [kind]: list };
    });
  }

  function addEditorSection(kind: "reading" | "practice", title: string) {
    setEditorDraft((prev) => {
      const list = [...prev[kind]];
      list.push({
        title,
        body: "",
        colon: kind === "practice" && PRACTICE_SECTION_TITLES_WITH_COLON.has(title),
      });
      return { ...prev, [kind]: list };
    });
  }
  
  // Lesson upload states
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lessonModuleId, setLessonModuleId] = useState<number | null>(null);
  const [lessonVideoFile, setLessonVideoFile] = useState<File | null>(null);
  const [lessonImageFiles, setLessonImageFiles] = useState<File[]>([]);
  const [lessonVideoPreview, setLessonVideoPreview] = useState<string>("");
  const [lessonImagePreviews, setLessonImagePreviews] = useState<string[]>([]);
  const [uploadingLessonMedia, setUploadingLessonMedia] = useState(false);

  function removeLessonVideo() {
    setLessonVideoFile(null);
    setLessonVideoPreview("");
  }

  function removeLessonImage(index: number) {
    setLessonImageFiles(prev => prev.filter((_, i) => i !== index));
    setLessonImagePreviews(prev => prev.filter((_, i) => i !== index));
  }

  function clearLessonMedia() {
    setLessonVideoFile(null);
    setLessonVideoPreview("");
    setLessonImageFiles([]);
    setLessonImagePreviews([]);
  }

  function openLessonModal(moduleId: number) {
    setLessonModuleId(moduleId);
    setShowLessonModal(true);
    clearLessonMedia();
  }

  function closeLessonModal() {
    setShowLessonModal(false);
    setLessonModuleId(null);
    clearLessonMedia();
  }

  async function createLessonWithMedia(lessonData: any) {
    if (!lessonModuleId) return;
    
    try {
      setUploadingLessonMedia(true);
      
      // Upload video if provided
      let videoUrl = '';
      if (lessonVideoFile) {
        videoUrl = await uploadLessonVideo(lessonVideoFile);
      }
      
      // Upload images if provided
      let imageUrls: string[] = [];
      if (lessonImageFiles.length > 0) {
        imageUrls = await uploadLessonImages(lessonImageFiles);
      }
      
      // Create lesson with media URLs
      const newLessonData = {
        ...lessonData,
        video_url: videoUrl,
        image_urls: imageUrls,
        media_urls: [...(videoUrl ? [videoUrl] : []), ...imageUrls]
      };

      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/modules/${lessonModuleId}/lessons`
        : `${window.location.origin}/api/v1/admin/modules/${lessonModuleId}/lessons`;
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLessonData)
      });

      if (!response.ok) throw new Error(`Failed to create lesson: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        await loadModules();
        showSuccessMessage();
        closeLessonModal();
      } else {
        throw new Error(data.message || 'Failed to create lesson');
      }
    } catch (err) {
      console.error('Error creating lesson with media:', err);
      alert(err instanceof Error ? err.message : 'Failed to create lesson');
    } finally {
      setUploadingLessonMedia(false);
    }
  }

  const isAdmin = user?.role === 'admin';
  const canDelete = isAdmin;

  useEffect(() => {
    if (courseId && accessToken) {
      loadAllData();
    }
  }, [courseId, accessToken]);

  useEffect(() => {
    if (!selectedLesson) return;
    (async () => {
      if (!accessToken || !selectedLesson?.id) return;
      try {
        const data = await apiRequest(`/admin/lessons/${selectedLesson.id}`, { token: accessToken });
        setSelectedLessonDetails((data as any)?.data || (data as any) || null);
      } catch {
        setSelectedLessonDetails(null);
      }
    })();

    const content = getCurrentEditorContent(selectedLesson, editorSubIndex);
    setEditorDraft({
      reading: parseReadingSections(content),
      practice: parsePracticeSections(content)
    });
    setEditorActiveTab('reading');
    setEditorReadingIndex(0);
    setEditorPracticeIndex(0);
  }, [selectedLesson, editorSubIndex]);

  async function loadAllData() {
    try {
      setLoading(true);
      
      // Load course data first - this is critical
      const courseData = await loadCourse();
      setCourse(courseData || null); // IMPORTANT: Set the course state!
      
      // Load other data in parallel but don't fail if they fail
      try {
        await Promise.all([
          loadModules().catch(err => {
            console.warn('Failed to load modules:', err);
            return [];
          }),
          loadAnalytics().catch(err => {
            console.warn('Failed to load analytics:', err);
            return null;
          })
        ]);
      } catch (err) {
        console.warn('Non-critical data loading failed:', err);
        // Don't set error for non-critical data
      }
    } catch (err) {
      console.error('Error loading course data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load course data';
      setError(errorMessage);
      setLoading(false);
      
      // Set empty course state to prevent further errors
      setCourse(null);
      setModules([]);
      setCategories([]);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    if (!accessToken) return;
    
    // Add retry mechanism for categories
    const maxRetries = 3;
    let retryCount = 0;
    
    const attemptLoad = async (): Promise<void> => {
      try {
        console.log(`Loading categories... (attempt ${retryCount + 1}/${maxRetries})`);
        const apiUrl = window.location.origin.includes('localhost') 
          ? `http://localhost:5000/api/v1/admin/categories`
          : `${window.location.origin}/api/v1/admin/categories`;
          
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        console.log('Categories response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Categories data received:', data);
          setCategories(data.data || data || []);
        } else {
          const errorText = await response.text();
          console.error('Categories error response:', errorText);
          
          // Don't throw error, try again
          if (retryCount < maxRetries - 1) {
            retryCount++;
            setTimeout(() => attemptLoad(), 1000 * retryCount); // Exponential backoff
          } else {
            setCategories([]); // Set empty array after final retry
          }
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        
        if (retryCount < maxRetries - 1) {
          retryCount++;
          setTimeout(() => attemptLoad(), 1000 * retryCount);
        } else {
          setCategories([]); // Set empty array on error
        }
      }
    };
    
    await attemptLoad();
  }

  async function loadCourse() {
    if (!courseId || !accessToken) {
      console.error('Missing courseId or accessToken');
      setError('Missing course ID or authentication');
      setLoading(false);
      return;
    }
    
    console.log('Loading course with ID:', courseId);
    console.log('Using accessToken:', accessToken ? 'Present' : 'Missing');
    
    const apiUrl = window.location.origin.includes('localhost') 
      ? `http://localhost:5000/api/v1/admin/courses/${courseId}`
      : `${window.location.origin}/api/v1/admin/courses/${courseId}`;
      
    console.log('API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Course response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      
      // Handle specific error codes
      if (response.status === 404) {
        throw new Error(`Course not found (ID: ${courseId})`);
      } else if (response.status === 401) {
        throw new Error('Authentication failed - please log in again');
      } else if (response.status === 403) {
        throw new Error('Access denied - insufficient permissions');
      } else {
        throw new Error(`Failed to load course (${response.status}): ${errorText}`);
      }
    }
    
    const data = await response.json();
    console.log('Course data received:', data);
    console.log('Response structure:', {
      success: data.success,
      data: data.data,
      dataCourse: data.data?.course,
      dataCourses: data.data?.courses
    });
    
    // Handle different response structures
    let courseData = null;
    if (data.success && data.data.course) {
      courseData = data.data.course;
    } else if (data.success && data.data) {
      // Handle case where data is directly the course
      courseData = data.data;
    } else if (data.data && typeof data.data === 'object') {
      // Handle nested data structure
      courseData = (data.data as any).course || (data.data as any);
    } else {
      throw new Error(data.message || 'Invalid response format from server');
    }
    
    if (courseData) {
      // Transform the course data to match our interface
      const transformedCourse = {
        id: courseData.id,
        title: courseData.title || '',
        description: courseData.description || courseData.long_description || '',
        category: courseData.category_name || courseData.category || 'Uncategorized',
        category_id: courseData.category_id,
        thumbnail_url: courseData.thumbnail_url || '',
        published: courseData.published === true || courseData.status === 'published', // Handle both published boolean and status field
        instructor_id: courseData.instructor_id,
        created_at: courseData.created_at,
        updated_at: courseData.updated_at
      };
      
      console.log('Transformed course data:', transformedCourse);
      return transformedCourse;
    } else {
      throw new Error('No course data found in response');
    }
  }

  async function loadModules() {
    try {
      // Load modules with lessons included
      const modulesApiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/courses/${courseId}/modules`
        : `${window.location.origin}/api/v1/admin/courses/${courseId}/modules`;
        
      const modulesResponse = await fetch(modulesApiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!modulesResponse.ok) throw new Error(`Failed to load modules: ${modulesResponse.status}`);
      
      const modulesData = await modulesResponse.json();
      if (modulesData.success) {
        // Backend already includes lessons in the response
        const modulesWithLessons = modulesData.data || [];
        console.log('Modules loaded with lessons:', modulesWithLessons);
        setModules(modulesWithLessons);
      } else {
        throw new Error(modulesData.message || 'Failed to load modules');
      }
    } catch (error) {
      console.error('Error loading modules:', error);
      setModules([]); // Set empty array on error
    }
  }

  async function loadAnalytics() {
    // Mock analytics for now
    setAnalytics({
      total_enrollments: 200,
      active_students: 100,
      completion_rate: 80,
      average_time_to_complete: 60,
      quiz_performance: 90,
      engagement_score: 95
    });
  }

  function toggleModuleExpansion(moduleId: number) {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  }

  async function saveCourse() {
    if (!course) return;
    
    try {
      setSavingCourse(true); // Start saving
      
      console.log('Saving course with data:', {
        title: course.title,
        description: course.description,
        thumbnail_url: course.thumbnail_url,
        category_id: course.category_id,
        published: course.published
      });
      
      const courseData = {
        title: course.title,
        description: course.description,
        thumbnail_url: course.thumbnail_url,
        category_id: course.category_id,
        published: course.published
      };

      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/courses/${courseId}`
        : `${window.location.origin}/api/v1/admin/courses/${courseId}`;
        
      console.log('API URL:', apiUrl);
      console.log('Request body:', JSON.stringify(courseData, null, 2));
        
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
      });

      console.log('Save course response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to save course: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Save course response data:', data);
      
      if (data.success) {
        const updatedCourse = data.data;
        console.log('Updated course data:', updatedCourse);
        
        // Immediately set the course data to prevent disappearing
        setCourse(updatedCourse);
        
        // Show success message
        showSuccessMessage();
        
        // Close edit mode after a short delay to show success
        setTimeout(() => {
          setEditingCourse(false);
          setSavingCourse(false); // Stop saving
        }, 1000);
        
        // Notify other pages that course was updated
        localStorage.setItem('courseUpdated', Date.now().toString());
        localStorage.setItem('coursesListUpdated', Date.now().toString()); // Add this for courses list
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'courseUpdated',
          newValue: Date.now().toString()
        }));
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'coursesListUpdated',
          newValue: Date.now().toString()
        }));
        
        console.log('Course saved successfully:', updatedCourse);
      } else {
        throw new Error(data.message || 'Failed to save course');
      }
    } catch (err) {
      console.error('Error saving course:', err);
      alert(err instanceof Error ? err.message : 'Failed to save course');
      setSavingCourse(false); // Stop saving on error
      
      // Don't close edit mode on error, so user can try again
      // setEditingCourse(false); // Remove this line
    }
  }

  async function saveLessonContentSections() {
    if (!selectedLesson || !accessToken) return;
    const body = buildLessonContent(editorDraft.reading, editorDraft.practice);
    const subLessons = getSubLessons(selectedLesson);
    try {
      if (subLessons.length > 0) {
        const sub = subLessons[editorSubIndex];
        if (!sub) return;
        if (sub.id) {
          await apiRequest(`/admin/content/${sub.id}`, {
            method: "PATCH",
            token: accessToken,
            body: JSON.stringify({
              content_type: "sub_lesson",
              title: sub.title,
              body,
              order_index: sub.order_index ?? editorSubIndex
            })
          });
        } else {
          await apiRequest(`/admin/lessons/${selectedLesson.id}/content`, {
            method: "POST",
            token: accessToken,
            body: JSON.stringify({
              content_type: "sub_lesson",
              title: sub.title || `Sub-lesson ${editorSubIndex + 1}`,
              body,
              order_index: sub.order_index ?? editorSubIndex
            })
          });
        }
      } else {
        const contentBlocks = (selectedLessonDetails as Record<string, unknown> | null)?.content;
        const blocks = Array.isArray(contentBlocks) ? contentBlocks : [];
        const textBlock = blocks.find(
          (item) => String((item as Record<string, unknown>).content_type || "").toLowerCase() === "text"
        ) as Record<string, unknown> | undefined;
        if (textBlock?.id) {
          await apiRequest(`/admin/content/${textBlock.id}`, {
            method: "PATCH",
            token: accessToken,
            body: JSON.stringify({
              content_type: "text",
              title: textBlock.title || "Reading",
              body
            })
          });
        } else {
          await apiRequest(`/admin/lessons/${selectedLesson.id}/content`, {
            method: "POST",
            token: accessToken,
            body: JSON.stringify({
              content_type: "text",
              title: "Reading",
              body
            })
          });
        }
      }
      await loadModules();
      if (selectedLesson?.id) {
        const data = await apiRequest(`/admin/lessons/${selectedLesson.id}`, { token: accessToken });
        setSelectedLessonDetails((data as any)?.data || (data as any) || null);
      }
    } catch (err) {
      console.error('Error saving lesson content:', err);
      alert(err instanceof Error ? err.message : 'Failed to save lesson content');
    }
  }

  async function uploadCourseImage(file: File): Promise<string> {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'course-thumbnail');

      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/upload`
        : `${window.location.origin}/api/v1/admin/upload`;
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });

      if (!response.ok) throw new Error(`Failed to upload image: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        return data.url;
      } else {
        throw new Error(data.message || 'Failed to upload image');
      }
    } finally {
      setUploadingImage(false);
    }
  }

  async function uploadLessonVideo(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'lesson-video');

    const apiUrl = window.location.origin.includes('localhost') 
      ? `http://localhost:5000/api/v1/admin/upload`
      : `${window.location.origin}/api/v1/admin/upload`;
      
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: formData
    });

    if (!response.ok) throw new Error(`Failed to upload video: ${response.status}`);
    
    const data = await response.json();
    if (data.success) {
      return data.url;
    } else {
      throw new Error(data.message || 'Failed to upload video');
    }
  }

  async function uploadLessonImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'lesson-image');

      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/upload`
        : `${window.location.origin}/api/v1/admin/upload`;
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });

      if (!response.ok) throw new Error(`Failed to upload image: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        return data.url;
      } else {
        throw new Error(data.message || 'Failed to upload image');
      }
    });

    return Promise.all(uploadPromises);
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size must be less than 5MB');
        return;
      }

      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      setCourseImageFile(file);
    }
  }

  function handleLessonVideoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        alert('Video size must be less than 100MB');
        return;
      }

      if (!file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }

      const preview = URL.createObjectURL(file);
      setLessonVideoPreview(preview);
      setLessonVideoFile(file);
    }
  }

  function handleLessonImagesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const validFiles = files.filter(file => {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit per image
          alert(`Image ${file.name} must be less than 10MB`);
          return false;
        }
        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} is not an image`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        const previews = validFiles.map(file => URL.createObjectURL(file));
        setLessonImagePreviews(prev => [...prev, ...previews]);
        setLessonImageFiles(prev => [...prev, ...validFiles]);
      }
    }
  }

  async function handleImageUpload() {
    if (!courseImageFile || !course) return;
    
    try {
      setUploadingImage(true);
      const imageUrl = await uploadCourseImage(courseImageFile);
      console.log('Image uploaded successfully:', imageUrl);
      
      // Update course state with new image URL
      const updatedCourse = {...course, thumbnail_url: imageUrl};
      setCourse(updatedCourse);
      setCourseImageFile(null);
      setImagePreview("");
      
      // Automatically save the course to persist the image URL
      await saveCourseWithImage(updatedCourse);
      
      showSuccessMessage();
    } catch (err) {
      console.error('Error uploading image:', err);
      alert(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  }

  async function saveCourseWithImage(courseToUpdate: typeof course) {
    if (!courseToUpdate) return;
    
    try {
      const courseData = {
        title: courseToUpdate.title,
        description: courseToUpdate.description,
        thumbnail_url: courseToUpdate.thumbnail_url,
        category_id: courseToUpdate.category_id,
        published: courseToUpdate.published
      };

      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/courses/${courseId}`
        : `${window.location.origin}/api/v1/admin/courses/${courseId}`;
        
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
      });

      if (!response.ok) {
        throw new Error(`Failed to save course with image: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        console.log('Course saved with new image:', data.data);
        
        // Notify other pages that course was updated
        localStorage.setItem('courseUpdated', Date.now().toString());
        localStorage.setItem('coursesListUpdated', Date.now().toString());
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'courseUpdated',
          newValue: Date.now().toString()
        }));
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'coursesListUpdated',
          newValue: Date.now().toString()
        }));
      }
    } catch (err) {
      console.error('Error saving course with image:', err);
      // Don't show alert here as the main save function will handle errors
      throw err;
    }
  }

  async function removeImage() {
    if (!course) return;
    
    setCourseImageFile(null);
    setImagePreview("");
    
    const updatedCourse = {...course, thumbnail_url: ""};
    setCourse(updatedCourse);
    
    // Automatically save the course to persist the image removal
    try {
      await saveCourseWithImage(updatedCourse);
      showSuccessMessage();
    } catch (err) {
      console.error('Error removing image:', err);
      alert(err instanceof Error ? err.message : 'Failed to remove image');
    }
  }

  function showSuccessMessage() {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
    
    // Notify other tabs/pages that course was updated
    localStorage.setItem('courseUpdated', Date.now().toString());
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'courseUpdated',
      newValue: Date.now().toString()
    }));
  }

  async function createNewModule() {
    try {
      const newModuleData = {
        title: `Module ${modules.length + 1}`,
        description: '',
        order: modules.length + 1,
        published: false,
        quiz_required: false,
        min_pass_percentage: 80
      };

      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/courses/${courseId}/modules`
        : `${window.location.origin}/api/v1/admin/courses/${courseId}/modules`;
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newModuleData)
      });

      if (!response.ok) throw new Error(`Failed to create module: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        const newModule = {
          ...data.data,
          lessons: []
        };
        setModules([...modules, newModule]);
        showSuccessMessage();
      } else {
        throw new Error(data.message || 'Failed to create module');
      }
    } catch (err) {
      console.error('Error creating module:', err);
      alert(err instanceof Error ? err.message : 'Failed to create module');
    }
  }

  async function saveModule(module: Module) {
    try {
      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/modules/${module.id}`
        : `${window.location.origin}/api/v1/admin/modules/${module.id}`;
        
      const response = await fetch(apiUrl, {
        method: 'PATCH', // Changed from PUT to PATCH
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(module)
      });

      if (!response.ok) throw new Error(`Failed to save module: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        setModules(modules.map(m => m.id === module.id ? data.data : m));
        setEditingModule(null);
        showSuccessMessage();
      } else {
        throw new Error(data.message || 'Failed to save module');
      }
    } catch (err) {
      console.error('Error saving module:', err);
      alert(err instanceof Error ? err.message : 'Failed to save module');
    }
  }

  async function deleteModule(moduleId: number) {
    if (!canDelete) {
      alert('Only admins can delete modules');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this module? This will also delete all lessons in it.')) {
      return;
    }

    try {
      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/modules/${moduleId}`
        : `${window.location.origin}/api/v1/admin/modules/${moduleId}`;
        
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`Failed to delete module: ${response.status}`);
      
      setModules(modules.filter(m => m.id !== moduleId));
      showSuccessMessage();
    } catch (err) {
      console.error('Error deleting module:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete module');
    }
  }

  async function createNewLesson(moduleId: number) {
    openLessonModal(moduleId);
  }

  async function saveLesson(lesson: Lesson) {
    if (!lesson) return;

    try {
      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/lessons/${lesson.id}`
        : `${window.location.origin}/api/v1/admin/lessons/${lesson.id}`;
        
      const response = await fetch(apiUrl, {
        method: 'PATCH', // Changed from PUT to PATCH
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(lesson)
      });

      if (!response.ok) throw new Error(`Failed to save lesson: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        // Update lesson in the modules state
        const updatedModules = modules.map(module => ({
          ...module,
          lessons: module.lessons?.map(l => l.id === lesson.id ? data.data : l) || []
        }));
        setModules(updatedModules);
        showSuccessMessage();
      } else {
        throw new Error(data.message || 'Failed to save lesson');
      }
    } catch (err) {
      console.error('Error saving lesson:', err);
      alert(err instanceof Error ? err.message : 'Failed to save lesson');
    }
  }

  async function deleteLesson(lessonId: number) {
    if (!canDelete) {
      alert('Only admins can delete lessons');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    try {
      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/lessons/${lessonId}`
        : `${window.location.origin}/api/v1/admin/lessons/${lessonId}`;
        
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`Failed to delete lesson: ${response.status}`);
      
      // Reload modules to refresh the lesson list
      await loadModules();
      showSuccessMessage();
    } catch (err) {
      console.error('Error deleting lesson:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete lesson');
    }
  }

  function getLessonIcon(type: string) {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'reading': return <BookOpen className="h-4 w-4" />;
      case 'exercise': return <Dumbbell className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  }

  function getLessonColor(type: string) {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-600';
      case 'reading': return 'bg-blue-100 text-blue-600';
      case 'exercise': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Course Management" subtitle="Loading...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !course) {
    return (
      <AdminLayout title="Course Management" subtitle="Error">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Course</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Course Management" 
      subtitle={course.title}
      actions={
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/courses')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Courses
          </button>
          
          <button
            onClick={() => navigate(`/courses/${courseId}/player`)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Play className="h-4 w-4" />
            Preview as Student
          </button>
          
          {isAdmin && (
            <button
              onClick={() => {/* Delete course logic */}}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete Course
            </button>
          )}
        </div>
      }
    >
      {/* Success Celebration */}
      {showCelebration && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <span>Saved successfully!</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: <Eye className="h-4 w-4" /> },
              { id: 'modules', label: 'Modules & Lessons', icon: <Layers className="h-4 w-4" /> },
              { id: 'content', label: 'Content Editor', icon: <Edit className="h-4 w-4" /> },
              { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
              { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Course Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Course Image/Thumbnail */}
                <div className="md:w-1/3 h-48 md:h-auto bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
                  {/* Debug: Show what we're working with */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="absolute top-0 left-0 bg-black bg-opacity-75 text-white text-xs p-1 z-50">
                      Debug: thumbnail_url = {course?.thumbnail_url || 'null'}
                    </div>
                  )}
                  
                  {course?.thumbnail_url && course.thumbnail_url.trim() !== "" ? (
                    <img 
                      src={course.thumbnail_url.startsWith('http') ? course.thumbnail_url : `http://localhost:5000${course.thumbnail_url}`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', course.thumbnail_url);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <BookOpen className="h-16 w-16 text-white" />
                  )}
                  
                  {editingCourse && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                      {imagePreview || course.thumbnail_url ? (
                        <div className="relative">
                          <img 
                            src={(imagePreview || course.thumbnail_url)?.startsWith('http') ? (imagePreview || course.thumbnail_url) : `http://localhost:5000${imagePreview || course.thumbnail_url}`}
                            alt="Course thumbnail preview" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-white">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-sm">Course thumbnail</p>
                        </div>
                      )}
                      
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="course-image-edit-upload"
                      />
                      
                      <div className="absolute bottom-2 flex gap-2">
                        <label
                          htmlFor="course-image-edit-upload"
                          className="px-3 py-1 bg-white text-blue-600 rounded text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-1"
                        >
                          <Upload className="h-3 w-3" />
                          {imagePreview || course.thumbnail_url ? 'Change' : 'Upload'}
                        </label>
                        
                        {courseImageFile && (
                          <button
                            onClick={handleImageUpload}
                            disabled={uploadingImage}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                          >
                            {uploadingImage ? 'Saving...' : 'Save'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Course Info */}
                <div className="flex-1 p-6">
                  {editingCourse ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={course.title}
                        onChange={(e) => setCourse({...course, title: e.target.value})}
                        className="w-full text-2xl font-bold bg-white text-gray-900 border-2 border-gray-300 rounded-lg px-4 py-3 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                        placeholder="Enter course title"
                      />
                      
                      {/* Category Selection */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course Category
                          </label>
                          <button
                            onClick={() => loadCategories()}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            title="Refresh categories"
                          >
                            Refresh Categories
                          </button>
                        </div>
                        {categories.length > 0 ? (
                          <select
                            value={course.category_id?.toString() || ""}
                            onChange={(e) => setCourse({...course, category_id: e.target.value ? parseInt(e.target.value) : undefined})}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select a category</option>
                            {categories.map((category: any) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-500">
                            Loading categories...
                          </div>
                        )}
                      </div>
                      
                      <textarea
                        value={course.description}
                        onChange={(e) => setCourse({...course, description: e.target.value})}
                        className="w-full bg-white text-gray-900 border-2 border-gray-300 rounded-lg px-4 py-3 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-md resize-vertical"
                        rows={3}
                        placeholder="Enter course description"
                      />
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!course.published}
                            onChange={(e) => setCourse({...course, published: e.target.checked})}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-700">Published</span>
                        </label>
                        <button
                          onClick={saveCourse}
                          disabled={savingCourse}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {savingCourse ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Saving...
                            </>
                          ) : (
                            'Save Course'
                          )}
                        </button>
                        <button
                          onClick={() => setEditingCourse(false)}
                          disabled={savingCourse}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {course.category}
                            </span>
                            <span className={`px-3 py-1 rounded-full ${
                              course.published 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {course.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setEditingCourse(true)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Course Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-2 mx-auto">
                            <Layers className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="text-2xl font-bold text-gray-900">{course.modules_count}</div>
                          <div className="text-sm text-gray-600">Modules</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-2 mx-auto">
                            <BookOpen className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="text-2xl font-bold text-gray-900">{course.lessons_count}</div>
                          <div className="text-sm text-gray-600">Lessons</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-2 mx-auto">
                            <Users className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="text-2xl font-bold text-gray-900">{course.total_students || 0}</div>
                          <div className="text-sm text-gray-600">Students</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-2 mx-auto">
                            <TrendingUp className="h-6 w-6 text-orange-600" />
                          </div>
                          <div className="text-2xl font-bold text-gray-900">{course.average_progress || 0}%</div>
                          <div className="text-sm text-gray-600">Avg Progress</div>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed">
                        {course.description || 'No description available for this course.'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Progress Timeline</h2>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200"></div>
                <div className="absolute left-0 top-0 w-1 bg-blue-600" style={{height: `${course.average_progress || 0}%`}}></div>
                <div className="space-y-4">
                  {modules.slice(0, 3).map((module, index) => (
                    <div key={module.id} className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full z-10 ${
                        index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                      }`}></div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{module.title}</div>
                        <div className="text-sm text-gray-600">{module.lessons_count} lessons</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('modules')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-3"
                >
                  <Layers className="h-6 w-6 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Manage Modules</div>
                    <div className="text-sm text-gray-600">Edit course structure</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('content')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-3"
                >
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading course data...</p>
                        {error && (
                          <div className="mt-4 text-center">
                            <p className="text-red-600 font-medium">{error}</p>
                            <div className="mt-2 space-x-2">
                              <button
                                onClick={() => window.open('/test-course-api.html', '_blank')}
                                className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                              >
                                Diagnose API
                              </button>
                              <button
                                onClick={() => {
                                  setError('');
                                  setCourse(null);
                                  setModules([]);
                                  setCategories([]);
                                  setAnalytics(null);
                                  setLoading(true);
                                  // Retry loading
                                  Promise.all([
                                    loadCourse(),
                                    loadModules(),
                                    loadCategories()
                                  ]).catch((retryErr) => {
                                    console.error('Retry failed:', retryErr);
                                    setError('Failed to reload course data');
                                    setLoading(false);
                                  });
                                }}
                                className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                              >
                                Retry Loading
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Edit className="h-6 w-6 text-green-600" />
                  )}
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Edit Content</div>
                    <div className="text-sm text-gray-600">Update lesson materials</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-3"
                >
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">View Analytics</div>
                    <div className="text-sm text-gray-600">Track performance</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modules & Lessons Tab */}
        {activeTab === 'modules' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Modules & Lessons</h2>
              <button
                onClick={createNewModule}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Module
              </button>
            </div>

            {modules.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Layers className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Modules Yet</h3>
                <p className="text-gray-600 mb-6">Start building your course by creating your first module.</p>
                <button
                  onClick={createNewModule}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create First Module
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((module, moduleIndex) => {
                  const isExpanded = expandedModules.has(module.id);
                  
                  return (
                    <div key={module.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Module Header */}
                    <div className="p-6 border-b border-gray-200">
                      {editingModule?.id === module.id ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={editingModule.title}
                            onChange={(e) => setEditingModule({...editingModule, title: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Module title"
                          />
                          <textarea
                            value={editingModule.description || ''}
                            onChange={(e) => setEditingModule({...editingModule, description: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            placeholder="Module description (optional)"
                          />
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingModule.published}
                                onChange={(e) => setEditingModule({...editingModule, published: e.target.checked})}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm text-gray-700">Published</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingModule.quiz_required || false}
                                onChange={(e) => setEditingModule({...editingModule, quiz_required: e.target.checked})}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm text-gray-700">Quiz Required</span>
                            </label>
                            {editingModule.quiz_required && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700">Min Pass:</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={editingModule.min_pass_percentage || 80}
                                  onChange={(e) => setEditingModule({...editingModule, min_pass_percentage: parseInt(e.target.value)})}
                                  className="w-16 px-2 py-1 border border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">%</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => saveModule(editingModule)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                              <Save className="h-4 w-4" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingModule(null)}
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            >
                              <X className="h-4 w-4" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-bold">{module.order}</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                              <p className="text-sm text-gray-600">{module.lessons_count} lessons</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-xs rounded-full ${
                              module.published 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {module.published ? 'Published' : 'Draft'}
                            </span>
                            {module.quiz_required && (
                              <span className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                                Quiz {module.min_pass_percentage || 80}%
                              </span>
                            )}
                            <button 
                              onClick={() => setEditingModule(module)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            {canDelete && (
                              <button 
                                onClick={() => deleteModule(module.id)}
                                className="p-2 text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => toggleModuleExpansion(module.id)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Module Content (Lessons) */}
                    {isExpanded && (
                      <div className="p-6">
                        {module.lessons?.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                            <p>No lessons in this module yet</p>
                            <button 
                              onClick={() => createNewLesson(module.id)}
                              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              Add First Lesson
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lesson.id} className="border border-gray-200 rounded-lg hover:bg-gray-50">
                                <div className="p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getLessonColor(lesson.lesson_type)}`}>
                                        {getLessonIcon(lesson.lesson_type)}
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-gray-900">
                                          Lesson {module.order}.{lessonIndex + 1}: {lesson.title}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                          {lesson.lesson_type === 'video' && 'Video content'}
                                          {lesson.lesson_type === 'reading' && 'Reading materials'}
                                          {lesson.lesson_type === 'exercise' && 'Practice exercises'}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {lesson.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                                      {lesson.locked && <Lock className="h-4 w-4 text-gray-400" />}
                                      <span className={`px-2 py-1 text-xs rounded-full ${
                                        lesson.published 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {lesson.published ? 'Published' : 'Draft'}
                                      </span>
                                      <button 
                                        onClick={() => setSelectedLesson(lesson)}
                                        className="p-2 text-gray-400 hover:text-gray-600"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </button>
                                      {canDelete && (
                                        <button 
                                          onClick={() => deleteLesson(lesson.id)}
                                          className="p-2 text-red-400 hover:text-red-600"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Media Preview */}
                                  {(lesson.video_url || lesson.image_urls?.length) && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                      <div className="space-y-3">
                                        {lesson.video_url && (
                                          <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Video className="h-4 w-4" />
                                            <span>Video uploaded</span>
                                            <a 
                                              href={lesson.video_url} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="text-blue-600 hover:text-blue-800"
                                            >
                                              View Video
                                            </a>
                                          </div>
                                        )}
                                        
                                        {lesson.image_urls && lesson.image_urls.length > 0 && (
                                          <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <ImageIcon className="h-4 w-4" />
                                            <span>{lesson.image_urls.length} image{lesson.image_urls.length > 1 ? 's' : ''} uploaded</span>
                                            <button 
                                              onClick={() => {
                                                // Create a simple modal to view images
                                                const modal = document.createElement('div');
                                                modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                                                modal.innerHTML = `
                                                  <div class="bg-white rounded-xl p-6 max-w-4xl max-h-[90vh] overflow-auto">
                                                    <div class="flex justify-between items-center mb-4">
                                                      <h3 class="text-lg font-bold">Lesson Images</h3>
                                                      <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                                                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                        </svg>
                                                      </button>
                                                    </div>
                                                    <div class="grid grid-cols-2 gap-4">
                                                      ${(lesson.image_urls || []).map(url => `
                                                        <img src="${url}" alt="Lesson image" class="w-full h-auto rounded-lg" />
                                                      `).join('')}
                                                    </div>
                                                  </div>
                                                `;
                                                document.body.appendChild(modal);
                                              }}
                                              className="text-blue-600 hover:text-blue-800"
                                            >
                                              View Images
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                            
                            {/* Add Lesson Button */}
                            <button 
                              onClick={() => createNewLesson(module.id)}
                              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800"
                            >
                              <Plus className="h-4 w-4" />
                              Add Lesson
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            )}
          </div>
        )}

        {/* Content Editor Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Content Editor</h2>
              <div className="flex items-center gap-2">
                <select 
                  value={selectedModule?.id || ''}
                  onChange={(e) => {
                    const module = modules.find(m => m.id === parseInt(e.target.value));
                    setSelectedModule(module || null);
                    setSelectedLesson(null);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Module</option>
                  {modules.map(module => (
                    <option key={module.id} value={module.id}>{module.title}</option>
                  ))}
                </select>
                
                {selectedModule && (
                  <select 
                    value={selectedLesson?.id || ''}
                    onChange={(e) => {
                      const lesson = selectedModule.lessons?.find(l => l.id === parseInt(e.target.value));
                      setSelectedLesson(lesson || null);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Lesson</option>
                    {selectedModule.lessons?.map(lesson => (
                      <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {selectedLesson ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                  <input
                    type="text"
                    value={selectedLesson.title}
                    onChange={(e) => setSelectedLesson({...selectedLesson, title: e.target.value})}
                    className="w-full text-xl font-semibold border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                    placeholder="Lesson title"
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {getSubLessons(selectedLesson).length > 0 && (
                    <>
                      <button
                        className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                        onClick={() => setEditorSubIndex(Math.max(editorSubIndex - 1, 0))}
                      >
                        Previous Sub-lesson
                      </button>
                      <button
                        className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                        onClick={() => setEditorSubIndex(Math.min(editorSubIndex + 1, getSubLessons(selectedLesson).length - 1))}
                      >
                        Next Sub-lesson
                      </button>
                      <span className="text-xs text-gray-500">
                        Sub-lesson {editorSubIndex + 1} of {getSubLessons(selectedLesson).length}
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2">
                  <button
                    className={`px-3 py-1.5 rounded text-sm ${editorActiveTab === 'video' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-900 bg-white'}`}
                    onClick={() => setEditorActiveTab('video')}
                  >
                    Video
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded text-sm ${editorActiveTab === 'reading' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-900 bg-white'}`}
                    onClick={() => setEditorActiveTab('reading')}
                  >
                    Reading Notes
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded text-sm ${editorActiveTab === 'practice' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-900 bg-white'}`}
                    onClick={() => setEditorActiveTab('practice')}
                  >
                    Practice / Exercises
                  </button>
                </div>

                {editorActiveTab === 'video' && (
                  <div className="mt-4 space-y-2">
                    <label className="text-xs text-gray-500">Video URL</label>
                    <input
                      className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                      value={selectedLesson.video_url || ""}
                      onChange={(e) => setSelectedLesson({ ...selectedLesson, video_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                )}

                {editorActiveTab === 'reading' && (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs text-gray-500">
                      Page {editorReadingIndex + 1} of {editorDraft.reading.length || 1}
                    </p>
                    <input
                      className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white text-sm font-semibold"
                      value={editorDraft.reading[editorReadingIndex]?.title || ""}
                      onChange={(event) => updateEditorSectionTitle('reading', editorReadingIndex, event.target.value)}
                      placeholder="Reading section title"
                    />
                    <textarea
                      className="hidden"
                      value={editorDraft.reading[editorReadingIndex]?.body || ""}
                      readOnly
                    />
                    <div className="text-gray-900">
                      <RichTextEditor
                        value={editorDraft.reading[editorReadingIndex]?.body || ""}
                        onChange={(value) => updateEditorSection('reading', editorReadingIndex, value)}
                        height="260px"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                        onClick={() => setEditorReadingIndex(Math.max(editorReadingIndex - 1, 0))}
                      >
                        Previous Page
                      </button>
                      <button
                        className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                        onClick={() => setEditorReadingIndex(Math.min(editorReadingIndex + 1, editorDraft.reading.length - 1))}
                      >
                        Next Page
                      </button>
                      <button
                        className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                        onClick={() => addEditorSection('reading', 'Reading Notes')}
                      >
                        Add Reading Page
                      </button>
                    </div>
                  </div>
                )}

                {editorActiveTab === 'practice' && (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs text-gray-500">
                      Page {editorPracticeIndex + 1} of {editorDraft.practice.length || 1}
                    </p>
                    <input
                      className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white text-sm font-semibold"
                      value={editorDraft.practice[editorPracticeIndex]?.title || ""}
                      onChange={(event) => updateEditorSectionTitle('practice', editorPracticeIndex, event.target.value)}
                      placeholder="Practice section title"
                    />
                    <textarea
                      className="hidden"
                      value={editorDraft.practice[editorPracticeIndex]?.body || ""}
                      readOnly
                    />
                    <div className="text-gray-900">
                      <RichTextEditor
                        value={editorDraft.practice[editorPracticeIndex]?.body || ""}
                        onChange={(value) => updateEditorSection('practice', editorPracticeIndex, value)}
                        height="260px"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                        onClick={() => setEditorPracticeIndex(Math.max(editorPracticeIndex - 1, 0))}
                      >
                        Previous Page
                      </button>
                      <button
                        className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                        onClick={() => setEditorPracticeIndex(Math.min(editorPracticeIndex + 1, editorDraft.practice.length - 1))}
                      >
                        Next Page
                      </button>
                      <button
                        className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                        onClick={() => addEditorSection('practice', 'Practice Steps')}
                      >
                        Add Practice Page
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <button 
                    onClick={() => saveLessonContentSections()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Save Lesson Content
                  </button>
                  <button 
                    onClick={() => saveLesson(selectedLesson)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-900 bg-white"
                  >
                    Save Lesson Title
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Edit className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Lesson to Edit</h3>
                <p className="text-gray-600">Choose a module and lesson from the dropdowns above to start editing content.</p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Course Analytics</h2>
            
            {analytics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">{analytics.total_enrollments}</span>
                  </div>
                  <h3 className="font-medium text-gray-900">Total Enrollments</h3>
                  <p className="text-sm text-gray-600">Students enrolled in this course</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <span className="text-2xl font-bold text-gray-900">{analytics.completion_rate}%</span>
                  </div>
                  <h3 className="font-medium text-gray-900">Completion Rate</h3>
                  <p className="text-sm text-gray-600">Students who finished the course</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Award className="h-8 w-8 text-purple-600" />
                    <span className="text-2xl font-bold text-gray-900">{analytics.quiz_performance}%</span>
                  </div>
                  <h3 className="font-medium text-gray-900">Quiz Performance</h3>
                  <p className="text-sm text-gray-600">Average quiz scores</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="h-8 w-8 text-orange-600" />
                    <span className="text-2xl font-bold text-gray-900">{analytics.average_time_to_complete} days</span>
                  </div>
                  <h3 className="font-medium text-gray-900">Avg. Completion Time</h3>
                  <p className="text-sm text-gray-600">Time to finish course</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <BarChart3 className="h-8 w-8 text-red-600" />
                    <span className="text-2xl font-bold text-gray-900">{analytics.engagement_score}%</span>
                  </div>
                  <h3 className="font-medium text-gray-900">Engagement Score</h3>
                  <p className="text-sm text-gray-600">Student interaction rate</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="h-8 w-8 text-indigo-600" />
                    <span className="text-2xl font-bold text-gray-900">{analytics.active_students}</span>
                  </div>
                  <h3 className="font-medium text-gray-900">Active Students</h3>
                  <p className="text-sm text-gray-600">Currently learning</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Available</h3>
                <p className="text-gray-600">Analytics will appear once students start taking the course.</p>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Course Settings</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Course Configuration</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Allow Student Discussion</h4>
                    <p className="text-sm text-gray-600">Enable discussion forums for this course</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Require Quiz Completion</h4>
                    <p className="text-sm text-gray-600">Students must pass quizzes to unlock modules</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Show Progress Timeline</h4>
                    <p className="text-sm text-gray-600">Display course progress to students</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Certificates</h4>
                    <p className="text-sm text-gray-600">Issue certificates upon course completion</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lesson Creation Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create New Lesson</h2>
                <button
                  onClick={closeLessonModal}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Lesson Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    id="lessonTitle"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter lesson title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Type
                  </label>
                  <select
                    id="lessonType"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="reading">Reading</option>
                    <option value="video">Video</option>
                    <option value="exercise">Exercise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Content
                  </label>
                  <textarea
                    id="lessonContent"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter lesson content or description"
                  />
                </div>
              </div>

              {/* Video Upload */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Upload (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {lessonVideoPreview ? (
                      <div className="space-y-4">
                        <video
                          src={lessonVideoPreview}
                          className="w-full max-w-md mx-auto rounded-lg"
                          controls
                        />
                        <button
                          type="button"
                          onClick={removeLessonVideo}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          Remove Video
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 mb-4">
                          Upload a video file (MP4, WebM, etc.) - Max 100MB
                        </p>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleLessonVideoChange}
                          className="hidden"
                          id="videoUpload"
                        />
                        <label
                          htmlFor="videoUpload"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Video
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Images Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images Upload (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {lessonImagePreviews.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {lessonImagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeLessonImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleLessonImagesChange}
                            className="hidden"
                            id="imagesUpload"
                          />
                          <label
                            htmlFor="imagesUpload"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Add More Images
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setLessonImageFiles([]);
                              setLessonImagePreviews([]);
                            }}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                          >
                            Clear All Images
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 mb-4">
                          Upload images for the lesson - Max 10MB per image
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleLessonImagesChange}
                          className="hidden"
                          id="imagesUpload"
                        />
                        <label
                          htmlFor="imagesUpload"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Images
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeLessonModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const title = (document.getElementById('lessonTitle') as HTMLInputElement)?.value;
                    const type = (document.getElementById('lessonType') as HTMLSelectElement)?.value;
                    const content = (document.getElementById('lessonContent') as HTMLTextAreaElement)?.value;
                    
                    if (!title.trim()) {
                      alert('Please enter a lesson title');
                      return;
                    }
                    
                    createLessonWithMedia({
                      title: title.trim(),
                      lesson_type: type,
                      content: content.trim(),
                      order: 1,
                      published: false
                    });
                  }}
                  disabled={uploadingLessonMedia}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingLessonMedia ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Lesson...
                    </span>
                  ) : (
                    'Create Lesson'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
