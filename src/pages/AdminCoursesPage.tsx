import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/ui/toast";
import { extractApiErrorMessage } from "@/lib/apiError";
import ProgramsSection from "@/components/admin/ProgramsSection";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  adminService,
  type AdminContent,
  type AdminCourse,
  type AdminLesson,
  type AdminModule,
} from "@/services/adminService";

function getList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const asObject = value as Record<string, unknown>;
    if (Array.isArray(asObject.data)) return asObject.data as T[];
    if (Array.isArray(asObject.items)) return asObject.items as T[];
    if (Array.isArray(asObject.results)) return asObject.results as T[];
    if (asObject.data && typeof asObject.data === "object") {
      const nested = asObject.data as Record<string, unknown>;
      if (Array.isArray(nested.items)) return nested.items as T[];
      if (Array.isArray(nested.results)) return nested.results as T[];
    }
  }
  return [];
}

function readString(record: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return fallback;
}

function readId(record: Record<string, unknown>, keys: string[]): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number") return value;
    if (typeof value === "string" && !Number.isNaN(Number(value))) return Number(value);
  }
  return 0;
}

function readNumber(record: Record<string, unknown>, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number") return value;
    if (typeof value === "string" && !Number.isNaN(Number(value))) return Number(value);
  }
  return fallback;
}

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

export default function AdminCoursesPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [feedback, setFeedback] = useState("");
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseImage, setCourseImage] = useState<File | null>(null);
  const [courseImageUrl, setCourseImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [modules, setModules] = useState<AdminModule[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleReorder, setModuleReorder] = useState("");

  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonReorder, setLessonReorder] = useState("");
  const [lessonData, setLessonData] = useState<Record<string, unknown> | null>(null);

  const [contentType, setContentType] = useState("text");
  const [contentTitle, setContentTitle] = useState("");
  const [contentBody, setContentBody] = useState("");
  const [contentImageUrl, setContentImageUrl] = useState("");
  const [contentVideoUrl, setContentVideoUrl] = useState("");
  const [contentStyleJson, setContentStyleJson] = useState('{"bold":false,"italic":false,"color":"#111827"}');
  const [contentIdForEdit, setContentIdForEdit] = useState("");

  const [useTemplateBuilder, setUseTemplateBuilder] = useState(false);
  const [templateModules, setTemplateModules] = useState<Array<{ title: string; lessons: Array<{ title: string }> }>>([
    { title: "Module 1", lessons: [{ title: "Lesson 1.1" }] }
  ]);

  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorLessons, setEditorLessons] = useState<Array<{ module: AdminModule; lesson: AdminLesson }>>([]);
  const [editorIndex, setEditorIndex] = useState(0);
  const [editorLessonData, setEditorLessonData] = useState<Record<string, unknown> | null>(null);
  const [editorSubIndex, setEditorSubIndex] = useState(0);
  const [editorActiveTab, setEditorActiveTab] = useState<"reading" | "practice" | "video">("reading");
  const [editorReadingIndex, setEditorReadingIndex] = useState(0);
  const [editorPracticeIndex, setEditorPracticeIndex] = useState(0);
  const [editorDraftMap, setEditorDraftMap] = useState<
    Record<string, { reading: EditorSection[]; practice: EditorSection[] }>
  >({});
  const [editorCurrentKey, setEditorCurrentKey] = useState("");
  const [editorVideoUrl, setEditorVideoUrl] = useState("");
  const [editorSaving, setEditorSaving] = useState(false);

  const lessonContents = useMemo(() => {
    if (!lessonData) return [] as AdminContent[];
    const fromLesson = (lessonData as Record<string, unknown>).content;
    const fromLessonPlural = (lessonData as Record<string, unknown>).contents;
    return getList<AdminContent>(fromLesson).length
      ? getList<AdminContent>(fromLesson)
      : getList<AdminContent>(fromLessonPlural);
  }, [lessonData]);

  function getLessonContentsForEditor(data: Record<string, unknown> | null) {
    if (!data) return [] as AdminContent[];
    const fromLesson = (data as Record<string, unknown>).content;
    const fromLessonPlural = (data as Record<string, unknown>).contents;
    const fromLessonAlt = (data as Record<string, unknown>).lesson_content;
    const list = getList<AdminContent>(fromLesson).length
      ? getList<AdminContent>(fromLesson)
      : getList<AdminContent>(fromLessonPlural).length
        ? getList<AdminContent>(fromLessonPlural)
        : getList<AdminContent>(fromLessonAlt);
    return list;
  }

  function normalizeContentType(item: Record<string, unknown>) {
    return String(item.content_type || item.type || "").toLowerCase();
  }

  function getContentBody(item: Record<string, unknown>, fallback = "") {
    return readString(item, ["body", "content", "text"], fallback);
  }

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;
    async function loadCourses() {
      if (!accessToken) return;
      try {
        const data = await adminService.getCourses(accessToken);
        if (isMounted) setCourses(data);
      } catch {
        if (isMounted) setCourses([]);
      }
    }
    void loadCourses();
    void loadCategories();
    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && accessToken) {
        void refreshCourses();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if ((e.key === 'courseUpdated' || e.key === 'coursesListUpdated') && accessToken) {
        void refreshCourses();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [accessToken]);

  useEffect(() => {
    if (!editorLessons.length) return;
    const current = editorLessons[editorIndex];
    if (!current) return;
    const lessonId = readId(current.lesson as Record<string, unknown>, ["id", "lessonId"]);
    if (!lessonId) return;
    setEditorSubIndex(0);
    setEditorReadingIndex(0);
    setEditorPracticeIndex(0);
    void loadEditorLesson(lessonId);
  }, [editorLessons, editorIndex]);

  useEffect(() => {
    if (!editorLessonData || !editorLessons.length) return;
    const current = editorLessons[editorIndex];
    if (!current) return;
    const lessonId = readId(current.lesson as Record<string, unknown>, ["id", "lessonId"]);
    const contents = getLessonContentsForEditor(editorLessonData);
    const subLessons = contents
      .filter((item) => normalizeContentType(item as Record<string, unknown>) === "sub_lesson")
      .sort((a, b) => {
        const aOrder = readNumber(a as Record<string, unknown>, ["order_index", "order"]);
        const bOrder = readNumber(b as Record<string, unknown>, ["order_index", "order"]);
        return aOrder - bOrder;
      });

    const currentSub = subLessons[editorSubIndex] as Record<string, unknown> | undefined;
    const rawContent = currentSub
      ? getContentBody(currentSub, "")
      : readString(editorLessonData as Record<string, unknown>, ["content"], "");
    const key = currentSub ? `sub-${readId(currentSub, ["id"])}`
      : `lesson-${lessonId}`;
    setEditorCurrentKey(key);
    setEditorActiveTab("reading");
    setEditorReadingIndex(0);
    setEditorPracticeIndex(0);
    setEditorVideoUrl(readString(editorLessonData as Record<string, unknown>, ["video_url"], ""));

    setEditorDraftMap((prev) => {
      if (prev[key]) return prev;
      const reading = parseReadingSections(rawContent);
      const practice = parsePracticeSections(rawContent);
      return { ...prev, [key]: { reading, practice } };
    });
  }, [editorLessonData, editorSubIndex, editorIndex]);

  async function loadCategories() {
    if (!accessToken) return;
    try {
      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/categories`
        : `${window.location.origin}/api/v1/admin/categories`;
        
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || data || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async function createCategory(name: string) {
    if (!accessToken || !name.trim()) return;
    
    try {
      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/categories`
        : `${window.location.origin}/api/v1/admin/categories`;
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(prev => [...prev, data.data || data]);
        addToast({ variant: "success", title: "Category created" });
      } else {
        throw new Error('Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      addToast({ variant: "destructive", title: "Failed to create category" });
    }
  }

  async function refreshCourses() {
    if (!accessToken) return;
    
    console.log('Refreshing courses...');
    try {
      const data = await adminService.getCourses(accessToken);
      console.log('Courses API response:', data);
      
      // Handle the response structure properly
      let coursesArray = [];
      if (Array.isArray(data)) {
        coursesArray = data;
      } else if (data && typeof data === 'object') {
        coursesArray = (data as any).data || (data as any).courses || [];
      } else {
        coursesArray = [];
      }
      
      console.log('Setting courses array:', coursesArray);
      setCourses(coursesArray);
    } catch (error) {
      console.error('Error refreshing courses:', error);
      setCourses([]); // Set empty array on error
    }
  }

  async function refreshModules(courseId: number) {
    if (!accessToken) return;
    const data = await adminService.getModules(courseId, accessToken);
    setModules(getList<AdminModule>(data));
  }

  async function refreshLessons(moduleId: number) {
    if (!accessToken) return;
    const data = await adminService.getLessons(moduleId, accessToken);
    const lessonsArray = Array.isArray(data) ? data : ((data as any)?.data || []);
    setLessons(lessonsArray);
  }

  async function refreshLessonDetails(lessonId: number) {
    if (!accessToken) return;
    const data = await adminService.getLesson(lessonId, accessToken);
    setLessonData((data || null) as Record<string, unknown> | null);
  }

  function buildEditorLessons(modulesData: AdminModule[]) {
    const sortedModules = [...modulesData].sort((a, b) => {
      const aOrder = readNumber(a as Record<string, unknown>, ["order_index", "order"]);
      const bOrder = readNumber(b as Record<string, unknown>, ["order_index", "order"]);
      return aOrder - bOrder;
    });

    const flattened: Array<{ module: AdminModule; lesson: AdminLesson }> = [];
    sortedModules.forEach((module) => {
      const moduleRecord = module as Record<string, unknown>;
      const moduleLessons = Array.isArray(moduleRecord.lessons)
        ? (moduleRecord.lessons as AdminLesson[])
        : [];
      const sortedLessons = [...moduleLessons].sort((a, b) => {
        const aOrder = readNumber(a as Record<string, unknown>, ["order_index", "order"]);
        const bOrder = readNumber(b as Record<string, unknown>, ["order_index", "order"]);
        return aOrder - bOrder;
      });

      sortedLessons.forEach((lesson) => {
        flattened.push({ module, lesson });
      });
    });

    return flattened;
  }

  async function loadEditor() {
    if (!accessToken || !selectedCourseId) return;
    setEditorLoaded(false);
    setEditorIndex(0);
    setEditorSubIndex(0);
    setEditorReadingIndex(0);
    setEditorPracticeIndex(0);
    setEditorDraftMap({});
    try {
      const data = await adminService.getModules(selectedCourseId, accessToken);
      const moduleList = getList<AdminModule>(data);
      setModules(moduleList);
      const flattened = buildEditorLessons(moduleList);
      setEditorLessons(flattened);
      setEditorLoaded(true);
    } catch (error) {
      setEditorLessons([]);
      setEditorLoaded(false);
      addToast({ variant: "destructive", title: "Failed to load course editor" });
    }
  }

  async function loadEditorLesson(lessonId: number) {
    if (!accessToken) return;
    const data = await adminService.getLesson(lessonId, accessToken);
    setEditorLessonData((data || null) as Record<string, unknown> | null);
  }

  async function saveEditorContent() {
    if (!accessToken || !editorLessonData || !editorLessons.length) return;
    const current = editorLessons[editorIndex];
    if (!current) return;

    const contents = getLessonContentsForEditor(editorLessonData);
    const subLessons = contents
      .filter((item) => normalizeContentType(item as Record<string, unknown>) === "sub_lesson")
      .sort((a, b) => {
        const aOrder = readNumber(a as Record<string, unknown>, ["order_index", "order"]);
        const bOrder = readNumber(b as Record<string, unknown>, ["order_index", "order"]);
        return aOrder - bOrder;
      });

    const currentSub = subLessons[editorSubIndex] as Record<string, unknown> | undefined;
    const key = currentSub ? `sub-${readId(currentSub, ["id"])}`
      : `lesson-${readId(current.lesson as Record<string, unknown>, ["id"])}`;
    const draft = editorDraftMap[key];
    if (!draft) return;

    const body = buildLessonContent(draft.reading, draft.practice);
    setEditorSaving(true);
    try {
      if (currentSub) {
        await adminService.updateContent(
          readId(currentSub, ["id"]),
          {
            content_type: normalizeContentType(currentSub),
            title: readString(currentSub, ["title"], ""),
            body,
          },
          accessToken,
        );
      } else {
        await adminService.updateLesson(
          readId(current.lesson as Record<string, unknown>, ["id"]),
          {
            content: body,
            description: body.slice(0, 220),
          },
          accessToken,
        );
      }
      await loadEditorLesson(readId(current.lesson as Record<string, unknown>, ["id"]));
      addToast({ variant: "success", title: "Lesson content updated" });
    } catch (error) {
      addToast({ variant: "destructive", title: "Update failed", description: extractApiErrorMessage(error) });
    } finally {
      setEditorSaving(false);
    }
  }

  function updateEditorSection(kind: "reading" | "practice", index: number, value: string) {
    if (!editorCurrentKey) return;
    setEditorDraftMap((prev) => {
      const draft = prev[editorCurrentKey] || { reading: [], practice: [] };
      const list = [...draft[kind]];
      if (!list[index]) return prev;
      list[index] = { ...list[index], body: value };
      return { ...prev, [editorCurrentKey]: { ...draft, [kind]: list } };
    });
  }

  function addEditorSection(kind: "reading" | "practice", title: string) {
    if (!editorCurrentKey) return;
    setEditorDraftMap((prev) => {
      const draft = prev[editorCurrentKey] || { reading: [], practice: [] };
      const list = [...draft[kind]];
      list.push({
        title,
        body: "",
        colon: kind === "practice" && PRACTICE_SECTION_TITLES_WITH_COLON.has(title),
      });
      return { ...prev, [editorCurrentKey]: { ...draft, [kind]: list } };
    });
  }

  async function saveEditorVideo() {
    if (!accessToken || !editorLessons.length) return;
    const current = editorLessons[editorIndex];
    if (!current) return;
    setEditorSaving(true);
    try {
      await adminService.updateLesson(
        readId(current.lesson as Record<string, unknown>, ["id"]),
        { video_url: editorVideoUrl.trim() || null },
        accessToken,
      );
      await loadEditorLesson(readId(current.lesson as Record<string, unknown>, ["id"]));
      addToast({ variant: "success", title: "Video URL updated" });
    } catch (error) {
      addToast({ variant: "destructive", title: "Update failed", description: extractApiErrorMessage(error) });
    } finally {
      setEditorSaving(false);
    }
  }

  async function uploadCourseImage(file: File): Promise<string> {
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
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setCourseImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  }

  function removeImage() {
    setCourseImage(null);
    setCourseImageUrl("");
    setImagePreview("");
  }

  async function createCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    setFeedback("");
    try {
      // Upload image first if provided
      let thumbnailUrl = "";
      if (courseImage) {
        thumbnailUrl = await uploadCourseImage(courseImage);
      }

      const created = await adminService.createCourse(
        { 
          title: courseTitle.trim(), 
          description: courseDescription.trim(),
          thumbnail_url: thumbnailUrl,
          category_id: selectedCategory ? parseInt(selectedCategory) : null
        },
        accessToken,
      );
      if (useTemplateBuilder) {
        const templateContent = buildTemplateContent();
        for (const module of templateModules) {
          const moduleTitle = module.title.trim() || "Module";
          const createdModule = await adminService.createModule(
            Number(created.id),
            { title: moduleTitle },
            accessToken
          );
          for (const lesson of module.lessons) {
            const lessonTitleValue = lesson.title.trim() || "Lesson";
            await adminService.createLesson(
              Number((createdModule as Record<string, unknown>).id),
              {
                title: lessonTitleValue,
                lesson_type: "video",
                content: templateContent,
                description: templateContent.slice(0, 220),
              },
              accessToken
            );
          }
        }
      }
      setCourses((previous) => [created, ...previous]);
      setCourseTitle("");
      setCourseDescription("");
      setCourseImage(null);
      setCourseImageUrl("");
      setImagePreview("");
      setSelectedCategory("");
      setFeedback("Course created.");
      addToast({ variant: "success", title: "Course created" });
      if (useTemplateBuilder) {
        navigate(`/admin/courses/${(created as Record<string, unknown>).id}`);
      }
    } catch (error) {
      setFeedback("Unable to create course.");
      addToast({ variant: "destructive", title: "Create failed", description: extractApiErrorMessage(error) });
    }
  }

  async function loadCourseTemplate() {
    if (!accessToken) return;
    setFeedback("");
    try {
      const template = await adminService.getCourseTemplate(accessToken);
      const courseTemplate = (template.course || {}) as Record<string, unknown>;
      const contentTemplate = (template.lesson_content || {}) as Record<string, unknown>;
      setCourseTitle(String(courseTemplate.title || ""));
      setCourseDescription(String(courseTemplate.description || ""));
      setContentStyleJson(JSON.stringify(contentTemplate.style_json || { bold: false }, null, 0));
      setFeedback("Template loaded. Edit and create.");
    } catch {
      setFeedback("Unable to load course template.");
    }
  }

  async function updateSelectedCourse() {
    if (!accessToken || !selectedCourseId) return;
    setFeedback("");
    try {
      let thumbnailUrl = courseImageUrl;
      if (courseImage) {
        thumbnailUrl = await uploadCourseImage(courseImage);
      }
      const updated = await adminService.updateCourse(
        selectedCourseId,
        {
          title: courseTitle.trim(),
          description: courseDescription.trim(),
          thumbnail_url: thumbnailUrl || null,
        },
        accessToken,
      );
      setCourses((previous) =>
        previous.map((course) => (Number(course.id) === selectedCourseId ? updated : course)),
      );
      if (courseImage) {
        setCourseImage(null);
        setCourseImageUrl(thumbnailUrl || "");
        setImagePreview(thumbnailUrl || "");
      }
      setFeedback("Course updated.");
    } catch (error) {
      setFeedback("Unable to update course.");
      addToast({ variant: "destructive", title: "Update failed", description: extractApiErrorMessage(error) });
    }
  }

  async function selectCourse(course: AdminCourse) {
    const courseId = Number(course.id);
    setSelectedCourseId(courseId);
    setSelectedModuleId(null);
    setSelectedLessonId(null);
    setLessonData(null);
    const record = course as Record<string, unknown>;
    setCourseTitle(readString(record, ["title", "name"]));
    setCourseDescription(readString(record, ["description", "summary"]));
    const thumbnailUrl = readString(record, ["thumbnail_url", "thumbnail", "image_url"], "");
    setCourseImageUrl(thumbnailUrl);
    setImagePreview(thumbnailUrl);
    setCourseImage(null);
    try {
      await refreshModules(courseId);
    } catch {
      setModules([]);
    }
  }

  async function runCourseAction(action: "publish" | "unpublish" | "duplicate" | "delete") {
    if (!accessToken || !selectedCourseId) return;
    setFeedback("");
    try {
      if (action === "publish") {
        await adminService.publishCourse(selectedCourseId, accessToken);
      } else if (action === "unpublish") {
        await adminService.unpublishCourse(selectedCourseId, accessToken);
      } else if (action === "duplicate") {
        await adminService.duplicateCourse(selectedCourseId, accessToken);
      } else {
        if (!window.confirm(`Delete course #${selectedCourseId}?`)) return;
        await adminService.deleteCourse(selectedCourseId, accessToken);
        setCourses((previous) => previous.filter((course) => Number(course.id) !== selectedCourseId));
        setSelectedCourseId(null);
        setModules([]);
        setLessons([]);
        setLessonData(null);
      }
      const refreshed = await adminService.getCourses(accessToken);
      setCourses(refreshed);
      if (selectedCourseId) {
        await refreshModules(selectedCourseId);
      }
      setFeedback(`Course ${action} action completed.`);
    } catch (error) {
      setFeedback(`Unable to ${action} course.`);
      addToast({ variant: "destructive", title: `${action} failed`, description: extractApiErrorMessage(error) });
    }
  }

  async function createModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !selectedCourseId) return;
    setFeedback("");
    try {
      await adminService.createModule(selectedCourseId, { title: moduleTitle.trim() }, accessToken);
      setModuleTitle("");
      await refreshModules(selectedCourseId);
      setFeedback("Module created.");
    } catch (error) {
      setFeedback("Unable to create module.");
      addToast({ variant: "destructive", title: "Create module failed", description: extractApiErrorMessage(error) });
    }
  }

  async function updateOrDeleteModule(moduleId: number, mode: "update" | "delete", title?: string) {
    if (!accessToken) return;
    setFeedback("");
    try {
      if (mode === "update") {
        const nextTitle = window.prompt("Enter updated module title", title || "");
        if (!nextTitle || !nextTitle.trim()) {
          setFeedback("Module update canceled.");
          return;
        }
        await adminService.updateModule(moduleId, { title: nextTitle.trim() }, accessToken);
      } else {
        if (!window.confirm(`Delete module #${moduleId}?`)) return;
        await adminService.deleteModule(moduleId, accessToken);
      }
      if (selectedCourseId) await refreshModules(selectedCourseId);
      setFeedback(`Module ${mode}d.`);
    } catch (error) {
      setFeedback(`Unable to ${mode} module.`);
      addToast({ variant: "destructive", title: `${mode} module failed`, description: extractApiErrorMessage(error) });
    }
  }

  async function reorderModules() {
    if (!accessToken) return;
    const moduleIds = moduleReorder
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => !Number.isNaN(value) && value > 0);
    if (!moduleIds.length) return;
    setFeedback("");
    try {
      await adminService.reorderModules(moduleIds, accessToken);
      if (selectedCourseId) await refreshModules(selectedCourseId);
      setFeedback("Modules reordered.");
    } catch (error) {
      setFeedback("Unable to reorder modules.");
      addToast({ variant: "destructive", title: "Reorder modules failed", description: extractApiErrorMessage(error) });
    }
  }

  async function selectModule(module: AdminModule) {
    const moduleId = Number((module as Record<string, unknown>).id);
    setSelectedModuleId(moduleId);
    setSelectedLessonId(null);
    setLessonData(null);
    try {
      await refreshLessons(moduleId);
    } catch {
      setLessons([]);
    }
  }

  async function createLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !selectedModuleId) return;
    setFeedback("");
    try {
      await adminService.createLesson(selectedModuleId, { title: lessonTitle.trim() }, accessToken);
      setLessonTitle("");
      await refreshLessons(selectedModuleId);
      setFeedback("Lesson created.");
    } catch (error) {
      setFeedback("Unable to create lesson.");
      addToast({ variant: "destructive", title: "Create lesson failed", description: extractApiErrorMessage(error) });
    }
  }

  async function updateOrDeleteLesson(lessonId: number, mode: "update" | "delete", title?: string) {
    if (!accessToken) return;
    setFeedback("");
    try {
      if (mode === "update") {
        const nextTitle = window.prompt("Enter updated lesson title", title || "");
        if (!nextTitle || !nextTitle.trim()) {
          setFeedback("Lesson update canceled.");
          return;
        }
        await adminService.updateLesson(lessonId, { title: nextTitle.trim() }, accessToken);
      } else {
        if (!window.confirm(`Delete lesson #${lessonId}?`)) return;
        await adminService.deleteLesson(lessonId, accessToken);
      }
      if (selectedModuleId) await refreshLessons(selectedModuleId);
      setFeedback(`Lesson ${mode}d.`);
    } catch (error) {
      setFeedback(`Unable to ${mode} lesson.`);
      addToast({ variant: "destructive", title: `${mode} lesson failed`, description: extractApiErrorMessage(error) });
    }
  }

  async function reorderLessons() {
    if (!accessToken) return;
    const lessonIds = lessonReorder
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => !Number.isNaN(value) && value > 0);
    if (!lessonIds.length) return;
    setFeedback("");
    try {
      await adminService.reorderLessons(lessonIds, accessToken);
      if (selectedModuleId) await refreshLessons(selectedModuleId);
      setFeedback("Lessons reordered.");
    } catch (error) {
      setFeedback("Unable to reorder lessons.");
      addToast({ variant: "destructive", title: "Reorder lessons failed", description: extractApiErrorMessage(error) });
    }
  }

  async function selectLesson(lesson: AdminLesson) {
    const lessonId = Number((lesson as Record<string, unknown>).id);
    setSelectedLessonId(lessonId);
    try {
      await refreshLessonDetails(lessonId);
    } catch {
      setLessonData(null);
    }
  }

  async function createContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !selectedLessonId) return;
    setFeedback("");
    try {
      await adminService.createLessonContent(
        selectedLessonId,
        {
          content_type: contentType,
          title: contentTitle.trim(),
          body: contentBody.trim(),
          image_url: contentImageUrl.trim() || null,
          video_url: contentVideoUrl.trim() || null,
          style_json: JSON.parse(contentStyleJson || "{}"),
        },
        accessToken,
      );
      await refreshLessonDetails(selectedLessonId);
      setContentTitle("");
      setContentBody("");
      setContentImageUrl("");
      setContentVideoUrl("");
      setFeedback("Lesson content created.");
    } catch (error) {
      setFeedback("Unable to create content.");
      addToast({ variant: "destructive", title: "Create content failed", description: extractApiErrorMessage(error) });
    }
  }

  async function updateOrDeleteContent(mode: "update" | "delete") {
    if (!accessToken || !contentIdForEdit.trim()) return;
    const contentId = Number(contentIdForEdit.trim());
    if (Number.isNaN(contentId) || contentId <= 0) return;
    setFeedback("");
    try {
      if (mode === "update") {
        await adminService.updateContent(
          contentId,
          {
            content_type: contentType,
            title: contentTitle.trim(),
            body: contentBody.trim(),
            image_url: contentImageUrl.trim() || null,
            video_url: contentVideoUrl.trim() || null,
            style_json: JSON.parse(contentStyleJson || "{}"),
          },
          accessToken,
        );
      } else {
        if (!window.confirm(`Delete content #${contentId}?`)) return;
        await adminService.deleteContent(contentId, accessToken);
      }
      if (selectedLessonId) await refreshLessonDetails(selectedLessonId);
      setFeedback(`Content ${mode}d.`);
    } catch (error) {
      setFeedback(`Unable to ${mode} content.`);
      addToast({ variant: "destructive", title: `${mode} content failed`, description: extractApiErrorMessage(error) });
    }
  }

  const editorCurrent = editorLessons[editorIndex];
  const editorContents = getLessonContentsForEditor(editorLessonData);
  const editorSubLessons = editorContents
    .filter((item) => normalizeContentType(item as Record<string, unknown>) === "sub_lesson")
    .sort((a, b) => {
      const aOrder = readNumber(a as Record<string, unknown>, ["order_index", "order"]);
      const bOrder = readNumber(b as Record<string, unknown>, ["order_index", "order"]);
      return aOrder - bOrder;
    });
  const editorDraft = editorDraftMap[editorCurrentKey] || { reading: [], practice: [] };
  const editorReadingSection = editorDraft.reading[editorReadingIndex];
  const editorPracticeSection = editorDraft.practice[editorPracticeIndex];

  return (
    <AdminLayout title="Admin Course Management" subtitle="Manage courses, modules, lessons, and lesson content.">
      {feedback ? <p className="mt-2 text-sm text-emerald-300">{feedback}</p> : null}

      <section className="admin-card mt-5">
        <h2 className="text-lg font-semibold">Create Course</h2>
        <div className="mt-2">
          <button className="admin-btn" type="button" onClick={() => void loadCourseTemplate()}>
            Load Backend Template
          </button>
        </div>
        <form className="mt-3 space-y-4" onSubmit={createCourse}>
          {/* Image Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex flex-col items-center">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Course thumbnail preview" 
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <p className="text-sm">Course thumbnail image</p>
                  <p className="text-xs">Recommended: 300x200px, Max 5MB</p>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="course-image-upload"
              />
              
              <label
                htmlFor="course-image-upload"
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {imagePreview ? 'Change Image' : 'Upload Image'}
              </label>
            </div>
          </div>

          {/* Category Selection */}
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Course Category</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="New category name"
                  className="px-3 py-2 border border-gray-300 rounded-l text-sm"
                  id="new-category-input"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('new-category-input') as HTMLInputElement;
                    if (input.value.trim()) {
                      void createCategory(input.value);
                      input.value = '';
                    }
                  }}
                  className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Add Category
                </button>
              </div>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Course Details */}
          <div className="grid gap-2 md:grid-cols-3">
            <input
              className="admin-input rounded border p-3 text-base font-medium bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Course title"
              value={courseTitle}
              onChange={(event) => setCourseTitle(event.target.value)}
              required
            />
            <input
              className="admin-input rounded border p-3 text-base font-medium bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Course description"
              value={courseDescription}
              onChange={(event) => setCourseDescription(event.target.value)}
              required
            />
            <button className="admin-btn-primary" type="submit">
              Add Course
            </button>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="use-template-builder"
              type="checkbox"
              checked={useTemplateBuilder}
              onChange={(event) => setUseTemplateBuilder(event.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="use-template-builder" className="text-sm text-slate-200">
              Create with lesson template (editable module & lesson titles)
            </label>
          </div>

          {useTemplateBuilder && (
            <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-100">Template Structure</h3>
                <button
                  type="button"
                  className="admin-btn"
                  onClick={addTemplateModule}
                >
                  Add Module
                </button>
              </div>
              <div className="space-y-4">
                {templateModules.map((module, moduleIndex) => (
                  <div key={`module-${moduleIndex}`} className="rounded border border-slate-700 bg-slate-950/60 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        className="admin-input rounded border p-2 text-black"
                        value={module.title}
                        onChange={(event) => updateTemplateModuleTitle(moduleIndex, event.target.value)}
                        placeholder={`Module ${moduleIndex + 1} title`}
                      />
                      <button
                        type="button"
                        className="admin-btn"
                        onClick={() => addTemplateLesson(moduleIndex)}
                      >
                        Add Lesson
                      </button>
                      <button
                        type="button"
                        className="rounded border border-red-500/40 bg-red-900/30 px-2 py-1 text-xs text-red-200"
                        onClick={() => removeTemplateModule(moduleIndex)}
                      >
                        Remove Module
                      </button>
                    </div>
                    <div className="mt-3 space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={`lesson-${moduleIndex}-${lessonIndex}`} className="flex flex-wrap items-center gap-2">
                          <input
                            className="admin-input rounded border p-2 text-black flex-1"
                            value={lesson.title}
                            onChange={(event) => updateTemplateLessonTitle(moduleIndex, lessonIndex, event.target.value)}
                            placeholder={`Lesson ${moduleIndex + 1}.${lessonIndex + 1} title`}
                          />
                          <button
                            type="button"
                            className="rounded border border-red-500/40 bg-red-900/30 px-2 py-1 text-xs text-red-200"
                            onClick={() => removeTemplateLesson(moduleIndex, lessonIndex)}
                          >
                            Remove Lesson
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400">
                Each lesson is created with the standard page sections (Reading + Practice) so you can edit them in the sequential editor.
              </p>
            </div>
          )}
        </form>
      </section>

      {/* Programs Section */}
      <ProgramsSection accessToken={accessToken || ''} />

      <section className="admin-card mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Courses ({courses.length})</h2>
          <button
            onClick={() => void refreshCourses()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 15m0 0A8.001 8.001 0 004.582 9m0 0H4.582m15.356-2A8.001 8.001 0 004.582 9m0 0A8.001 8.001 0 004.582 15m0 0A8.001 8.001 0 004.582 9m0 0H4.582" />
            </svg>
            Refresh Courses
          </button>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {courses.map((course) => {
            const record = course as Record<string, unknown>;
            const id = readId(record, ["id", "courseId"]);
            const title = readString(record, ["title", "name"], "Untitled");
            const thumbnailUrl = readString(record, ["thumbnail_url"], "");
            const categoryName = readString(record, ["category_name"], "Uncategorized");
            
            return (
              <div
                key={id || Math.random()}
                className={`rounded border border-slate-700 p-3 text-left ${
                  selectedCourseId === id ? "border-cyan-500/50 bg-slate-800" : "bg-slate-900/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{title}</p>
                    <p className="text-xs text-slate-400">ID: {id}</p>
                    <p className="text-xs text-slate-400 mt-1">Category: {categoryName}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/courses/${id}`)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Manage Course
                  </button>
                </div>
                
                {/* Only show image if it actually exists */}
                {thumbnailUrl && thumbnailUrl.trim() !== "" && (
                  <div className="mt-3 flex justify-center">
                    <img 
                      src={thumbnailUrl} 
                      alt={title}
                      className="w-16 h-16 object-cover rounded border border-slate-600"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {selectedCourseId ? (
        <section className="admin-card mt-5">
          <h2 className="text-lg font-semibold">Selected Course: {selectedCourseId}</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            <input
              className="admin-input rounded border p-2"
              placeholder="Course title"
              value={courseTitle}
              onChange={(event) => setCourseTitle(event.target.value)}
            />
            <input
              className="admin-input rounded border p-2"
              placeholder="Course description"
              value={courseDescription}
              onChange={(event) => setCourseDescription(event.target.value)}
            />
            <button className="admin-btn" type="button" onClick={() => void updateSelectedCourse()}>
              Update Course
            </button>
          </div>
          <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900/40 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Current course thumbnail"
                    className="h-20 w-20 rounded-lg object-cover border border-slate-600"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-slate-600 text-xs text-slate-400">
                    No image
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-200">Course Image</p>
                  <p className="text-xs text-slate-400">Upload a new image to replace the current one.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="course-image-update-upload"
                />
                <label
                  htmlFor="course-image-update-upload"
                  className="admin-btn cursor-pointer"
                >
                  {imagePreview ? "Change Image" : "Upload Image"}
                </label>
                {imagePreview ? (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="rounded border border-red-500/40 bg-red-900/30 px-3 py-2 text-sm text-red-200"
                  >
                    Remove Image
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="admin-btn" type="button" onClick={() => void runCourseAction("publish")}>
              Publish
            </button>
            <button className="admin-btn" type="button" onClick={() => void runCourseAction("unpublish")}>
              Unpublish
            </button>
            <button className="admin-btn" type="button" onClick={() => void runCourseAction("duplicate")}>
              Duplicate
            </button>
            <button
              className="rounded border border-red-500/40 bg-red-900/30 p-2 text-sm text-red-200"
              type="button"
              onClick={() => void runCourseAction("delete")}
            >
              Delete
            </button>
          </div>
        </section>
      ) : null}

      {selectedCourseId ? (
        <section className="admin-card mt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">Sequential Course Editor</h2>
              <p className="text-xs text-slate-400">
                Edit the course step-by-step (module → lesson → reading/practice pages).
              </p>
            </div>
            <button className="admin-btn" type="button" onClick={() => void loadEditor()}>
              Load Editor
            </button>
          </div>

          {!editorLoaded ? (
            <p className="mt-3 text-sm text-slate-400">Load the editor to begin editing lesson content.</p>
          ) : editorLessons.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No lessons found for this course.</p>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="rounded border border-slate-700 bg-slate-900/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400">
                      Module: {readString(editorCurrent?.module as Record<string, unknown>, ["title", "name"], "Module")}
                    </p>
                    <h3 className="text-base font-semibold">
                      Lesson: {readString(editorCurrent?.lesson as Record<string, unknown>, ["title", "name"], "Lesson")}
                    </h3>
                    {editorSubLessons.length > 0 ? (
                      <p className="text-xs text-slate-400 mt-1">
                        Sub-lesson {editorSubIndex + 1} of {editorSubLessons.length}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      className="admin-btn"
                      type="button"
                      onClick={() => {
                        if (editorIndex === 0) return;
                        setEditorIndex(editorIndex - 1);
                      }}
                    >
                      Previous Lesson
                    </button>
                    <button
                      className="admin-btn"
                      type="button"
                      onClick={() => {
                        if (editorIndex >= editorLessons.length - 1) return;
                        setEditorIndex(editorIndex + 1);
                      }}
                    >
                      Next Lesson
                    </button>
                  </div>
                </div>

                {editorSubLessons.length > 0 ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      className="admin-btn"
                      type="button"
                      onClick={() => {
                        if (editorSubIndex === 0) return;
                        setEditorSubIndex(editorSubIndex - 1);
                      }}
                    >
                      Previous Sub-lesson
                    </button>
                    <button
                      className="admin-btn"
                      type="button"
                      onClick={() => {
                        if (editorSubIndex >= editorSubLessons.length - 1) return;
                        setEditorSubIndex(editorSubIndex + 1);
                      }}
                    >
                      Next Sub-lesson
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2 border-b border-slate-700 pb-2">
                <button
                  className={`admin-btn ${editorActiveTab === "video" ? "bg-slate-700/80" : ""}`}
                  type="button"
                  onClick={() => setEditorActiveTab("video")}
                >
                  Video
                </button>
                <button
                  className={`admin-btn ${editorActiveTab === "reading" ? "bg-slate-700/80" : ""}`}
                  type="button"
                  onClick={() => setEditorActiveTab("reading")}
                >
                  Reading Notes
                </button>
                <button
                  className={`admin-btn ${editorActiveTab === "practice" ? "bg-slate-700/80" : ""}`}
                  type="button"
                  onClick={() => setEditorActiveTab("practice")}
                >
                  Practice / Exercises
                </button>
              </div>

              {editorActiveTab === "video" ? (
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Video URL</label>
                  <input
                    className="admin-input w-full rounded border p-2 text-black"
                    value={editorVideoUrl}
                    onChange={(event) => setEditorVideoUrl(event.target.value)}
                    placeholder="https://..."
                  />
                  <div className="flex items-center gap-2">
                    <button className="admin-btn-primary" type="button" onClick={() => void saveEditorVideo()}>
                      {editorSaving ? "Saving..." : "Save Video"}
                    </button>
                  </div>
                </div>
              ) : null}

              {editorActiveTab === "reading" ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Page {editorReadingIndex + 1} of {editorDraft.reading.length || 1}
                  </p>
                  <h4 className="text-sm font-semibold">
                    {editorReadingSection?.title || "Reading Notes"}
                  </h4>
                  <div className="text-gray-900">
                    <RichTextEditor
                      value={editorReadingSection?.body || ""}
                      onChange={(value) => updateEditorSection("reading", editorReadingIndex, value)}
                      height="260px"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      className="admin-btn"
                      type="button"
                      onClick={() => {
                        if (editorReadingIndex === 0) return;
                        setEditorReadingIndex(editorReadingIndex - 1);
                      }}
                    >
                      Previous Page
                    </button>
                    <button
                      className="admin-btn"
                      type="button"
                      onClick={() => {
                        if (editorReadingIndex >= editorDraft.reading.length - 1) return;
                        setEditorReadingIndex(editorReadingIndex + 1);
                      }}
                    >
                      Next Page
                    </button>
                    <button
                      className="admin-btn"
                      type="button"
                      onClick={() => addEditorSection("reading", "Reading Notes")}
                    >
                      Add Reading Page
                    </button>
                    <button className="admin-btn-primary" type="button" onClick={() => void saveEditorContent()}>
                      {editorSaving ? "Saving..." : "Save Lesson Content"}
                    </button>
                  </div>
                </div>
              ) : null}

              {editorActiveTab === "practice" ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Page {editorPracticeIndex + 1} of {editorDraft.practice.length || 1}
                  </p>
                  <h4 className="text-sm font-semibold">
                    {editorPracticeSection?.title || "Practice"}
                  </h4>
                  <div className="text-gray-900">
                    <RichTextEditor
                      value={editorPracticeSection?.body || ""}
                      onChange={(value) => updateEditorSection("practice", editorPracticeIndex, value)}
                      height="260px"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      className="admin-btn"
                      type="button"
                      onClick={() => {
                        if (editorPracticeIndex === 0) return;
                        setEditorPracticeIndex(editorPracticeIndex - 1);
                      }}
                    >
                      Previous Page
                    </button>
                    <button
                      className="admin-btn"
                      type="button"
                      onClick={() => {
                        if (editorPracticeIndex >= editorDraft.practice.length - 1) return;
                        setEditorPracticeIndex(editorPracticeIndex + 1);
                      }}
                    >
                      Next Page
                    </button>
                    <button
                      className="admin-btn"
                      type="button"
                      onClick={() => addEditorSection("practice", "Practice Steps")}
                    >
                      Add Practice Page
                    </button>
                    <button className="admin-btn-primary" type="button" onClick={() => void saveEditorContent()}>
                      {editorSaving ? "Saving..." : "Save Lesson Content"}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </section>
      ) : null}

      {selectedCourseId ? (
        <section className="admin-card mt-5">
          <h2 className="text-lg font-semibold">Modules</h2>
          <form className="mt-3 flex gap-2" onSubmit={createModule}>
            <input
              className="admin-input w-full rounded border p-2 text-black"
              placeholder="New module title"
              value={moduleTitle}
              onChange={(event) => setModuleTitle(event.target.value)}
              required
            />
            <button className="admin-btn-primary" type="submit">
              Add Module
            </button>
          </form>
          <div className="mt-3 flex gap-2">
            <input
              className="admin-input w-full rounded border p-2 text-black"
              placeholder="Reorder module IDs e.g. 3,1,2"
              value={moduleReorder}
              onChange={(event) => setModuleReorder(event.target.value)}
            />
            <button className="admin-btn" type="button" onClick={() => void reorderModules()}>
              Reorder
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {modules.map((module) => {
              const moduleRecord = module as Record<string, unknown>;
              const moduleId = readId(moduleRecord, ["id", "moduleId"]);
              const title = readString(moduleRecord, ["title", "name"], "Untitled module");
              return (
                <div key={moduleId} className="rounded border border-slate-700 bg-slate-900/50 p-3">
                  <button
                    type="button"
                    onClick={() => void selectModule(module)}
                    className={`font-medium ${selectedModuleId === moduleId ? "underline" : ""}`}
                  >
                    {title} (ID: {moduleId})
                  </button>
                  <div className="mt-2 flex gap-2">
                    <button
                      className="admin-btn"
                      type="button"
                      onClick={() => void updateOrDeleteModule(moduleId, "update", title)}
                    >
                      Update
                    </button>
                    <button
                      className="rounded border border-red-500/40 bg-red-900/30 px-2 py-1 text-xs text-red-200"
                      type="button"
                      onClick={() => void updateOrDeleteModule(moduleId, "delete")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {selectedModuleId ? (
        <section className="admin-card mt-5">
          <h2 className="text-lg font-semibold">Lessons (Module {selectedModuleId})</h2>
          <form className="mt-3 flex gap-2" onSubmit={createLesson}>
            <input
              className="admin-input w-full rounded border p-2 text-black"
              placeholder="New lesson title"
              value={lessonTitle}
              onChange={(event) => setLessonTitle(event.target.value)}
              required
            />
            <button className="admin-btn-primary" type="submit">
              Add Lesson
            </button>
          </form>
          <div className="mt-3 flex gap-2">
            <input
              className="admin-input w-full rounded border p-2 text-black"
              placeholder="Reorder lesson IDs e.g. 7,8,6"
              value={lessonReorder}
              onChange={(event) => setLessonReorder(event.target.value)}
            />
            <button className="admin-btn" type="button" onClick={() => void reorderLessons()}>
              Reorder
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {lessons.map((lesson) => {
              const lessonRecord = lesson as Record<string, unknown>;
              const lessonId = readId(lessonRecord, ["id", "lessonId"]);
              const title = readString(lessonRecord, ["title", "name"], "Untitled lesson");
              return (
                <div key={lessonId} className="rounded border border-slate-700 bg-slate-900/50 p-3">
                  <button
                    type="button"
                    onClick={() => void selectLesson(lesson)}
                    className={`font-medium ${selectedLessonId === lessonId ? "underline" : ""}`}
                  >
                    {title} (ID: {lessonId})
                  </button>
                  <div className="mt-2 flex gap-2">
                    <button
                      className="admin-btn"
                      type="button"
                      onClick={() => void updateOrDeleteLesson(lessonId, "update", title)}
                    >
                      Update
                    </button>
                    <button
                      className="rounded border border-red-500/40 bg-red-900/30 px-2 py-1 text-xs text-red-200"
                      type="button"
                      onClick={() => void updateOrDeleteLesson(lessonId, "delete")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {selectedLessonId ? (
        <section className="admin-card mt-5">
          <h2 className="text-lg font-semibold">Lesson Content (Lesson {selectedLessonId})</h2>
          <p className="mt-1 text-xs text-slate-400">
            Existing content IDs:{" "}
            {lessonContents.length
              ? lessonContents
                  .map((item) => (item as Record<string, unknown>).id)
                  .filter(Boolean)
                  .join(", ")
              : "none"}
          </p>
          <form className="mt-3 grid gap-2 md:grid-cols-4" onSubmit={createContent}>
            <input
              className="admin-input rounded border p-2 text-black"
              placeholder="Type (text/video/file)"
              value={contentType}
              onChange={(event) => setContentType(event.target.value)}
            />
            <input
              className="admin-input rounded border p-2 text-black"
              placeholder="Content title"
              value={contentTitle}
              onChange={(event) => setContentTitle(event.target.value)}
            />
            <input
              className="admin-input rounded border p-2 text-black"
              placeholder="Body / URL / text"
              value={contentBody}
              onChange={(event) => setContentBody(event.target.value)}
            />
            <input
              className="admin-input rounded border p-2 text-black"
              placeholder="Image URL"
              value={contentImageUrl}
              onChange={(event) => setContentImageUrl(event.target.value)}
            />
            <input
              className="admin-input rounded border p-2 text-black"
              placeholder="Video URL"
              value={contentVideoUrl}
              onChange={(event) => setContentVideoUrl(event.target.value)}
            />
            <input
              className="admin-input rounded border p-2 md:col-span-2 text-black"
              placeholder='Style JSON, e.g. {"bold":true,"italic":false,"color":"#111827"}'
              value={contentStyleJson}
              onChange={(event) => setContentStyleJson(event.target.value)}
            />
            <button className="admin-btn-primary" type="submit">
              Add Content
            </button>
          </form>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            <input
              className="admin-input rounded border p-2"
              placeholder="Content ID to update/delete"
              value={contentIdForEdit}
              onChange={(event) => setContentIdForEdit(event.target.value)}
            />
            <button className="admin-btn" type="button" onClick={() => void updateOrDeleteContent("update")}>
              Update Content
            </button>
            <button
              className="rounded border border-red-500/40 bg-red-900/30 px-4 py-2 text-red-200"
              type="button"
              onClick={() => void updateOrDeleteContent("delete")}
            >
              Delete Content
            </button>
          </div>
        </section>
      ) : null}
    </AdminLayout>
  );
}
  function buildTemplateContent() {
    const reading = [
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
    const practice = [
      "Practice Steps:",
      "Reflection Questions:",
      "Weekly Challenge Checklist:",
      "Common Mistakes:",
      "Weekly Challenge",
      "Coaching Questions",
      "Application Prompt"
    ];
    return [...reading, ...practice].join("\n\n");
  }

  function addTemplateModule() {
    setTemplateModules((prev) => [...prev, { title: `Module ${prev.length + 1}`, lessons: [{ title: "Lesson 1.1" }] }]);
  }

  function removeTemplateModule(index: number) {
    setTemplateModules((prev) => prev.filter((_, idx) => idx !== index));
  }

  function updateTemplateModuleTitle(index: number, value: string) {
    setTemplateModules((prev) =>
      prev.map((module, idx) => (idx === index ? { ...module, title: value } : module))
    );
  }

  function addTemplateLesson(moduleIndex: number) {
    setTemplateModules((prev) =>
      prev.map((module, idx) =>
        idx === moduleIndex
          ? { ...module, lessons: [...module.lessons, { title: `Lesson ${module.lessons.length + 1}` }] }
          : module
      )
    );
  }

  function removeTemplateLesson(moduleIndex: number, lessonIndex: number) {
    setTemplateModules((prev) =>
      prev.map((module, idx) =>
        idx === moduleIndex
          ? { ...module, lessons: module.lessons.filter((_, lIdx) => lIdx !== lessonIndex) }
          : module
      )
    );
  }

  function updateTemplateLessonTitle(moduleIndex: number, lessonIndex: number, value: string) {
    setTemplateModules((prev) =>
      prev.map((module, idx) =>
        idx === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.map((lesson, lIdx) =>
                lIdx === lessonIndex ? { ...lesson, title: value } : lesson
              )
            }
          : module
      )
    );
  }
