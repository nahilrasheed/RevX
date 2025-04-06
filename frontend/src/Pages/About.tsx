import React from 'react';
import { Code2 } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <Code2 className="h-16 w-16 text-white mr-4" />
            <h1 className="text-5xl font-bold">REV-X</h1>
          </div>
          
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">About The Platform</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              REV-X is a web-based platform that allows users to upload completed projects, receive ratings and feedback, 
              and explore peer submissions. It is designed to encourage constructive feedback, enhance project quality, 
              and promote collaborative work among students.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Designed as a centralized repository, this platform ensures accessibility and fosters a culture of innovation.
              The project serves as a centralized repository for all projects created by students in our college, providing
              functionalities for uploading, sharing, rating, and viewing projects.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-1000 p-6 rounded-lg ring-1 ring-purple-200">
                <h3 className="text-xl font-bold mb-2">Project Upload</h3>
                <p className="text-gray-400">Upload projects with title, description, tags, and GitHub repository link.</p>
              </div>
              <div className="bg-gray-1000 p-6 rounded-lg ring-1 ring-purple-200">
                <h3 className="text-xl font-bold mb-2">Project Rating</h3>
                <p className="text-gray-400">Rate projects on a 1-5 star scale with average ratings displayed.</p>
              </div>
              <div className="ring-1 ring-purple-200 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Project Viewing</h3>
                <p className="text-gray-400">Browse projects in list or grid view, sorted by rating.</p>
              </div>
              <div className=" p-6 rounded-lg ring-1 ring-purple-200">
                <h3 className="text-xl font-bold mb-2">Search & Filter</h3>
                <p className="text-gray-400">Find projects easily using keyword search and category filters.</p>
              </div>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="ring-1 ring-purple-200 p-6 rounded-lg text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                  A
                </div>
                <h3 className="text-xl font-bold">Adil Omar</h3>
                <p className="text-gray-400">2023BCY0005</p>
              </div>
              <div className=" ring-1 ring-purple-200 p-6 rounded-lg text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                  S
                </div>
                <h3 className="text-xl font-bold">Saumya Shahi</h3>
                <p className="text-gray-400">2023BCY0018</p>
              </div>
              <div className="ring-1 ring-purple-200 p-6 rounded-lg text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                  B
                </div>
                <h3 className="text-xl font-bold">Bhaskar Naik</h3>
                <p className="text-gray-400">2023BCY0031</p>
              </div>
              <div className="ring-1 ring-purple-200 p-6 rounded-lg text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                  K
                </div>
                <h3 className="text-xl font-bold">Kandarp Jindal</h3>
                <p className="text-gray-400">2023BCY0044</p>
              </div>
              <div className=" ring-1 ring-purple-200 p-6 rounded-lg text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                  N
                </div>
                <h3 className="text-xl font-bold">Nahil Rasheed</h3>
                <p className="text-gray-400">2023BCY0057</p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-3xl font-semibold mb-6">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="ring-1 ring-purple-200 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Frontend</h3>
                <ul className="list-disc list-inside text-gray-400">
                  <li>React.js</li>
                  <li>Vite</li>
                  <li>Tailwind CSS</li>
                  <li>TypeScript</li>
                </ul>
              </div>
              <div className="ring-1 ring-purple-200 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Backend</h3>
                <ul className="list-disc list-inside text-gray-400">
                  <li>FastAPI</li>
                  <li>Supabase</li>
                  <li>Python</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
