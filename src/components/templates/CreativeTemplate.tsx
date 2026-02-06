
import React from 'react';
import { ResumeData } from '@/types/resume';

interface CreativeTemplateProps {
  data: ResumeData;
  scale?: number;
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ data, scale = 1 }) => {
  return (
    <div 
      className="bg-white font-sans text-gray-900 max-w-2xl mx-auto shadow-lg overflow-hidden"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-purple-600 to-pink-600 text-white p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-purple-600 text-2xl font-bold">
                {data.contact.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h1 className="text-xl font-bold mb-1">{data.contact.name}</h1>
            <p className="text-purple-100">{data.contact.title}</p>
          </div>

          {/* Contact */}
          <section className="mb-6">
            <h3 className="text-lg font-bold mb-3 border-b border-purple-300 pb-1">Contact</h3>
            <div className="space-y-2 text-sm">
              <p>{data.contact.email}</p>
              <p>{data.contact.phone}</p>
              <p>{data.contact.location}</p>
              {data.contact.linkedin && <p>{data.contact.linkedin}</p>}
            </div>
          </section>

          {/* Skills */}
          <section className="mb-6">
            <h3 className="text-lg font-bold mb-3 border-b border-purple-300 pb-1">Skills</h3>
            <div className="space-y-2">
              {data.skills.map((skill, index) => (
                <div key={index} className="bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
                  {skill}
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h3 className="text-lg font-bold mb-3 border-b border-purple-300 pb-1">Education</h3>
            {data.education.map((edu, index) => (
              <div key={index} className="mb-3 text-sm">
                <h4 className="font-semibold">{edu.degree}</h4>
                <p className="text-purple-100">{edu.institution}</p>
                <p className="text-purple-200 text-xs">{edu.startYear} - {edu.endYear}</p>
              </div>
            ))}
          </section>
        </div>

        {/* Right Content */}
        <div className="w-2/3 p-6">
          {/* Summary */}
          <section className="mb-6">
            <h3 className="text-2xl font-bold text-purple-600 mb-3 relative">
              About Me
              <div className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
            </h3>
            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
          </section>

          {/* Experience */}
          <section className="mb-6">
            <h3 className="text-2xl font-bold text-purple-600 mb-3 relative">
              Experience
              <div className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
            </h3>
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-5 relative pl-6">
                <div className="absolute left-0 top-2 w-3 h-3 bg-purple-400 rounded-full"></div>
                <div className="absolute left-1.5 top-5 w-0.5 h-full bg-purple-200"></div>
                
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{exp.title}</h4>
                    <p className="text-purple-600 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-purple-400 mr-2">▶</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Projects */}
          {data.projects && (
            <section>
              <h3 className="text-2xl font-bold text-purple-600 mb-3 relative">
                Projects
                <div className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
              </h3>
              {data.projects.map((project, index) => (
                <div key={index} className="mb-4 p-4 border-l-4 border-purple-300 bg-purple-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                    {project.link && (
                      <a href={`https://${project.link}`} className="text-purple-600 text-sm hover:underline">
                        View →
                      </a>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm">{project.description}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
