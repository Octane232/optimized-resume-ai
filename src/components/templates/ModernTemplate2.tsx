
import React from 'react';
import { ResumeData } from '@/types/resume';

interface ModernTemplate2Props {
  data: ResumeData;
  scale?: number;
}

const ModernTemplate2: React.FC<ModernTemplate2Props> = ({ data, scale = 1 }) => {
  return (
    <div 
      className="bg-white font-sans text-gray-900 max-w-2xl mx-auto shadow-xl overflow-hidden border-l-8 border-indigo-500"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      <div className="flex">
        {/* Left Column - Dark Theme */}
        <div className="w-1/3 bg-gradient-to-b from-slate-800 to-slate-900 p-6 text-white">
          {/* Profile Section with Avatar */}
          <div className="mb-6 text-center">
            <div className="w-20 h-20 bg-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">
                {data.contact.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mb-1">{data.contact.name}</h1>
            <p className="text-indigo-300 font-medium text-sm">{data.contact.title}</p>
          </div>

          {/* Contact with Icons */}
          <section className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-3 border-b border-slate-700 pb-2">Contact Info</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-indigo-400 rounded-full mr-2"></div>
                <p className="text-gray-300">{data.contact.email}</p>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-indigo-400 rounded-full mr-2"></div>
                <p className="text-gray-300">{data.contact.phone}</p>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-indigo-400 rounded-full mr-2"></div>
                <p className="text-gray-300">{data.contact.location}</p>
              </div>
              {data.contact.linkedin && (
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-400 rounded-full mr-2"></div>
                  <p className="text-gray-300">{data.contact.linkedin}</p>
                </div>
              )}
            </div>
          </section>

          {/* Skills with Progress Bars */}
          <section className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-3 border-b border-slate-700 pb-2">Technical Skills</h3>
            <div className="space-y-3">
              {data.skills.slice(0, 8).map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-300">{skill}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-1.5 rounded-full" 
                      style={{ width: `${85 + (index % 3) * 5}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-3 border-b border-slate-700 pb-2">Education</h3>
            {data.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <h4 className="font-semibold text-xs text-white">{edu.degree}</h4>
                <p className="text-indigo-300 text-xs">{edu.institution}</p>
                <p className="text-gray-400 text-xs">{edu.startYear} - {edu.endYear}</p>
              </div>
            ))}
          </section>
        </div>

        {/* Right Column - Light Theme */}
        <div className="w-2/3 p-6 bg-gray-50">
          {/* Summary with Modern Design */}
          <section className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-1 h-6 bg-indigo-500 mr-3"></div>
              <h3 className="text-lg font-bold text-slate-800">Professional Overview</h3>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-indigo-200">
              <p className="text-gray-700 text-sm leading-relaxed">{data.summary}</p>
            </div>
          </section>

          {/* Experience with Modern Cards */}
          <section className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-1 h-6 bg-indigo-500 mr-3"></div>
              <h3 className="text-lg font-bold text-slate-800">Work Experience</h3>
            </div>
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-4 bg-white rounded-lg shadow-sm p-4 border-l-4 border-indigo-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-800">{exp.title}</h4>
                    <p className="text-indigo-600 text-sm font-medium">{exp.company}</p>
                  </div>
                  <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <ul className="space-y-1 text-xs text-gray-700">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Projects with Modern Layout */}
          {data.projects && (
            <section>
              <div className="flex items-center mb-3">
                <div className="w-1 h-6 bg-indigo-500 mr-3"></div>
                <h3 className="text-lg font-bold text-slate-800">Key Projects</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {data.projects.map((project, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-indigo-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm text-slate-800">{project.title}</h4>
                      {project.link && (
                        <a href={`https://${project.link}`} className="text-indigo-600 text-xs hover:underline bg-indigo-50 px-2 py-1 rounded">
                          View →
                        </a>
                      )}
                    </div>
                    <p className="text-gray-700 text-xs mb-2">{project.description}</p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate2;
