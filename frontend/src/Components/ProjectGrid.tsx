import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { projects } from './Projects';
import { categories } from './Categories';

const ProjectGrid = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filter logic: Show all if no category selected
  const filteredProjects = selectedCategory
    ? projects.filter((project) => project.category === selectedCategory)
    : projects;

  return (
    <div>
      {/* Filter Section */}
      <div className="container mx-auto px-6 mb-8">
        <button
          className="flex items-center space-x-2 bg-gray-800 rounded-lg px-4 py-2"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          {isFilterOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span>Filter by Category</span>
          <Search className="h-5 w-5" />
        </button>

        {isFilterOpen && (
          <div className="mt-4 bg-gray-800 rounded-lg p-4">
            <button
              className={`block w-full text-left px-4 py-2 hover:bg-gray-700 rounded ${!selectedCategory ? 'bg-gray-600' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-700 rounded ${
                  category === selectedCategory ? 'bg-gray-600' : ''
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full">
              No projects found for this category.
            </p>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-600 transition-all cursor-pointer"
              >
                <div className="aspect-video bg-gray-700"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-400">{project.description}</p>
                  <span className="inline-block mt-4 text-sm bg-gray-700 text-gray-300 px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectGrid;
