export interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  format: 'Self-paced' | 'Instructor-led' | 'Blended';
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  tags: string[];
  language: string;
  image: string;
  instructor?: string;
  rating?: number;
  enrolled?: number;
}

export interface FilterState {
  searchTerm: string;
  selectedCategory: string;
  selectedSkillLevels: string[];
  selectedFormats: string[];
  selectedTags: string[];
  selectedLanguage: string;
}
