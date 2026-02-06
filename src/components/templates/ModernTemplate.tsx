
import React from 'react';
import { ResumeData } from '@/types/resume';

interface ModernTemplateProps {
  data: ResumeData;
  scale?: number;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data, scale = 1 }) => {
  return (
    <div 
      className="bg-white font-sans text-gray-900 max-w-2xl mx-auto shadow-lg overflow-hidden"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <h1 className="text-4xl font-light mb-2">{data.contact.name}</h1>
        <h2 className="text-xl font-medium mb-4">{data.contact.title}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="mb-1">{data.contact.email}</p>
            <p>{data.contact.phone}</p>
          </div>
          <div>
            <p className="mb-1">{data.contact.location}</p>
            {data.contact.linkedin && <p className="mb-1">{data.contact.linkedin}</p>}
            {data.contact.github && <p>{data.contact.github}</p>}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Professional Summary */}
        <section className="mb-8">
          <h3 className="text-2xl font-light text-blue-600 mb-4">Professional Summary</h3>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </section>

        {/* Skills */}
        <section className="mb-8">
          <h3 className="text-2xl font-light text-blue-600 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span 
                key={index} 
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="mb-8">
          <h3 className="text-2xl font-light text-blue-600 mb-4">Experience</h3>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-6 border-l-4 border-blue-200 pl-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-lg font-semibold">{exp.title}</h4>
                  <p className="text-blue-600 font-medium">{exp.company}</p>
                </div>
                <span className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-600">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <ul className="space-y-2 text-gray-700">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Projects */}
        {data.projects && (
          <section className="mb-8">
            <h3 className="text-2xl font-light text-blue-600 mb-4">Projects</h3>
            {data.projects.map((project, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold">{project.title}</h4>
                  {project.link && (
                    <a href={`https://${project.link}`} className="text-blue-600 text-sm hover:underline">
                      View Project
                    </a>
                  )}
                </div>
                <p className="text-gray-700 mb-2">{project.description}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education */}
          <section>
            <h3 className="text-2xl font-light text-blue-600 mb-4">Education</h3>
            {data.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <h4 className="font-semibold">{edu.degree}</h4>
                <p className="text-blue-600">{edu.institution}</p>
                <p className="text-sm text-gray-600">{edu.startYear} - {edu.endYear}</p>
                {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </section>

          {/* Certifications */}
          {data.certifications && (
            <section>
              <h3 className="text-2xl font-light text-blue-600 mb-4">Certifications</h3>
              <ul className="space-y-2">
                {data.certifications.map((cert, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    {cert.name} - {cert.issuer}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
