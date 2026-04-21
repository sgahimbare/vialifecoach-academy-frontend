import React from 'react';
import { useCatalog } from '../context/CatalogContext';
import CourseCard from './CourseCard';
import { BookOpen, Filter } from 'lucide-react';

const CourseGrid: React.FC = () => {
  const { filteredCourses, filters } = useCatalog();

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.selectedCategory) count++;
    if (filters.selectedSkillLevels.length > 0) count++;
    if (filters.selectedFormats.length > 0) count++;
    if (filters.selectedTags.length > 0) count++;
    if (filters.selectedLanguage) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Results Header */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} Available
            </h2>
            {activeFiltersCount > 0 && (
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <Filter className="w-4 h-4 mr-1" />
                <span>{activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied</span>
              </div>
            )}
          </div>
          
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Most Popular</option>
            <option>Newest</option>
            <option>Highest Rated</option>
            <option>Duration: Short to Long</option>
            <option>Duration: Long to Short</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="p-4 lg:p-6">
        {filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 max-w-md">
              Try adjusting your filters or search terms to find the courses you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseGrid;