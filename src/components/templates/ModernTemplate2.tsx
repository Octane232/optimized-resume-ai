
import React from 'react';
import { ResumeData } from '@/types/resume';

interface ModernTemplate2Props {
  data: ResumeData;
  scale?: number;
}

const ModernTemplate2: React.FC<ModernTemplate2Props> = ({ data, scale = 1 }) => {
  return (
    <div 
      className="bg-white font-sans text-gray-900 max-w-2xl mx-auto shadow-lg overflow-hidden"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      <div className="flex">
        {/* Left Column */}
        <div className="w-1/3 bg-gray-100 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.contact.name}</h1>
            <p className="text-blue-600 font-medium">{data.contact.title}</p>
          </div>

          {/* Contact */}
          <section className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">Contact</h3>
            <div className="space-y-2 text-xs">
              <p>{data.contact.email}</p>
              <p>{data.contact.phone}</p>
              <p>{data.contact.location}</p>
              {data.contact.linkedin && <p>{data.contact.linkedin}</p>}
            </div>
          </section>

          {/* Skills */}
          <section className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">Skills</h3>
            <div className="space-y-2">
              {data.skills.map((skill, index) => (
                <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {skill}
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">Education</h3>
            {data.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <h4 className="font-semibold text-xs">{edu.degree}</h4>
                <p className="text-blue-600 text-xs">{edu.institution}</p>
                <p className="text-gray-600 text-xs">{edu.startYear} - {edu.endYear}</p>
              </div>
            ))}
          </section>
        </div>

        {/* Right Column */}
        <div className="w-2/3 p-6">
          {/* Summary */}
          <section className="mb-6">
            <h3 className="text-lg font-bold text-blue-600 mb-3">Professional Summary</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{data.summary}</p>
          </section>

          {/* Experience */}
          <section className="mb-6">
            <h3 className="text-lg font-bold text-blue-600 mb-3">Experience</h3>
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-sm">{exp.title}</h4>
                    <p className="text-blue-600 text-sm">{exp.company}</p>
                  </div>
                  <span className="text-gray-500 text-xs">{exp.startDate} - {exp.endDate}</span>
                </div>
                <ul className="space-y-1 text-xs text-gray-700">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-1 h-1 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Projects */}
          {data.projects && (
            <section>
              <h3 className="text-lg font-bold text-blue-600 mb-3">Projects</h3>
              {data.projects.map((project, index) => (
                <div key={index} className="mb-3">
                  <h4 className="font-semibold text-sm">{project.title}</h4>
                  <p className="text-gray-700 text-xs mb-1">{project.description}</p>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="bg-gray-200 text-gray-700 px-1 py-0.5 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate2;
