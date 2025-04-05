import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Check, Tag } from "lucide-react";
import { getProjects, getTags } from "../api/projects";
import { Project, Tag as TagType } from "../types/project";

const Explore = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableTags, setAvailableTags] = useState<TagType[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // Fetch projects and tags concurrently
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [projectResponse, tagResponse] = await Promise.all([
          getProjects(),
          getTags(),
        ]);

        if (
          projectResponse &&
          projectResponse.status === "success" &&
          Array.isArray(projectResponse.data)
        ) {
          setProjects(projectResponse.data);
        } else {
          console.error("Failed to process projects:", projectResponse);
          setError(
            (prevError) =>
              prevError || projectResponse?.message || "Failed to load projects"
          );
          setProjects([]);
        }

        // Process tag response
        if (
          tagResponse &&
          tagResponse.status === "success" &&
          Array.isArray(tagResponse.data)
        ) {
          const validTags = tagResponse.data.filter(
            (tag) => typeof tag.id !== "undefined"
          );
          if (validTags.length !== tagResponse.data.length) {
            console.warn(
              "Some tags received from API were missing the 'id' property and were filtered out."
            );
          }
          setAvailableTags(validTags);
        } else {
          console.error("Failed to process tags:", tagResponse);
          setError(
            (prevError) =>
              prevError || tagResponse?.message || "Failed to load tags"
          );
          setAvailableTags([]);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Error loading data");
        setProjects([]);
        setAvailableTags([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const clearTagFilters = () => {
    setSelectedTagIds([]);
  };

  useEffect(() => {
    let results = projects;

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter((project) => {
        const titleMatch = project.title.toLowerCase().includes(term);
        const descMatch = project.description.toLowerCase().includes(term);
        const tagMatch =
          Array.isArray(project.tags) &&
          project.tags.some((tag) => tag.tag_name.toLowerCase().includes(term));
        return titleMatch || descMatch || tagMatch;
      });
    }

    // Apply tag filter
    if (selectedTagIds.length > 0) {
      results = results.filter((project) => {
        const projectHasTags =
          Array.isArray(project.tags) && project.tags.length > 0;
        if (!projectHasTags) return false;

        const match = project.tags.some((tag) => {
          return (
            typeof tag.tag_id !== "undefined" &&
            selectedTagIds.includes(String(tag.tag_id))
          );
        });
        return match;
      });

      setFilteredProjects(results);
    }

    setFilteredProjects(results);
  }, [searchTerm, selectedTagIds, projects]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4 text-center">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-400 mb-6 text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-150"
        >
          {" "}
          Try Again{" "}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-100">
          Explore Projects
        </h1>

        {/* Search and Filter Controls */}
        <div className="max-w-4xl mx-auto mb-12 space-y-6">
          <div className="relative">
            <div className="flex items-center ring-1 ring-gray-700 bg-gray-900 rounded-lg p-0.5 focus-within:ring-2 focus-within:ring-purple-500 transition duration-150 shadow-sm">
              <div className="pl-3 pr-2 py-2 text-gray-500">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow bg-transparent text-white focus:outline-none p-2.5 placeholder-gray-500 text-sm"
              />
            </div>
          </div>

          {/* Tag Buttons Area */}
          <div className="flex items-center">
            <Tag className="h-4 w-4 text-purple-400 mr-2 flex-shrink-0" />
            {availableTags.length === 0 ? (
              <div className="text-gray-500 text-center py-2 text-sm italic flex-grow">
                No tags available
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 py-2 max-h-36 overflow-y-auto flex-grow pl-0.5">
                {availableTags.map((tag, index) => {
                  if (!tag || typeof tag.id === "undefined") {
                    return null;
                  }
                  const tagIdStr = String(tag.id);
                  const isSelected = selectedTagIds.includes(tagIdStr);
                  const tagButtonClass = isSelected
                    ? "bg-purple-600/80 text-white hover:bg-purple-500 ring-1 ring-purple-300"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 ring-1 ring-gray-600";
                  return (
                    <button
                      key={tag.id}
                      onClick={() => {
                        const currentTagId = String(tag.id);
                        setSelectedTagIds((prevSelected) => {
                          return prevSelected.includes(currentTagId)
                            ? prevSelected.filter(id => id !== currentTagId)
                            : [...prevSelected, currentTagId];
                        });
                      }}
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 
                        transition-all duration-150 ease-in-out cursor-pointer
                        ${tagButtonClass}`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      {tag.tag_name}
                    </button>
                  );
                })}
              </div>
            )}
            
            {selectedTagIds.length > 0 && (
              <button
                onClick={clearTagFilters}
                className="text-purple-400 hover:text-purple-300 flex items-center text-xs sm:text-sm font-medium transition duration-150 ml-3 flex-shrink-0"
              >
                <X className="h-3.5 w-3.5 mr-1" /> Clear ({selectedTagIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Project Grid Display */}
        {filteredProjects.length === 0 && !isLoading ? (
          <div className="text-center py-16">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-400">
              No Matching Projects Found
            </h2>
            <p className="text-gray-500 text-sm">
              Try adjusting your search term or selected tags.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="bg-gray-950 rounded-lg ring-1 ring-gray-700 overflow-hidden hover:ring-2 hover:ring-red-400 transition-all cursor-pointer flex flex-col"
              >
                <div className="aspect-video bg-gray-800 flex items-center justify-center text-gray-500">
                  {Array.isArray(project.images) &&
                  project.images.length > 0 &&
                  project.images[0] ? (
                    <img
                      src={project.images[0]}
                      alt={`Preview image for ${project.title}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; /* Hide broken img */ }}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-white truncate">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 line-clamp-3 mb-4 flex-grow">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {Array.isArray(project.tags) && project.tags.length > 0 ? (
                      project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id ?? tag.tag_id}
                          className="inline-block px-2 py-0.5 text-xs font-medium ring-1 ring-purple-400 bg-purple-900/30 text-purple-300 rounded-full"
                        >
                          {tag.tag_name}
                        </span>
                      ))
                    ) : null}
                    {Array.isArray(project.tags) && project.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
