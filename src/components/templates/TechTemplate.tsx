
import React from 'react';
import { ResumeData } from '@/types/resume';

interface TechTemplateProps {
  data: ResumeData;
  scale?: number;
}

const TechTemplate: React.FC<TechTemplateProps> = ({ data, scale = 1 }) => {
  return (
    <div 
      className="bg-gray-900 text-gray-100 font-mono max-w-2xl mx-auto shadow-lg"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      {/* Header */}
      <div className="bg-green-400 text-gray-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">{data.contact.name}</h1>
            <h2 className="text-lg">{data.contact.title}</h2>
          </div>
          <div className="text-right text-sm">
            <p>{data.contact.email}</p>
            <p>{data.contact.phone}</p>
            <p>{data.contact.location}</p>
            {data.contact.linkedin && <p>{data.contact.linkedin}</p>}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        <section className="mb-6">
          <h3 className="text-green-400 text-lg font-bold mb-3 flex items-center">
            <span className="mr-2">{'>'}</span> About
          </h3>
          <div className="bg-gray-800 p-4 rounded border-l-4 border-green-400">
            <p className="text-gray-300 leading-relaxed">{data.summary}</p>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-6">
          <h3 className="text-green-400 text-lg font-bold mb-3 flex items-center">
            <span className="mr-2">{'>'}</span> Skills
          </h3>
          <div className="bg-gray-800 p-4 rounded">
            <div className="grid grid-cols-2 gap-2">
              {data.skills.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-green-400 mr-2">$</span>
                  <span className="text-gray-300">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="mb-6">
          <h3 className="text-green-400 text-lg font-bold mb-3 flex items-center">
            <span className="mr-2">{'>'}</span> Experience
          </h3>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4 bg-gray-800 p-4 rounded border-l-4 border-blue-400">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-blue-400 font-bold">{exp.title}</h4>
                  <p className="text-yellow-400">{exp.company}</p>
                </div>
                <span className="text-gray-400 text-sm bg-gray-700 px-2 py-1 rounded">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <ul className="space-y-1 text-sm">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start text-gray-300">
                    <span className="text-green-400 mr-2 mt-1">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Projects */}
        {data.projects && (
          <section className="mb-6">
            <h3 className="text-green-400 text-lg font-bold mb-3 flex items-center">
              <span className="mr-2">{'>'}</span> Projects
            </h3>
            {data.projects.map((project, index) => (
              <div key={index} className="mb-4 bg-gray-800 p-4 rounded border-l-4 border-purple-400">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-purple-400 font-bold">{project.title}</h4>
                  {project.link && (
                    <a 
                      href={`https://${project.link}`} 
                      className="text-green-400 text-sm hover:underline"
                    >
                      [Link]
                    </a>
                  )}
                </div>
                <p className="text-gray-300 text-sm mb-2">{project.description}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="bg-gray-700 text-green-400 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education */}
          <section>
            <h3 className="text-green-400 text-lg font-bold mb-3 flex items-center">
              <span className="mr-2">{'>'}</span> Education
            </h3>
            <div className="bg-gray-800 p-4 rounded">
              {data.education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <h4 className="text-blue-400 font-bold text-sm">{edu.degree}</h4>
                  <p className="text-yellow-400 text-sm">{edu.institution}</p>
                  <p className="text-gray-400 text-xs">{edu.startYear} - {edu.endYear}</p>
                  {edu.gpa && <p className="text-gray-400 text-xs">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          {data.certifications && (
            <section>
              <h3 className="text-green-400 text-lg font-bold mb-3 flex items-center">
                <span className="mr-2">{'>'}</span> Certifications
              </h3>
              <div className="bg-gray-800 p-4 rounded">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <span className="text-green-400 mr-2">✓</span>
                    <span className="text-gray-300 text-sm">{cert.name} - {cert.issuer}</span>
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

export default TechTemplate;
