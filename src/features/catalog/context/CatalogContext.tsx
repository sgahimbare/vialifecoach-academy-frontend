import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Course, FilterState } from '../types/coursetypes';
import { courseService } from '@/services/courseService';

interface CatalogContextType {
  courses: Course[];
  filteredCourses: Course[];
  filters: FilterState;
  categories: string[];
  updateFilter: (key: keyof FilterState, value: any) => void;
  resetFilters: () => void;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

const initialFilters: FilterState = {
  searchTerm: '',
  selectedCategory: '',
  selectedSkillLevels: [],
  selectedFormats: [],
  selectedTags: [],
  selectedLanguage: '',
};

export const CatalogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    let isMounted = true;

    async function loadCourses() {
      try {
        const backendCourses = await courseService.getCourses();
        if (!isMounted) return;

        const mappedCourses: Course[] = backendCourses.map((course) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          duration: '2-3 hours',
          format: 'Self-paced',
          skillLevel: 'Beginner',
          category: 'Life Coaching',
          tags: ['Popular'],
          language: 'English',
          image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200&auto=format&fit=crop',
          instructor: course.instructor?.name || 'Vialifecoach Academy',
          rating: 4.8,
          enrolled: 0,
        }));

        setCourses(mappedCourses);
        setFilteredCourses(mappedCourses);
      } catch {
        if (!isMounted) return;
        setCourses([]);
        setFilteredCourses([]);
      }
    }

    void loadCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [...new Set(courses.map(course => course.category))];

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // Fuzzy search function
  const fuzzySearch = (searchTerm: string, text: string): boolean => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const target = text.toLowerCase();
    
    // Direct match
    if (target.includes(search)) return true;
    
    // Fuzzy match - allow for some character differences
    let searchIndex = 0;
    for (let i = 0; i < target.length && searchIndex < search.length; i++) {
      if (target[i] === search[searchIndex]) {
        searchIndex++;
      }
    }
    return searchIndex === search.length;
  };

  useEffect(() => {
    let filtered = courses;

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(course =>
        fuzzySearch(filters.searchTerm, course.title) ||
        fuzzySearch(filters.searchTerm, course.description) ||
        fuzzySearch(filters.searchTerm, course.category) ||
        course.tags.some(tag => fuzzySearch(filters.searchTerm, tag))
      );
    }

    // Category filter
    if (filters.selectedCategory) {
      filtered = filtered.filter(course => course.category === filters.selectedCategory);
    }

    // Format filter
    if (filters.selectedFormats.length > 0) {
      filtered = filtered.filter(course =>
        filters.selectedFormats.includes(course.format)
      );
    }

    // Tags filter
    if (filters.selectedTags.length > 0) {
      filtered = filtered.filter(course =>
        filters.selectedTags.some(tag => course.tags.includes(tag))
      );
    }

    // Language filter
    if (filters.selectedLanguage) {
      filtered = filtered.filter(course => course.language === filters.selectedLanguage);
    }

    setFilteredCourses(filtered);
  }, [filters, courses]);

  return (
    <CatalogContext.Provider
      value={{
        courses,
        filteredCourses,
        filters,
        categories,
        updateFilter,
        resetFilters,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (context === undefined) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};
