import React from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { filters, categories, updateFilter, resetFilters } = useCatalog();
  const formats = ['Self-paced', 'Instructor-led'];
  const tags = ['Free', 'Certification', 'Career Path', 'Premium', 'Popular'];
  const languages = ['English'];

  const handleCheckboxChange = (
    filterKey: 'selectedSkillLevels' | 'selectedFormats' | 'selectedTags',
    value: string,
    checked: boolean
  ) => {
    const currentValues = filters[filterKey];
    if (checked) {
      updateFilter(filterKey, [...currentValues, value]);
    } else {
      updateFilter(filterKey, currentValues.filter(item => item !== value));
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-80 bg-white shadow-xl lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-gray-200 flex flex-col
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={resetFilters}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Reset filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={filters.selectedCategory === ''}
                  onChange={() => updateFilter('selectedCategory', '')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">All Categories</span>
              </label>
              {categories.map(category => (
                <label key={category} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.selectedCategory === category}
                    onChange={() => updateFilter('selectedCategory', category)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Format */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Format</h3>
            <div className="space-y-2">
              {formats.map(format => (
                <label key={format} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.selectedFormats.includes(format)}
                    onChange={(e) => handleCheckboxChange('selectedFormats', format, e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{format}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
            <div className="space-y-2">
              {tags.map(tag => (
                <label key={tag} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.selectedTags.includes(tag)}
                    onChange={(e) => handleCheckboxChange('selectedTags', tag, e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{tag}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Language</h3>
            <select
              value={filters.selectedLanguage}
              onChange={(e) => updateFilter('selectedLanguage', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Languages</option>
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;