import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projects } from './Projects';

const ProjectDescription = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Find project by ID (simulate fetching from API)
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Project Header */}
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/2">
            <div className="aspect-video bg-gray-700 rounded-lg"></div>
          </div>

          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            <span className="inline-block mb-4 px-3 py-1 text-sm bg-green-600 rounded-full">
              {project.category}
            </span>
            <p className="mb-8 text-gray-400">{project.description}</p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-600 transition"
              >
                Back to Projects
              </button>
              <button
                className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-700 transition"
              >
                Edit Project
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Latest Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first!</p>
            ) : (
              project.reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 rounded-lg hover:ring-2 hover:ring-gray-600"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <img
                      src={review.avatar}
                      alt={review.reviewer}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{review.reviewer}</p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">{review.title}</h3>
                  <p className="text-gray-400 mt-2">{review.body}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Report Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Report Bugs or Comments</h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Write a complaint..."
              className="flex-grow p-3 rounded-lg bg-gray-800 focus:outline-none"
            />
            <button className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-300">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDescription;
