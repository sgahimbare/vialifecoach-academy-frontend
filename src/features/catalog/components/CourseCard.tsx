import React from 'react';
import { Clock, Users, Star, BookOpen, Award } from 'lucide-react';
import type { Course } from '../types/coursetypes';
import { Link } from 'react-router-dom';


interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'Self-paced':
        return <BookOpen className="w-4 h-4" />;
      case 'Instructor-led':
        return <Users className="w-4 h-4" />;
      case 'Blended':
        return <Award className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Free':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Certification':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Career Path':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Premium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Hot Topic':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Popular':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className="relative overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSkillLevelColor(course.skillLevel)}`}>
            {course.skillLevel}
          </span>
        </div> */}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-blue-600">{course.category}</span>
          <div className="flex items-center text-gray-500">
            {getFormatIcon(course.format)}
            <span className="text-xs ml-1">{course.format}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {course.tags.map((tag, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs font-medium rounded-md border ${getTagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{course.duration}</span>
          </div>
          
          {course.rating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
              <span className="font-medium text-gray-900">{course.rating}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {course.instructor && (
              <span>by {course.instructor}</span>
            )}
          </div>
          
          {course.enrolled && (
            <div className="flex items-center text-xs text-gray-500">
              <Users className="w-3 h-3 mr-1" />
              <span>{course.enrolled.toLocaleString()} enrolled</span>
            </div>
          )}
        </div>

        <Link to={`/courses/${course.id}`}>
          <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            View Course
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
